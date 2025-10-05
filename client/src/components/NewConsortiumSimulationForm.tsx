import { useState } from 'react';
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
import { ConsortiumCategory, ConsortiumGroup, getGroupById } from '../../../shared/consortiumTypes';
import ConsortiumCategorySelector from './ConsortiumCategorySelector';
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
  parcelaAtual: number;
  lanceTotal: number;
  lanceEmbutido: number;
  lanceDeduzido: number;
  parcelasRestantes: number;
  novaParcelaValor: number;
  encargos: {
    fundoReserva: number;
    taxaAdm: number;
    seguroVida: number;
    seguroQuebra: number;
  };
}

function calculateConsortiumWithGroup(data: ConsortiumFormData, group: ConsortiumGroup): ConsortiumCalculationResult {
  const creditValue = parseFloat(data.creditValue);
  const maxInstallment = parseFloat(data.maxInstallmentValue);
  const installmentCount = parseInt(data.installmentCount);
  
  // Grupo aleatório baseado na categoria
  const grupo = Math.floor(Math.random() * 800) + 200;
  
  // Base para cálculo do lance
  const baseLance = maxInstallment * installmentCount;
  
  // Percentual do lance baseado no grupo (45% a 59%)
  const pctLance = Math.random() * (59 - 45) + 45;
  const lanceTotal = (baseLance * pctLance / 100);
  
  // Embutido máximo baseado no grupo
  const maxEmbedded = group.maxBid / 100;
  const lanceEmbutido = data.useEmbedded ? (baseLance * Math.min(0.15, maxEmbedded)) : 0;
  
  // Lance deduzido
  const lanceDeduzido = lanceTotal - lanceEmbutido;
  
  // Parcelas restantes
  const parcelasRestantes = installmentCount - 1;
  
  // Nova parcela após contemplação
  const novaParcelaValor = Math.max(0, maxInstallment - (lanceTotal / parcelasRestantes));
  
  // Encargos baseados no grupo
  const fundoReserva = creditValue * (group.fundReserve / 100);
  const taxaAdm = creditValue * (group.adminTax / 100);
  const seguroVida = group.category === 'imovel' ? creditValue * 0.0012 : creditValue * (group.insuranceRate / 100);
  const seguroQuebra = group.category === 'imovel' ? creditValue * 0.0007 : creditValue * (group.insuranceRate / 100) * 0.5;
  
  return {
    grupo,
    valorCarta: creditValue,
    parcelaAtual: maxInstallment,
    lanceTotal,
    lanceEmbutido,
    lanceDeduzido,
    parcelasRestantes,
    novaParcelaValor,
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

export default function NewConsortiumSimulationForm() {
  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<ConsortiumCategory | undefined>();
  const [selectedGroup, setSelectedGroup] = useState<ConsortiumGroup | undefined>();
  const [calculation, setCalculation] = useState<ConsortiumCalculationResult | null>(null);
  const [useEmbedded, setUseEmbedded] = useState(false);

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
      const response = await apiRequest("POST", "/api/consortium-simulations", data);
      return response.json();
    },
    onSuccess: () => {
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
    if (step === 'group') {
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
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
              {step !== 'category' && (
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
              {step === 'category' && (
                <ConsortiumCategorySelector 
                  onCategorySelect={onCategorySelect}
                  selectedCategory={selectedCategory}
                />
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
                        Quero usar lance embutido (até {selectedGroup.maxBid}% do crédito)
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
                  
                  {/* Proposta no formato terminal */}
                  <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm mb-6">
                    <div className="text-center text-white font-bold mb-4">===== PROPOSTA =====</div>
                    <div className="space-y-1">
                      <div>grupo: {calculation.grupo}</div>
                      <div>valor da carta: {formatMoney(calculation.valorCarta)}</div>
                      <div>valor desejado pelo cliente: {formatMoney(calculation.valorCarta)}</div>
                      <div>1ª parcela: {formatMoney(calculation.parcelaAtual)}</div>
                      <div>lance deduzido: {formatMoney(calculation.lanceDeduzido)} (total: {formatMoney(calculation.lanceTotal)}{calculation.lanceEmbutido > 0 ? ` | embutido: ${formatMoney(calculation.lanceEmbutido)}` : ''})</div>
                      <div>quantidade restantes de parcela: {calculation.parcelasRestantes}</div>
                      <div>reajuste das parcelas após contemplação: {formatMoney(calculation.novaParcelaValor)}</div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="text-white font-bold mb-2">--- Encargos informativos ---</div>
                      <div className="space-y-1">
                        <div>Fundo de Reserva ({selectedGroup.fundReserve}%): {formatMoney(calculation.encargos.fundoReserva)}</div>
                        <div>Taxa Adm ({selectedGroup.adminTax}%): {formatMoney(calculation.encargos.taxaAdm)}</div>
                        <div>Seguro de Vida ({selectedGroup.insuranceRate}% ao mês): {formatMoney(calculation.encargos.seguroVida)}</div>
                        <div>Seguro de Quebra: {formatMoney(calculation.encargos.seguroQuebra)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Botão para contratar */}
                  <div className="mt-6 pt-4 border-t">
                    <Button
                      onClick={() => {
                        const whatsappMessage = `Olá! Gostaria de contratar o consórcio com as seguintes informações:

===== PROPOSTA =====
grupo: ${calculation.grupo}
valor da carta: ${formatMoney(calculation.valorCarta)}
valor desejado pelo cliente: ${formatMoney(calculation.valorCarta)}
1ª parcela: ${formatMoney(calculation.parcelaAtual)}
lance deduzido: ${formatMoney(calculation.lanceDeduzido)} (total: ${formatMoney(calculation.lanceTotal)}${calculation.lanceEmbutido > 0 ? ` | embutido: ${formatMoney(calculation.lanceEmbutido)}` : ''})
quantidade restantes de parcela: ${calculation.parcelasRestantes}
reajuste das parcelas após contemplação: ${formatMoney(calculation.novaParcelaValor)}

--- Encargos informativos ---
Fundo de Reserva (${selectedGroup.fundReserve}%): ${formatMoney(calculation.encargos.fundoReserva)}
Taxa Adm (${selectedGroup.adminTax}%): ${formatMoney(calculation.encargos.taxaAdm)}
Seguro de Vida (${selectedGroup.insuranceRate}% ao mês): ${formatMoney(calculation.encargos.seguroVida)}
Seguro de Quebra: ${formatMoney(calculation.encargos.seguroQuebra)}

Por favor, me ajudem com os próximos passos!`;
                        const whatsappUrl = `https://api.whatsapp.com/send?phone=5587981620542&text=${encodeURIComponent(whatsappMessage)}`;
                        window.open(whatsappUrl, '_blank');
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
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <PiggyBank className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Simulação de Consórcio</p>
                  <p className="text-sm">
                    Escolha uma categoria e grupo para começar sua simulação
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}