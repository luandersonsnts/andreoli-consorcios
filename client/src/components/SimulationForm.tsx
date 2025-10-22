import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertSimulationSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isStaticSite, openWhatsAppWithMessage } from "@/lib/runtimeEnv";
import { formatInvestmentForWhatsApp, calculateInvestment, type InvestmentCalculation } from "@/lib/consortiumCalculator";
import { TrendingUp, PiggyBank, Calculator } from 'lucide-react';
import NewConsortiumSimulationForm from './NewConsortiumSimulationForm';
import { InvestmentProjection } from './InvestmentProjection';
import type { z } from "zod";

type SimulationFormData = z.infer<typeof insertSimulationSchema>;

export default function SimulationForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [simulationType, setSimulationType] = useState<'investment' | 'consortium'>('investment');
  const [showProjection, setShowProjection] = useState(false);
  const [projectionData, setProjectionData] = useState<{
    calculation: InvestmentCalculation;
    clientData: {
      name: string;
      phone: string;
      email: string;
      objective: string;
    };
    simulationId?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<SimulationFormData>({
    resolver: zodResolver(insertSimulationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      objective: "",
      monthlyAmount: "",
      timeframe: ""
    }
  });

  const objective = watch("objective");

  const mutation = useMutation({
    mutationFn: async (data: SimulationFormData) => {
      const response = await apiRequest("POST", "/api/simulations", data);
      return response.json();
    },
    onSuccess: (result) => {
      // Atualizar projectionData com o ID da simulação
      if (projectionData && result.id) {
        setProjectionData({
          ...projectionData,
          simulationId: result.id
        });
      }
      
      toast({
        title: "Simulação enviada!",
        description: "Recebemos sua solicitação e entraremos em contato em breve."
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ['/api/simulations'] });
    },
    onError: () => {
      // Error handling is now done in onSubmit function
      // This prevents showing error toasts when API is not available
    }
  });

  const onSubmit = async (data: SimulationFormData) => {
    // Calcular a projeção
    const monthlyAmount = parseFloat(data.monthlyAmount.replace(/[^\d,]/g, '').replace(',', '.'));
    const timeframeYears = parseInt(data.timeframe);
    
    const calculation = calculateInvestment(monthlyAmount, timeframeYears);
    
    const clientData = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      objective: data.objective
    };
    
    // Exibir a projeção
    setProjectionData({ calculation, clientData });
    setShowProjection(true);
    
    // Try to save to API first (works in both local and Vercel with backend)
    try {
      await mutation.mutateAsync(data);
      // If successful, API is available and data was saved
    } catch (error) {
      // API not available - continue with static mode (no action needed)
      console.log('API not available, continuing in static mode');
    }
  };

  const handleSendWhatsApp = async () => {
    if (!projectionData) return;
    
    const message = formatInvestmentForWhatsApp(
      projectionData.clientData.name,
      projectionData.clientData.phone,
      projectionData.clientData.email,
      projectionData.clientData.objective,
      projectionData.calculation.monthlyAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      projectionData.calculation.timeframe.toString()
    );
    
    openWhatsAppWithMessage(message);
    
    // Registrar o envio via WhatsApp se não for site estático e tiver ID da simulação
    if (!isStaticSite && projectionData.simulationId) {
      try {
        await apiRequest("PATCH", `/api/simulations/${projectionData.simulationId}/whatsapp`, {});
      } catch (error) {
        console.error('Erro ao registrar envio do WhatsApp:', error);
      }
    }
    
    toast({
      title: "Redirecionando para WhatsApp",
      description: "Você será redirecionado para continuar pelo WhatsApp!"
    });
  };

  return (
    <section id="simule" className="py-16 bg-gradient-to-b from-white via-blue-50/20 to-white relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-firme-blue/20 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-firme-gray mb-4">
            PROJETE SEU <span className="text-transparent bg-gradient-to-r from-firme-blue to-blue-600 bg-clip-text">FUTURO FINANCEIRO</span>
          </h2>
          <h3 className="text-2xl font-bold text-firme-blue mb-4">
            Escolha o tipo de simulação:
          </h3>
          
          {/* Seletor de tipo de simulação */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={() => setSimulationType('investment')}
              variant={simulationType === 'investment' ? 'default' : 'outline'}
              className={`relative group px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden ${
                simulationType === 'investment'
                  ? 'bg-gradient-to-r from-firme-blue to-blue-600 text-white shadow-lg'
                  : 'border-2 border-firme-blue text-firme-blue hover:bg-firme-blue hover:text-white'
              }`}
              data-testid="button-investment-simulation"
            >
              <span className="relative z-10 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                Investimentos Tradicionais
              </span>
              {simulationType !== 'investment' && (
                <div className="absolute inset-0 bg-gradient-to-r from-firme-blue to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </Button>
            <Button
              onClick={() => setSimulationType('consortium')}
              variant={simulationType === 'consortium' ? 'default' : 'outline'}
              className={`relative group px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden ${
                simulationType === 'consortium'
                  ? 'bg-gradient-to-r from-firme-blue to-blue-600 text-white shadow-lg'
                  : 'border-2 border-firme-blue text-firme-blue hover:bg-firme-blue hover:text-white'
              }`}
              data-testid="button-consortium-simulation"
            >
              <span className="relative z-10 flex items-center">
                <PiggyBank className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                Consórcio
              </span>
              {simulationType !== 'consortium' && (
                <div className="absolute inset-0 bg-gradient-to-r from-firme-blue to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </Button>
          </div>
        </div>

        {simulationType === 'consortium' ? (
          <NewConsortiumSimulationForm />
        ) : (
          <>
            <div className="text-center mb-8">
              <h4 className="text-xl font-bold text-firme-gray">
                Simule seu plano de investimentos:
              </h4>
            </div>
        
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-white to-blue-50/50 p-8 rounded-xl shadow-xl border border-blue-100 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="block text-firme-gray font-medium mb-2">Nome</Label>
                <Input
                  id="name"
                  {...register("name")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-firme-blue focus:border-transparent"
                  placeholder="Seu nome completo"
                  data-testid="input-simulation-name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone" className="block text-firme-gray font-medium mb-2">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-firme-blue focus:border-transparent"
                  placeholder="(11) 99999-9999"
                  data-testid="input-simulation-phone"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="block text-firme-gray font-medium mb-2">E-mail</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-firme-blue focus:border-transparent"
                placeholder="seu@email.com"
                data-testid="input-simulation-email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <Label className="block text-firme-gray font-medium mb-2">Objetivo de Investimento</Label>
              <Select value={objective} onValueChange={(value) => setValue("objective", value)}>
                <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cavalcante-orange focus:border-transparent" data-testid="select-simulation-objective">
                  <SelectValue placeholder="Selecione seu objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aposentadoria">Aposentadoria</SelectItem>
                  <SelectItem value="compra-imovel">Compra de imóvel</SelectItem>
                  <SelectItem value="reserva-emergencia">Reserva de emergência</SelectItem>
                  <SelectItem value="multiplicar-patrimonio">Multiplicar patrimônio</SelectItem>
                  <SelectItem value="educacao-filhos">Educação dos filhos</SelectItem>
                </SelectContent>
              </Select>
              {errors.objective && <p className="text-red-500 text-sm mt-1">{errors.objective.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="monthlyAmount" className="block text-firme-gray font-medium mb-2">Valor para investir mensalmente</Label>
              <Input
                id="monthlyAmount"
                {...register("monthlyAmount")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-firme-blue focus:border-transparent"
                placeholder="R$ 0,00"
                data-testid="input-simulation-amount"
              />
              {errors.monthlyAmount && <p className="text-red-500 text-sm mt-1">{errors.monthlyAmount.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="timeframe" className="block text-firme-gray font-medium mb-2">Prazo do investimento (anos)</Label>
              <Input
                id="timeframe"
                type="number"
                {...register("timeframe")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-firme-blue focus:border-transparent"
                placeholder="5"
                data-testid="input-simulation-timeframe"
              />
              {errors.timeframe && <p className="text-red-500 text-sm mt-1">{errors.timeframe.message}</p>}
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting || (!isStaticSite && mutation.isPending)}
              className="relative group w-full bg-gradient-to-r from-firme-blue to-blue-600 text-white py-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
              data-testid="button-submit-simulation"
            >
              <span className="relative z-10 flex items-center justify-center">
                <Calculator className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                {(!isStaticSite && mutation.isPending) ? "Enviando..." : "CRIAR MINHA PROJEÇÃO"}
                {!isSubmitting && !(!isStaticSite && mutation.isPending) && (
                  <TrendingUp className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-firme-blue to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </Button>
          </form>
        </div>
        
        {showProjection && projectionData && (
          <InvestmentProjection
            calculation={projectionData.calculation}
            clientData={projectionData.clientData}
            onSendWhatsApp={handleSendWhatsApp}
          />
        )}
          </>
        )}
      </div>
    </section>
  );
}
