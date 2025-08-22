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
  const installmentCount = parseInt(data.installmentCount);
  
  // Grupo aleatório entre 200-999
  const grupo = Math.floor(Math.random() * 800) + 200;
  
  // Base para cálculo do lance = soma das parcelas
  const baseLance = maxInstallment * installmentCount;
  
  // Percentual do lance aleatório entre 45% a 59%
  const pctLance = Math.random() * (59 - 45) + 45;
  
  // Lance total (percentual das assembleias simulado)
  const lanceTotal = (baseLance * pctLance / 100);
  
  // Embutido máximo (15% do total da base) se selecionado
  const lanceEmbutido = data.useEmbedded ? (baseLance * 0.15) : 0;
  
  // Lance que o cliente realmente precisa pagar
  const lanceDeduzido = lanceTotal - lanceEmbutido;
  
  // Parcelas restantes
  const parcelasRestantes = installmentCount - 1;
  
  // Nova parcela após contemplação
  const novaParcelaValor = Math.max(0, maxInstallment - (lanceTotal / parcelasRestantes));
  
  // Encargos fixos (informativos)
  const fundoReserva = creditValue * 0.005;
  const taxaAdm = creditValue * 0.16; // 16% padrão
  const seguroVida = creditValue * 0.0012 * installmentCount;
  const seguroQuebra = creditValue * 0.0007 * installmentCount;
  
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

                <Button
                  type="submit"
                  disabled={isSubmitting || mutation.isPending}
                  className="w-full bg-firme-blue text-white py-3 rounded-lg font-medium hover:bg-firme-blue-light transition-colors"
                  data-testid="button-submit-consortium-simulation"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  {mutation.isPending ? "Calculando..." : "CALCULAR CONSÓRCIO"}
                </Button>
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