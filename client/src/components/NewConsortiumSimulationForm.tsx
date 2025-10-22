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
import { apiRequest } from '@/lib/queryClient';
import { isStaticSite, openWhatsAppWithMessage } from '@/lib/runtimeEnv';
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
  const creditValueDesejado = parseFloat(data.creditValue);
  const maxInstallment = parseFloat(data.maxInstallmentValue);
  const installmentCount = parseInt(data.installmentCount);
  
  // Usar o número do grupo real extraído do ID (ex: ELE001 -> 1247)
  const grupoNumero = parseInt(group.name.match(/\d+/)?.[0] || "1000");
  
  // CÁLCULO CORRETO BASEADO NA METODOLOGIA ANDREOLI:
  
  let valorCartaReal = creditValueDesejado;
  let valorCartaExibir = creditValueDesejado;
  let parcelaReal = maxInstallment;
  let parcelasReal = installmentCount;
  
  // Se usar embutido, precisa buscar uma carta MAIOR que permita usar o valor desejado
  if (data.useEmbedded) {
    // Cartas disponíveis no banco (simulando algumas opções)
    const cartasDisponiveis = [
      { valor: 30000, parcelas: 60, valorParcela: 600 },
      { valor: 42000, parcelas: 60, valorParcela: 800 },
      { valor: 50000, parcelas: 60, valorParcela: 950 },
      { valor: 52323, parcelas: 51, valorParcela: 1233.67 },
      { valor: 60000, parcelas: 60, valorParcela: 1150 },
      { valor: 80000, parcelas: 60, valorParcela: 1500 },
      { valor: 100000, parcelas: 60, valorParcela: 1900 }
    ];
    
    // Encontrar a carta que permita usar o valor desejado após descontar o embutido
    for (const carta of cartasDisponiveis) {
      const totalPagar = carta.valorParcela * carta.parcelas;
      const valorEmbutido = totalPagar * 0.15;
      const creditoDisponivel = carta.valor - valorEmbutido;
      
      if (creditoDisponivel >= creditValueDesejado) {
        valorCartaReal = carta.valor;
        parcelaReal = carta.valorParcela;
        parcelasReal = carta.parcelas;
        break;
      }
    }
  }
  
  // 1. Cálculo do total que será pago (baseado na carta real selecionada)
  const totalQueSerapago = parcelaReal * parcelasReal;
  
  // 2. CÁLCULO DO LANCE (metodologia Andreoli):
  // Lance necessário = 53% do total que será pago
  const lanceNecessario = totalQueSerapago * 0.53;
  
  // 3. Lance embutido (se selecionado) = 15% do total que será pago
  const lanceEmbutido = data.useEmbedded ? (totalQueSerapago * 0.15) : 0;
  
  // 4. Lance que o cliente realmente precisa pagar
  const lanceDeduzido = lanceNecessario - lanceEmbutido;
  
  // 5. CÁLCULO DAS PARCELAS APÓS CONTEMPLADO:
  // Total que será pago x 53% = valor total do lance
  const valorTotalLance = totalQueSerapago * 0.53;
  
  // Valor restante = valor total do lance / parcelas restantes (total - 1)
  const parcelasRestantes = installmentCount - 1;
  const valorRestantePorParcela = parcelasRestantes > 0 ? valorTotalLance / parcelasRestantes : 0;
  
  // Parcelas após contemplado = parcela original - valor restante por parcela
  const parcelasAposContemplado = Math.max(0, maxInstallment - valorRestantePorParcela);
  
  // 6. Taxas e encargos (baseados no valor da carta real)
  const taxaAdmPercentual = group.adminTax / 100;
  const taxaAdm = valorCartaReal * taxaAdmPercentual;
  
  const fundoReservaPercentual = group.fundReserve / 100;
  const fundoReserva = valorCartaReal * fundoReservaPercentual;
  
  // 7. Seguros (baseados no valor da carta real)
  const seguroVida = valorCartaReal * (group.insuranceRate / 100) * installmentCount;
  const seguroQuebra = valorCartaReal * 0.0007 * installmentCount; // 0,07% padrão
  
  return {
    grupo: grupoNumero,
    valorCarta: creditValueDesejado, // Valor que o cliente deseja usar
    valorCartaReal: valorCartaReal, // Valor da carta que será usada (maior se embutido)
    parcelaAtual: parcelaReal, // Parcela da carta real
    totalParcelas: parcelasReal, // Total de parcelas da carta real
    totalPagar: totalQueSerapago, // Total que será pago
    lanceTotal: lanceNecessario,
    lanceEmbutido,
    lanceDeduzido,
    parcelasRestantes,
    novaParcelaValor: parcelasAposContemplado, // Renomeando para ficar mais claro
    parcelasAposContemplado: parcelasAposContemplado, // Novo campo solicitado
    encargos: {
      fundoReserva,
      taxaAdm,
      seguroVida,
      seguroQuebra
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
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

  const mutation = useMutation({
    mutationFn: async (data: ConsortiumFormData) => {
      const formattedData = {
        ...data,
        creditValue: parseFloat(data.creditValue),
        maxInstallmentValue: parseFloat(data.maxInstallmentValue),
        installmentCount: parseInt(data.installmentCount),
        useEmbedded: data.useEmbedded || false
      };
      const response = await apiRequest("POST", "/api/consortium-simulations", formattedData);
      return response.json();
    },
    onSuccess: (result) => {
      // Armazenar o ID da simulação
      if (result.id) {
        setSimulationId(result.id);
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/consortium-simulations"] });
      toast({
        title: "Sucesso!",
        description: "Sua simulação foi enviada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao enviar sua simulação.",
        variant: "destructive",
      });
    },
  });

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

  const onSubmit = (data: ConsortiumFormData) => {
    if (!selectedGroup) return;
    
    const result = calculateConsortiumWithGroup(data, selectedGroup);
    setCalculation(result);
    setStep('result');
    
    if (isStaticSite) {
      const creditValue = parseFloat(data.creditValue);
      const installments = parseInt(data.installmentCount);
      const calculation = calculateConsortium(
        data.category,
        data.groupId,
        creditValue,
        installments
      );
      const message = formatConsortiumForWhatsApp(
        data.name,
        data.phone,
        data.email,
        calculation
      );
      openWhatsAppWithMessage(message);
      toast({
        title: "Simulação calculada!",
        description: "Continue a conversa pelo WhatsApp para mais detalhes."
      });
    } else {
      mutation.mutate(data);
    }
  };

  const handleCalculateOnly = () => {
    if (!selectedGroup) return;
    
    const formData = watch();
    if (formData.creditValue && formData.maxInstallmentValue && formData.installmentCount) {
      const result = calculateConsortiumWithGroup({
        ...formData,
        name: formData.name || '',
        phone: formData.phone || '',
        email: formData.email || '',
        category: selectedCategory!,
        groupId: selectedGroup.id,
        useEmbedded: useEmbedded
      }, selectedGroup);
      setCalculation(result);
      setStep('result');
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
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
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

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        disabled={isSubmitting || mutation.isPending}
                        className="bg-firme-blue text-white hover:bg-firme-blue-light"
                        data-testid="button-submit"
                      >
                        <Calculator className="w-5 h-5 mr-2" />
                        {mutation.isPending ? "Enviando..." : "SIMULAR E ENVIAR"}
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
                  
                  {/* Proposta no formato refinado */}
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
                    <div className="text-center font-bold text-firme-blue mb-4">PROPOSTA ANDREOLI CONSÓRCIOS</div>
                    <div className="space-y-3 text-firme-gray">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Grupo</span>
                        <span className="font-bold">{calculation.grupo}</span>
                      </div>
                      {calculation.lanceEmbutido > 0 && calculation.valorCartaReal !== calculation.valorCarta && (
                        <>
                          <div className="flex justify-between bg-blue-50 p-2 rounded">
                            <span className="text-gray-600">Carta selecionada (para embutido)</span>
                            <span className="font-bold">{formatMoney(calculation.valorCartaReal)}</span>
                          </div>
                          <div className="flex justify-between bg-blue-50 p-2 rounded">
                            <span className="text-gray-600">Parcela da carta selecionada</span>
                            <span className="font-bold">{formatMoney(calculation.parcelaAtual)}</span>
                          </div>
                          <div className="flex justify-between bg-green-50 p-2 rounded">
                            <span className="text-gray-600">Crédito disponível para uso</span>
                            <span className="font-bold text-green-600">{formatMoney(calculation.valorCarta)}</span>
                          </div>
                        </>
                      )}
                      {!(calculation.lanceEmbutido > 0 && calculation.valorCartaReal !== calculation.valorCarta) && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Valor da carta</span>
                            <span className="font-bold">{formatMoney(calculation.valorCarta)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Valor da parcela</span>
                            <span className="font-bold">{formatMoney(calculation.parcelaAtual)}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600">Lance necessário (53%)</span>
                        <span className="font-bold text-firme-blue">{formatMoney(calculation.lanceTotal)}</span>
                      </div>
                      {calculation.lanceEmbutido > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lance embutido (15%)</span>
                          <span className="font-bold text-green-600">-{formatMoney(calculation.lanceEmbutido)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600 font-medium">Lance a pagar</span>
                        <span className="font-bold text-lg text-firme-blue">{formatMoney(calculation.lanceDeduzido)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600">Parcelas após contemplado</span>
                        <span className="font-bold text-green-600">{formatMoney(calculation.parcelasAposContemplado)}</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded mt-4">
                        <div className="text-sm text-gray-600 mb-2">Encargos informativos:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>Fundo Reserva (0,5%): {formatMoney(calculation.encargos.fundoReserva)}</div>
                          <div>Taxa Adm (16%): {formatMoney(calculation.encargos.taxaAdm)}</div>
                          <div>Seguro Vida (0,12%/mês): {formatMoney(calculation.encargos.seguroVida)}</div>
                          <div>Seguro Quebra (0,07%/mês): {formatMoney(calculation.encargos.seguroQuebra)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botão para contratar */}
                  <div className="mt-6 pt-4 border-t">
                    <Button
                      onClick={async () => {
                        const whatsappMessage = `Olá! Gostaria de contratar o consórcio com as seguintes informações:

===== PROPOSTA ANDREOLI CONSÓRCIOS =====
Grupo: ${calculation.grupo}${calculation.lanceEmbutido > 0 && calculation.valorCartaReal !== calculation.valorCarta ? `
Carta selecionada (para embutido): ${formatMoney(calculation.valorCartaReal)}
Parcela da carta selecionada: ${formatMoney(calculation.parcelaAtual)}
Crédito disponível para uso: ${formatMoney(calculation.valorCarta)}` : `
Valor da carta: ${formatMoney(calculation.valorCarta)}
Valor da parcela: ${formatMoney(calculation.parcelaAtual)}`}
Lance necessário (53%): ${formatMoney(calculation.lanceTotal)}${calculation.lanceEmbutido > 0 ? `
Lance embutido (15%): ${formatMoney(calculation.lanceEmbutido)}` : ''}
Lance a pagar: ${formatMoney(calculation.lanceDeduzido)}
Parcelas após contemplado: ${formatMoney(calculation.parcelasAposContemplado)}

Encargos informativos:
- Fundo Reserva (0,5%): ${formatMoney(calculation.encargos.fundoReserva)}
- Taxa Adm (16%): ${formatMoney(calculation.encargos.taxaAdm)}
- Seguro Vida (0,12%/mês): ${formatMoney(calculation.encargos.seguroVida)}
- Seguro Quebra (0,07%/mês): ${formatMoney(calculation.encargos.seguroQuebra)}

Por favor, me ajudem com os próximos passos!`;
                        const whatsappUrl = `https://api.whatsapp.com/send?phone=5574981213461&text=${encodeURIComponent(whatsappMessage)}`;
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