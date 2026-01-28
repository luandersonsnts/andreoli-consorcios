import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Calculator, TrendingUp, PiggyBank, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { isStaticSite, openWhatsAppWithMessage, getWhatsAppUrlWithMessage } from '@/lib/runtimeEnv';
import { calculateConsortium, formatConsortiumForWhatsApp } from '@/lib/consortiumCalculator';
import { ConsortiumCategory, ConsortiumGroup, getGroupById } from '@shared/consortiumTypes';
import ConsortiumGroupSelector from './ConsortiumGroupSelector';

// Schema para validação do formulário
const consortiumFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  email: z.string().email("Email inválido"),
  category: z.string().min(1, "Categoria é obrigatória"),
  groupId: z.string().min(1, "Grupo é obrigatório"),
  creditValue: z.string().min(1, "Valor do crédito é obrigatório"),
  useEmbedded: z.boolean().optional(),
  maxInstallmentValue: z.string().min(1, "Valor da parcela é obrigatório"),
  installmentCount: z.string().min(1, "Número de parcelas é obrigatório"),
}).refine((data) => {
  const installmentCount = parseInt(data.installmentCount);
  
  // Validar número de parcelas (mínimo 3, máximo 120)
  if (isNaN(installmentCount) || installmentCount < 3 || installmentCount > 120) {
    return false;
  }
  
  return true;
}, {
  message: "O número de parcelas deve ser entre 3 e 120.",
  path: ["installmentCount"]
}).refine((data) => {
  const creditValue = parseFloat(data.creditValue.replace(/[^\d,]/g, '').replace(',', '.'));
  const maxInstallmentValue = parseFloat(data.maxInstallmentValue.replace(/[^\d,]/g, '').replace(',', '.'));
  const installmentCount = parseInt(data.installmentCount);
  const useEmbedded = data.useEmbedded || false;

  if (isNaN(creditValue) || isNaN(maxInstallmentValue) || isNaN(installmentCount)) {
    return false;
  }

  // Validar se o número de parcelas está no range correto
  if (installmentCount < 3 || installmentCount > 120) {
    return false;
  }

  // Para lance embutido, usar a fórmula correta: X = Valor desejado / (1 - (Lance% / 100))
  let valorCartaNecessario = creditValue;
  if (useEmbedded) {
    // Assumindo lance padrão de 50% para embutido
    valorCartaNecessario = creditValue / (1 - (50 / 100));
  }

  // Calcular o valor total do plano (carta + 16% taxa administrativa + 0.5% fundo reserva)
  const valorTotalPlano = valorCartaNecessario * (1 + 0.16 + 0.005);
  
  // Calcular valor mínimo da parcela baseado no número de parcelas
  const minInstallmentValue = valorTotalPlano / installmentCount;

  // Permitir uma margem de tolerância de 15% para flexibilidade
  const minInstallmentValueWithTolerance = minInstallmentValue * 0.85;
  
  return maxInstallmentValue >= minInstallmentValueWithTolerance;
}, {
  message: "Valor da parcela muito baixo para o número de parcelas selecionado. Aumente o valor da parcela ou diminua o número de parcelas.",
  path: ["maxInstallmentValue"]
});

type ConsortiumFormData = z.infer<typeof consortiumFormSchema>;
type Step = 'category' | 'group' | 'form' | 'result';

interface ConsortiumCalculationResult {
  grupo: number;
  valorCarta: number;
  valorCartaReal: number; // Valor da carta que será usada (pode ser maior que o desejado)
  parcelaAtual: number;
  lanceTotal: number;
  lanceEmbutido: number;
  lanceDeduzido: number;
  parcelasRestantes: number;
  novaParcelaValor: number;
  parcelasAposContemplado: number; // Novo campo solicitado
  encargos: {
    fundoReserva: number;
    taxaAdm: number;
    seguroVida: number;
    seguroQuebra: number;
  };
}

function calculateConsortiumWithGroup(data: ConsortiumFormData, group: ConsortiumGroup): ConsortiumCalculationResult {
  const creditValue = parseFloat(data.creditValue);
  const maxInstallmentValue = parseFloat(data.maxInstallmentValue);
  const installmentCount = parseInt(data.installmentCount);
  const useEmbedded = data.useEmbedded || false;

  // Usar os mesmos parâmetros da simulação avançada baseados na categoria
  const categoria = {
    fr: 0.005,    // 0,5% - Fundo de Reserva
    adm: 0.16,    // 16% - Taxa de Administração
    sv: 0.0012,   // 0,12% ao mês - Seguro de Vida
    sq: 0.0007,   // 0,07% ao mês - Seguro Quebra
  };

  // Calcular valor da carta usando a mesma fórmula da simulação avançada
  let valorCartaReal = creditValue;
  let lanceEmbutido = 0;
  
  if (useEmbedded) {
    // Usar fórmula correta: X = Valor desejado / (1 - (Lance% / 100))
    // Para 50% de lance: X = 50000 / (1 - 0.5) = 100000
    const lancePercentual = 50; // Padrão para lance embutido
    valorCartaReal = creditValue / (1 - (lancePercentual / 100));
    lanceEmbutido = valorCartaReal * (lancePercentual / 100);
  }

  // Calcular encargos usando os mesmos parâmetros da simulação avançada
  const fundoReserva = valorCartaReal * categoria.fr;
  const taxaAdm = valorCartaReal * categoria.adm;
  const seguroVida = valorCartaReal * categoria.sv;
  const seguroQuebra = valorCartaReal * categoria.sq;
  const segurosTotal = seguroVida + seguroQuebra;

  // Valor total do plano
  const valorTotalPlano = valorCartaReal + fundoReserva + taxaAdm;

  // Fórmula principal: Z = (VC + FR + ADM) / N + (VC × (SV + SQ))
  const parcelaMensal = (valorTotalPlano / installmentCount) + segurosTotal;

  // Calcular lance
  let lanceTotal = 0;
  let lanceDeduzido = 0;
  let parcelaAposContemplado = maxInstallmentValue;

  if (useEmbedded) {
    const lancePercentual = 50; // 50% para lance embutido
    lanceTotal = valorCartaReal * (lancePercentual / 100);
    lanceDeduzido = 0; // Lance embutido não precisa ser pago em dinheiro
    
    // Calcular redução da parcela após contemplação
    const fatorReducao = 1 - (lanceTotal / valorTotalPlano);
    parcelaAposContemplado = parcelaMensal * fatorReducao;
  } else {
    // Lance normal de 53%
    const lancePercentual = 53;
    lanceTotal = valorCartaReal * (lancePercentual / 100);
    lanceDeduzido = lanceTotal;
    
    // Calcular redução da parcela após contemplação
    const fatorReducao = 1 - (lanceTotal / valorTotalPlano);
    parcelaAposContemplado = parcelaMensal * fatorReducao;
  }

  // Extrair número do grupo do ID
  const grupoNumero = group.name.match(/\d+/)?.[0] || group.id.replace(/[A-Z]/g, '');

  return {
    grupo: parseInt(grupoNumero) || 0,
    valorCarta: creditValue,
    valorCartaReal,
    parcelaAtual: maxInstallmentValue,
    lanceTotal,
    lanceEmbutido: useEmbedded ? lanceEmbutido : 0,
    lanceDeduzido,
    parcelasRestantes: installmentCount - 1,
    novaParcelaValor: parcelaAposContemplado,
    parcelasAposContemplado: parcelaAposContemplado,
    encargos: {
      fundoReserva,
      taxaAdm,
      seguroVida: seguroVida * installmentCount, // Total do seguro
      seguroQuebra: seguroQuebra * installmentCount // Total do seguro
    }
  };
}

const formatMoney = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

interface NewConsortiumSimulationFormProps {
  preSelectedCategory?: ConsortiumCategory;
}

export default function NewConsortiumSimulationForm({ preSelectedCategory }: NewConsortiumSimulationFormProps) {
  const [step, setStep] = useState<Step>(preSelectedCategory ? 'group' : 'category');
  const [selectedCategory, setSelectedCategory] = useState<ConsortiumCategory | undefined>(preSelectedCategory);
  const [selectedGroup, setSelectedGroup] = useState<ConsortiumGroup | undefined>();
  const [calculation, setCalculation] = useState<ConsortiumCalculationResult | null>(null);
  const [useEmbedded, setUseEmbedded] = useState(false);
  const [simulationId, setSimulationId] = useState<number | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation para enviar dados para o backend (SIMULAR E ENVIAR)
  const mutation = useMutation({
    mutationFn: async (data: ConsortiumFormData) => {
      console.log('🚀 Mutation iniciada com dados:', data);
      const formattedData = {
        ...data,
        creditValue: parseFloat(data.creditValue.replace(/[^\d,]/g, '').replace(',', '.')),
        maxInstallmentValue: parseFloat(data.maxInstallmentValue.replace(/[^\d,]/g, '').replace(',', '.')),
        installmentCount: parseInt(data.installmentCount),
        useEmbedded: data.useEmbedded || false
      };
      console.log('📦 Dados formatados para envio:', formattedData);
      console.log('🌐 Fazendo requisição POST para /api/consortium-simulations...');
      const response = await apiRequest("POST", "/api/consortium-simulations", formattedData);
      console.log('✅ Resposta recebida:', response.status, response.statusText);
      const result = await response.json();
      console.log('📄 Dados da resposta:', result);
      return result;
    },
    onSuccess: (result) => {
      // Invalidar queries para atualizar o painel administrativo
      queryClient.invalidateQueries({ queryKey: ["/api/consortium-simulations"] });
      console.log('✅ Mutation bem-sucedida! Resultado:', result);
    },
    onError: (error: any) => {
      console.error('❌ Erro na mutation:', error);
      console.error('❌ Stack trace:', error.stack);
      // Não mostrar erro para o usuário, pois o localStorage ainda funciona
    },
  });

  // Mutation para salvar simulação sem enviar WhatsApp (SIMULAR APENAS)
  const simulateOnlyMutation = useMutation({
    mutationFn: async (data: ConsortiumFormData) => {
      console.log('📊 Simulação APENAS - salvando no banco com status "Não enviado"');
      const formattedData = {
        ...data,
        creditValue: parseFloat(data.creditValue.replace(/[^\d,]/g, '').replace(',', '.')),
        maxInstallmentValue: parseFloat(data.maxInstallmentValue.replace(/[^\d,]/g, '').replace(',', '.')),
        installmentCount: parseInt(data.installmentCount),
        useEmbedded: data.useEmbedded || false,
        whatsappSent: false // Marca como não enviado
      };
      console.log('📦 Dados formatados para simulação apenas:', formattedData);
      const response = await apiRequest("POST", "/api/consortium-simulations", formattedData);
      const result = await response.json();
      console.log('✅ Simulação salva no banco com status "Não enviado"');
      return result;
    },
    onSuccess: (result) => {
      // Invalidar queries para atualizar o painel administrativo
      queryClient.invalidateQueries({ queryKey: ["/api/consortium-simulations"] });
      console.log('✅ Simulação APENAS salva com sucesso!', result);
    },
    onError: (error: any) => {
      console.error('❌ Erro ao salvar simulação apenas:', error);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError
  } = useForm<ConsortiumFormData>({
    resolver: zodResolver(consortiumFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      category: '',
      groupId: '',
      creditValue: '',
      maxInstallmentValue: '',
      installmentCount: '',
      useEmbedded: false
    }
  });

  // Atualizar valores do formulário quando categoria e grupo são selecionados
  useEffect(() => {
    if (selectedCategory) {
      setValue('category', selectedCategory);
      console.log('🔧 Category definida no formulário:', selectedCategory);
    }
  }, [selectedCategory, setValue]);

  useEffect(() => {
    if (selectedGroup) {
      setValue('groupId', selectedGroup.id);
      console.log('🔧 GroupId definido no formulário:', selectedGroup.id);
    }
  }, [selectedGroup, setValue]);

  // Função para salvar simulação no localStorage
  const saveSimulationToLocalStorage = (data: ConsortiumFormData, calculation: ConsortiumCalculationResult) => {
    const simulation = {
      id: Date.now().toString(),
      ...data,
      creditValue: parseFloat(data.creditValue),
      maxInstallmentValue: parseFloat(data.maxInstallmentValue),
      installmentCount: parseInt(data.installmentCount),
      useEmbedded: data.useEmbedded || false,
      calculation,
      createdAt: new Date().toISOString()
    };

    // Recuperar simulações existentes
    const existingSimulations = JSON.parse(localStorage.getItem('consortium-simulations') || '[]');
    
    // Adicionar nova simulação
    existingSimulations.push(simulation);
    
    // Manter apenas as últimas 50 simulações
    if (existingSimulations.length > 50) {
      existingSimulations.splice(0, existingSimulations.length - 50);
    }
    
    // Salvar no localStorage
    localStorage.setItem('consortium-simulations', JSON.stringify(existingSimulations));
    
    return simulation;
  };

  // Reagir às mudanças na preSelectedCategory
  useEffect(() => {
    if (preSelectedCategory && preSelectedCategory !== selectedCategory) {
      setSelectedCategory(preSelectedCategory);
      setValue('category', preSelectedCategory);
      setStep('group');
      setSelectedGroup(undefined);
      setCalculation(null);
    }
  }, [preSelectedCategory, selectedCategory, setValue]);

  const onCategorySelect = (category: ConsortiumCategory) => {
    setSelectedCategory(category);
    setValue('category', category);
    setStep('group');
  };

  const onGroupSelect = (group: ConsortiumGroup) => {
    setSelectedGroup(group);
    setValue('groupId', group.id);
    setStep('form');
  };

  const onSubmit = async (data: ConsortiumFormData) => {
    console.log('🎯 onSubmit chamada! Dados recebidos:', data);
    console.log('🎯 selectedGroup:', selectedGroup);
    console.log('🎯 selectedCategory:', selectedCategory);
    console.log('🚨 ATENÇÃO: onSubmit foi chamada - isso deveria acontecer apenas com SIMULAR E ENVIAR!');
    if (!selectedGroup) {
      console.log('❌ selectedGroup não encontrado, retornando...');
      return;
    }
    
    const result = calculateConsortiumWithGroup(data, selectedGroup);
    setCalculation(result);
    setStep('result');
    
    // Salvar simulação no localStorage
    const savedSimulation = saveSimulationToLocalStorage(data, result);
    setSimulationId(parseInt(savedSimulation.id, 10));
    
    // Preparar dados completos para envio ao backend
    const completeData = {
      ...data,
      category: selectedCategory!,
      groupId: selectedGroup.id,
      creditValue: parseFloat(data.creditValue),
      maxInstallmentValue: parseFloat(data.maxInstallmentValue),
      installmentCount: parseInt(data.installmentCount),
      useEmbedded: useEmbedded,
      whatsappSent: true
    };
    
    // Debug logs
    console.log('🔍 Debug - isStaticSite:', isStaticSite);
    console.log('🔍 Debug - VITE_STATIC_SITE env:', import.meta.env.VITE_STATIC_SITE);
    console.log('🔍 Debug - Dados originais:', data);
    console.log('🔍 Debug - Dados completos para envio:', completeData);
    
    // Enviar dados para o backend (não bloqueia o fluxo se falhar)
    if (!isStaticSite) {
      console.log('✅ Enviando dados para o backend...');
      try {
        mutation.mutate({
          ...completeData,
          creditValue: completeData.creditValue.toString(),
          maxInstallmentValue: completeData.maxInstallmentValue.toString(),
          installmentCount: completeData.installmentCount.toString(),
          category: completeData.category,
          groupId: completeData.groupId
        });
      } catch (error) {
        console.error('❌ Erro ao enviar para o backend:', error);
        // Continua o fluxo normalmente mesmo se falhar
      }
    } else {
      console.log('⚠️ Modo estático ativo - não enviando para o backend');
    }
    
    // Preparar mensagem para WhatsApp usando o resultado já calculado
    const message = formatConsortiumForWhatsApp(
      data.name,
      data.phone,
      data.email,
      result
    );
    
    // Abrir WhatsApp automaticamente
    openWhatsAppWithMessage(message);
    
    toast({
      title: "Simulação calculada!",
      description: "Sua simulação foi salva e o WhatsApp foi aberto para continuar o atendimento."
    });
  };

  const handleCalculateOnly = (e?: React.MouseEvent) => {
    e?.preventDefault();
    console.log('✅ handleCalculateOnly chamada - SIMULAR APENAS clicado');
    if (!selectedGroup) return;
    
    const formData = watch();
    
    // Aplicar a mesma validação do schema antes de calcular
    try {
      const validatedData = consortiumFormSchema.parse({
        ...formData,
        useEmbedded: useEmbedded
      });
      
      const result = calculateConsortiumWithGroup({
        ...validatedData,
        name: validatedData.name || '',
        phone: validatedData.phone || '',
        email: validatedData.email || '',
        category: selectedCategory!,
        groupId: selectedGroup.id,
        useEmbedded: useEmbedded
      }, selectedGroup);
      
      // Salvar simulação no localStorage
      const savedSimulation = saveSimulationToLocalStorage(validatedData, result);
      setSimulationId(parseInt(savedSimulation.id, 10));
      
      // Mostrar o resultado
      setCalculation(result);
      setStep('result');
      
      // Preparar dados completos para envio ao backend
      const completeData = {
        ...validatedData,
        category: selectedCategory!,
        groupId: selectedGroup.id,
        creditValue: parseFloat(validatedData.creditValue),
        maxInstallmentValue: parseFloat(validatedData.maxInstallmentValue),
        installmentCount: parseInt(validatedData.installmentCount),
        useEmbedded: useEmbedded,
        whatsappSent: false
      };
      
      // Salvar no banco de dados com status "Não enviado" (não bloqueia o fluxo se falhar)
      if (!isStaticSite) {
        console.log('💾 Salvando simulação no banco com status "Não enviado"...');
        try {
          simulateOnlyMutation.mutate({
            ...completeData,
            creditValue: completeData.creditValue.toString(),
            maxInstallmentValue: completeData.maxInstallmentValue.toString(),
            installmentCount: completeData.installmentCount.toString()
          });
        } catch (error) {
          console.error('❌ Erro ao salvar simulação no banco:', error);
          // Continua o fluxo normalmente mesmo se falhar
        }
      } else {
        console.log('⚠️ Modo estático ativo - não salvando no banco');
      }
      
      console.log('📊 Simulação calculada e salva com status "Não enviado":', result);
      
      toast({
        title: "Simulação calculada!",
        description: "Sua simulação foi salva no sistema."
      });
    } catch (error) {
      // Se a validação falhar, mostrar os erros no formulário
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            setError(err.path[0] as any, {
              type: 'manual',
              message: err.message
            });
          }
        });
      }
    }
  };

  const goBack = () => {
    if (step === 'group' && !preSelectedCategory) {
      setStep('category');
      setSelectedCategory(undefined);
    } else if (step === 'form') {
      setStep('group');
      setSelectedGroup(undefined);
    } else if (step === 'result') {
      setStep('form');
      setCalculation(null);
    }
  };

  const goToNewSimulation = () => {
    setStep('category');
    setSelectedCategory(undefined);
    setSelectedGroup(undefined);
    setCalculation(null);
  };

  return (
    <section id="consorcio" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-firme-gray mb-4">
              SIMULAÇÃO DE CONSÓRCIO
            </h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              {step !== 'category' && !(step === 'group' && preSelectedCategory) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  className="text-firme-blue"
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Voltar
                </Button>
              )}
              <Link href="/simulacao-unificada">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-firme-blue hover:bg-firme-blue/90 text-white"
                >
                  <Calculator className="w-4 h-4 mr-1" />
                  Simulação Unificada
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Formulário */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              {step === 'category' && !preSelectedCategory && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-firme-blue/10 rounded-full flex items-center justify-center">
                    <Calculator className="w-8 h-8 text-firme-blue" />
                  </div>
                  <h3 className="text-xl font-bold text-firme-blue mb-2">
                    Escolha seu Consórcio
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Clique em um dos botões coloridos acima para começar sua simulação
                  </p>
                  <div className="text-sm text-gray-500">
                    ↑ Eletros • Carro • Imóveis • Moto • Serviços • Barco • Energia Solar
                  </div>
                  <div className="mt-6">
                    <Button
                      onClick={() => {
                        // Rola para os botões de categoria
                        const consortiumButtons = document.querySelector('[data-consortium-buttons]');
                        if (consortiumButtons) {
                          consortiumButtons.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className="bg-firme-blue text-white hover:bg-firme-blue-light"
                    >
                      Ver Opções de Consórcio
                    </Button>
                  </div>
                </div>
              )}

              {step === 'group' && selectedCategory && (
                <ConsortiumGroupSelector
                  category={selectedCategory}
                  onGroupSelect={onGroupSelect}
                  selectedGroup={selectedGroup}
                />
              )}

              {step === 'form' && selectedGroup && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-firme-blue mb-2">
                      Dados da Simulação
                    </h3>
                    <p className="text-sm text-gray-600">
                      Grupo selecionado: <strong>{selectedGroup.name}</strong> ({selectedGroup.adminTax}% taxa admin)
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      console.log('🔍 Enter pressionado no formulário');
                      console.log('🔍 Elemento ativo:', document.activeElement);
                      console.log('🔍 Tag do elemento ativo:', document.activeElement?.tagName);
                      console.log('🔍 Tipo do elemento ativo:', (document.activeElement as any)?.type);
                    }
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          {...register("name")}
                          id="name"
                          placeholder="Seu nome completo"
                          data-testid="input-name"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          {...register("phone")}
                          id="phone"
                          placeholder="(87) 99999-9999"
                          data-testid="input-phone"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        {...register("email")}
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        data-testid="input-email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="creditValue">Valor do Crédito (R$) *</Label>
                        <Input
                          {...register("creditValue")}
                          id="creditValue"
                          placeholder="50000"
                          data-testid="input-credit-value"
                        />
                        {errors.creditValue && (
                          <p className="text-red-500 text-sm mt-1">{errors.creditValue.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="maxInstallmentValue">Valor Máximo da Parcela (R$) *</Label>
                        <Input
                          {...register("maxInstallmentValue")}
                          id="maxInstallmentValue"
                          placeholder="800"
                          data-testid="input-max-installment"
                        />
                        {errors.maxInstallmentValue && (
                          <p className="text-red-500 text-sm mt-1">{errors.maxInstallmentValue.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="installmentCount">Número de Parcelas *</Label>
                      <Input
                        {...register("installmentCount")}
                        id="installmentCount"
                        placeholder="60"
                        data-testid="input-installment-count"
                      />
                      {errors.installmentCount && (
                        <p className="text-red-500 text-sm mt-1">{errors.installmentCount.message}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="useEmbedded"
                        checked={useEmbedded}
                        onCheckedChange={(checked) => {
                          setUseEmbedded(checked as boolean);
                          setValue('useEmbedded', checked as boolean);
                        }}
                        data-testid="checkbox-embedded"
                      />
                      <Label htmlFor="useEmbedded" className="text-sm">
                        Quero usar lance embutido (até 15% do total)
                      </Label>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <Button
                        type="button"
                        onClick={handleCalculateOnly}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                        data-testid="button-calculate-only"
                      >
                        <Calculator className="w-5 h-5 mr-2" />
                        SIMULAR APENAS
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-firme-blue text-white hover:bg-firme-blue-light"
                        data-testid="button-submit"
                      >
                        <Calculator className="w-5 h-5 mr-2" />
                        {isSubmitting ? "Enviando..." : "SIMULAR E ENVIAR"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {step === 'result' && calculation && selectedGroup && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-firme-blue">
                      PROPOSTA GERADA
                    </h3>
                    <Button
                      variant="outline"
                      onClick={goToNewSimulation}
                      data-testid="button-new-simulation"
                    >
                      Nova Simulação
                    </Button>
                  </div>
                  
                  {/* Proposta no formato simplificado */}
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
                    <div className="text-center font-bold text-firme-blue mb-4">PROPOSTA ANDREOLI CONSÓRCIOS</div>
                    <div className="space-y-3 text-firme-gray">
                      
                      {/* Exibição para simulação COM lance embutido */}
                      {calculation.lanceEmbutido > 0 && calculation.valorCartaReal !== calculation.valorCarta ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Carta selecionada para o embutido</span>
                            <span className="font-bold">{formatMoney(calculation.valorCartaReal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">1ª Parcela da carta selecionada</span>
                            <span className="font-bold">{formatMoney(calculation.parcelaAtual)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Crédito disponível para uso</span>
                            <span className="font-bold text-green-600">{formatMoney(calculation.valorCarta)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-600">Lance necessário 53%</span>
                            <span className="font-bold text-firme-blue">{formatMoney(calculation.lanceTotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Lance embutido</span>
                            <span className="font-bold text-green-600">{formatMoney(calculation.lanceEmbutido)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-600 font-medium">Lance a pagar</span>
                            <span className="font-bold text-lg text-firme-blue">{formatMoney(calculation.lanceDeduzido)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-600">Parcelas após contemplado</span>
                            <span className="font-bold text-green-600">{formatMoney(calculation.parcelasAposContemplado)}</span>
                          </div>
                        </>
                      ) : (
                        /* Exibição para simulação SEM lance embutido */
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Grupo</span>
                            <span className="font-bold">{calculation.grupo}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Valor da carta</span>
                            <span className="font-bold">{formatMoney(calculation.valorCarta)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Valor da primeira parcela</span>
                            <span className="font-bold">{formatMoney(calculation.parcelaAtual)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-600">Lance necessário 53%</span>
                            <span className="font-bold text-firme-blue">{formatMoney(calculation.lanceTotal)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-600">Parcelas após contemplado</span>
                            <span className="font-bold text-green-600">{formatMoney(calculation.parcelasAposContemplado)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Botão para contratar */}
                  <div className="mt-6 pt-4 border-t">
                    <Button
                      onClick={async () => {
                        const whatsappMessage = `Olá! Gostaria de contratar o consórcio com as seguintes informações:

===== PROPOSTA ANDREOLI CONSÓRCIOS =====
${calculation.lanceEmbutido > 0 && calculation.valorCartaReal !== calculation.valorCarta ? `Carta selecionada para o embutido: ${formatMoney(calculation.valorCartaReal)}
1ª Parcela da carta selecionada: ${formatMoney(calculation.parcelaAtual)}
Crédito disponível para uso: ${formatMoney(calculation.valorCarta)}
Lance necessário 53%: ${formatMoney(calculation.lanceTotal)}
Lance embutido: ${formatMoney(calculation.lanceEmbutido)}
Lance a pagar: ${formatMoney(calculation.lanceDeduzido)}
Parcelas após contemplado: ${formatMoney(calculation.parcelasAposContemplado)}` : `Grupo: ${calculation.grupo}
Valor da carta: ${formatMoney(calculation.valorCarta)}
Valor da primeira parcela: ${formatMoney(calculation.parcelaAtual)}
Lance necessário 53%: ${formatMoney(calculation.lanceTotal)}
Parcelas após contemplado: ${formatMoney(calculation.parcelasAposContemplado)}`}

Por favor, me ajudem com os próximos passos!`;
                        const whatsappUrl = getWhatsAppUrlWithMessage(whatsappMessage);
                        window.open(whatsappUrl, '_blank');
                        
                        // Registrar envio do WhatsApp se não for site estático e houver simulationId
                        if (!isStaticSite && simulationId) {
                          try {
                            await fetch(`/api/consortium-simulations/${simulationId}/whatsapp`, {
                              method: 'PATCH',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                            });
                          } catch (error) {
                            console.error('Erro ao registrar envio do WhatsApp:', error);
                          }
                        }
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2"
                      data-testid="button-hire-consortium"
                    >
                      📱 DESEJO CONTRATAR
                    </Button>
                    <p className="text-center text-sm text-gray-500 mt-2">
                      Você será direcionado para o WhatsApp com todas as informações da sua simulação
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Área de informações do grupo selecionado */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              {selectedGroup ? (
                <div>
                  <h3 className="text-2xl font-bold text-firme-blue mb-4">
                    {selectedGroup.name}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Taxa Administrativa</div>
                        <div className="text-xl font-bold text-firme-blue">{selectedGroup.adminTax}%</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Fundo de Reserva</div>
                        <div className="text-xl font-bold text-firme-blue">{selectedGroup.fundReserve}%</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Lance Mínimo</div>
                        <div className="text-xl font-bold text-firme-blue">{selectedGroup.minBid}%</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Lance Máximo</div>
                        <div className="text-xl font-bold text-firme-blue">{selectedGroup.maxBid}%</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="text-sm font-medium text-gray-700 mb-2">Características:</div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>• Prazo: até {selectedGroup.maxDuration} meses</div>
                        <div>• Participantes: {selectedGroup.participants.toLocaleString()}</div>
                        <div>• Reajuste: {selectedGroup.reajustType} anual</div>
                        <div>• Seguro: {selectedGroup.insuranceRate}% ao mês</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded">
                      <div className="text-sm font-medium text-gray-700 mb-2">Sobre este grupo:</div>
                      <div className="text-sm text-gray-600">
                        <p className="mb-2">{selectedGroup.priceTableRules}</p>
                        <p><strong>Contemplações:</strong> {selectedGroup.contemplations}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}