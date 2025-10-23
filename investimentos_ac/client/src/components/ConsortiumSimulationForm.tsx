import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Calculator, TrendingUp, PiggyBank } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Schema para validação do formulário
const consortiumFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  email: z.string().email("Email inválido"),
  creditValue: z.string().min(1, "Valor do crédito é obrigatório"),
  useEmbedded: z.boolean().optional(),
  maxInstallmentValue: z.string().min(1, "Valor da parcela é obrigatório"),
  installmentCount: z.string().min(1, "Número de parcelas é obrigatório"),
});

type ConsortiumFormData = z.infer<typeof consortiumFormSchema>;

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

function calculateConsortium(data: ConsortiumFormData): ConsortiumCalculationResult {
  const creditValue = parseFloat(data.creditValue);
  const maxInstallment = parseFloat(data.maxInstallmentValue);
  const installmentCount = Math.min(parseInt(data.installmentCount), 98); // Máximo 98 parcelas
  
  // Grupo aleatório entre 1000-9999 (mais realista)
  const grupo = Math.floor(Math.random() * 9000) + 1000;
  
  // CÁLCULO CORRETO BASEADO NA METODOLOGIA ANDREOLI:
  
  // 1. Total pago pelo crédito = Valor máximo da parcela × número de parcelas
  const totalPagoPeloCredito = maxInstallment * installmentCount;
  
  // 2. Valor do lance = Total pago × 0,53 (53%)
  const lanceTotal = totalPagoPeloCredito * 0.53;
  
  // 3. Lance embutido (se selecionado) = Total pago × 0,15 (15%)
  const lanceEmbutido = data.useEmbedded ? (totalPagoPeloCredito * 0.15) : 0;
  
  // 4. Lance que o cliente realmente precisa pagar = Lance total - embutido
  const lanceDeduzido = lanceTotal - lanceEmbutido;
  
  // 5. Parcelas restantes após contemplação
  const parcelasRestantes = installmentCount - 1;
  
  // 6. Cálculo da parcela após contemplado:
  // Total do lance ÷ (número de parcelas - 1) = valor restante por parcela
  // Valor máximo da parcela - valor restante por parcela = parcela após contemplado
  const valorRestantePorParcela = parcelasRestantes > 0 ? lanceTotal / parcelasRestantes : 0;
  const novaParcelaValor = Math.max(0, maxInstallment - valorRestantePorParcela);
  
  // 7. Taxas e encargos (baseados no valor do crédito)
  const taxaAdmPercentual = 0.16; // 16% padrão
  const fundoReservaPercentual = 0.005; // 0.5% padrão
  
  const taxaAdm = creditValue * taxaAdmPercentual;
  const fundoReserva = creditValue * fundoReservaPercentual;
  
  // 8. Seguros (baseados no valor do crédito)
  const seguroVida = creditValue * 0.0012 * installmentCount; // 0,12% ao mês
  const seguroQuebra = creditValue * 0.0007 * installmentCount; // 0,07% ao mês
  
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

function formatMoney(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export default function ConsortiumSimulationForm() {
  const [calculation, setCalculation] = useState<ConsortiumCalculationResult | null>(null);
  const [useEmbedded, setUseEmbedded] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<ConsortiumFormData>({
    resolver: zodResolver(consortiumFormSchema),
    defaultValues: {
      useEmbedded: false
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: ConsortiumFormData) => {
      const formattedData = {
        ...data,
        creditValue: data.creditValue.toString(),
        maxInstallmentValue: data.maxInstallmentValue.toString(),
        installmentCount: parseInt(data.installmentCount),
        useEmbedded: data.useEmbedded || false
      };
      const response = await apiRequest("POST", "/api/consortium-simulations", formattedData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/consortium-simulations"] });
      toast({
        title: "Sucesso!",
        description: "Sua simulação foi enviada! Entraremos em contato em breve.",
      });
      reset();
      setCalculation(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao enviar simulação. Tente novamente.",
      });
    },
  });

  const onSubmit = (data: ConsortiumFormData) => {
    // Calcular resultado antes de enviar
    const result = calculateConsortium(data);
    setCalculation(result);
    
    // Enviar dados para o backend
    mutation.mutate(data);
  };

  const handleCalculateOnly = () => {
    const formData = watch();
    if (formData.creditValue && formData.maxInstallmentValue && formData.installmentCount) {
      const result = calculateConsortium({
        ...formData,
        name: formData.name || '',
        phone: formData.phone || '',
        email: formData.email || '',
        useEmbedded: useEmbedded
      });
      setCalculation(result);
    }
  };

  const creditValue = watch("creditValue");
  const maxInstallmentValue = watch("maxInstallmentValue");

  // Calcular limites da parcela (1% a 2,2% do valor da carta)
  const creditValueNum = parseFloat(creditValue) || 0;
  const minInstallment = creditValueNum * 0.01;
  const maxInstallmentLimit = creditValueNum * 0.022;

  return (
    <section className="py-16 bg-firme-light-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-firme-gray mb-4">
            SIMULAÇÃO DE CONSÓRCIO
          </h2>
          <h3 className="text-2xl font-bold text-firme-blue">
            Realize seu sonho com estratégia inteligente:
          </h3>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulário */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Dados pessoais */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-firme-gray font-medium">Nome completo</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className="mt-1"
                      placeholder="Seu nome completo"
                      data-testid="input-consortium-name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-firme-gray font-medium">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className="mt-1"
                      placeholder="(11) 99999-9999"
                      data-testid="input-consortium-phone"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-firme-gray font-medium">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="mt-1"
                    placeholder="seu@email.com"
                    data-testid="input-consortium-email"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Dados do consórcio */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-bold text-firme-gray mb-4">Dados da Simulação</h4>
                  
                  <div>
                    <Label htmlFor="creditValue" className="text-firme-gray font-medium">
                      Valor do crédito desejado
                    </Label>
                    <Input
                      id="creditValue"
                      type="number"
                      step="0.01"
                      {...register("creditValue")}
                      className="mt-1"
                      placeholder="Ex: 50000"
                      data-testid="input-consortium-credit-value"
                    />
                    {errors.creditValue && <p className="text-red-500 text-sm mt-1">{errors.creditValue.message}</p>}
                  </div>

                  <div className="flex items-start space-x-2 mt-4">
                    <Checkbox
                      id="useEmbedded"
                      checked={useEmbedded}
                      onCheckedChange={(checked) => {
                        setUseEmbedded(!!checked);
                        register("useEmbedded").onChange({ target: { value: !!checked } });
                      }}
                      data-testid="checkbox-use-embedded"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="useEmbedded" className="text-firme-gray font-medium">
                        Deseja utilizar lance embutido? (até 15%)
                      </Label>
                      <p className="text-xs text-gray-500">
                        O lance embutido reduz o valor que você precisa pagar para ser contemplado
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="maxInstallmentValue" className="text-firme-gray font-medium">
                      Valor máximo da parcela que consegue pagar
                    </Label>
                    {creditValueNum > 0 && (
                      <p className="text-xs text-gray-500 mb-1">
                        Recomendado: entre {formatMoney(minInstallment)} e {formatMoney(maxInstallmentLimit)}
                      </p>
                    )}
                    <Input
                      id="maxInstallmentValue"
                      type="number"
                      step="0.01"
                      {...register("maxInstallmentValue")}
                      className="mt-1"
                      placeholder="Ex: 800"
                      data-testid="input-consortium-max-installment"
                    />
                    {errors.maxInstallmentValue && <p className="text-red-500 text-sm mt-1">{errors.maxInstallmentValue.message}</p>}
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="installmentCount" className="text-firme-gray font-medium">
                      Número de parcelas (até 100x)
                    </Label>
                    <Input
                      id="installmentCount"
                      type="number"
                      min="12"
                      max="100"
                      {...register("installmentCount")}
                      className="mt-1"
                      placeholder="Ex: 60"
                      data-testid="input-consortium-installment-count"
                    />
                    {errors.installmentCount && <p className="text-red-500 text-sm mt-1">{errors.installmentCount.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    onClick={handleCalculateOnly}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
                    data-testid="button-calculate-only"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    SIMULAR APENAS
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || mutation.isPending}
                    className="bg-firme-blue text-white py-3 rounded-lg font-medium hover:bg-firme-blue-light transition-colors"
                    data-testid="button-submit-consortium-simulation"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    {mutation.isPending ? "Enviando..." : "SIMULAR E ENVIAR"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Resultado da simulação */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              {calculation ? (
                <div>
                  <h3 className="text-2xl font-bold text-firme-blue mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2" />
                    PROPOSTA GERADA
                  </h3>
                  
                  {/* Proposta no formato exato solicitado */}
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
                        <div>Fundo de Reserva (0,5%): {formatMoney(calculation.encargos.fundoReserva)}</div>
                        <div>Taxa Adm (16%): {formatMoney(calculation.encargos.taxaAdm)}</div>
                        <div>Seguro de Vida (0,12% ao mês): {formatMoney(calculation.encargos.seguroVida)}</div>
                        <div>Seguro de Quebra (0,07% ao mês): {formatMoney(calculation.encargos.seguroQuebra)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-firme-light-gray p-4 rounded-lg">
                      <h4 className="font-bold text-firme-gray mb-3">Informações do Grupo</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Grupo:</span>
                          <p className="font-bold">{calculation.grupo}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Valor da carta:</span>
                          <p className="font-bold">{formatMoney(calculation.valorCarta)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">1ª Parcela:</span>
                          <p className="font-bold">{formatMoney(calculation.parcelaAtual)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Parcelas restantes:</span>
                          <p className="font-bold">{calculation.parcelasRestantes}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-bold text-green-800 mb-3">Lance Necessário</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Lance total:</span>
                          <span className="font-bold">{formatMoney(calculation.lanceTotal)}</span>
                        </div>
                        {calculation.lanceEmbutido > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Lance embutido (15%):</span>
                            <span className="font-bold">-{formatMoney(calculation.lanceEmbutido)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg border-t pt-2">
                          <span className="font-bold">Você paga:</span>
                          <span className="font-bold text-green-600">{formatMoney(calculation.lanceDeduzido)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-bold text-blue-800 mb-2">Reajuste das Parcelas</h4>
                      <p className="text-sm text-gray-600 mb-2">Após contemplação:</p>
                      <p className="text-xl font-bold text-blue-600">{formatMoney(calculation.novaParcelaValor)}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-3">Encargos Informativos</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>Fundo Reserva (0,5%):</span>
                          <span>{formatMoney(calculation.encargos.fundoReserva)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taxa Adm (16%):</span>
                          <span>{formatMoney(calculation.encargos.taxaAdm)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Seguro Vida (0,12%/mês):</span>
                          <span>{formatMoney(calculation.encargos.seguroVida)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Seguro Quebra (0,07%/mês):</span>
                          <span>{formatMoney(calculation.encargos.seguroQuebra)}</span>
                        </div>
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
Fundo de Reserva (0,5%): ${formatMoney(calculation.encargos.fundoReserva)}
Taxa Adm (16%): ${formatMoney(calculation.encargos.taxaAdm)}
Seguro de Vida (0,12% ao mês): ${formatMoney(calculation.encargos.seguroVida)}
Seguro de Quebra (0,07% ao mês): ${formatMoney(calculation.encargos.seguroQuebra)}

Por favor, me ajudem com os próximos passos!`;
                        const whatsappUrl = `https://api.whatsapp.com/send?phone=557498121-3461&text=${encodeURIComponent(whatsappMessage)}`;
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
              ) : (
                <div className="text-center py-12">
                  <PiggyBank className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-500 mb-2">Simulação de Consórcio</h3>
                  <p className="text-gray-400">
                    Preencha o formulário para ver sua proposta personalizada
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