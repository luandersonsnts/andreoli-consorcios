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
import { formatInvestmentForWhatsApp } from "@/lib/consortiumCalculator";
import { TrendingUp, PiggyBank, Calculator } from 'lucide-react';
import NewConsortiumSimulationForm from './NewConsortiumSimulationForm';
import type { z } from "zod";

type SimulationFormData = z.infer<typeof insertSimulationSchema>;

export default function SimulationForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [objective, setObjective] = useState("");
  const [simulationType, setSimulationType] = useState<'investment' | 'consortium'>('investment');

  const {
    register,
    handleSubmit,
    reset,
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

  const mutation = useMutation({
    mutationFn: async (data: SimulationFormData) => {
      const response = await apiRequest("POST", "/api/simulations", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Simulação enviada!",
        description: "Recebemos sua solicitação e entraremos em contato em breve."
      });
      reset();
      setObjective("");
      queryClient.invalidateQueries({ queryKey: ['/api/simulations'] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Verifique os dados e tente novamente."
      });
    }
  });

  const onSubmit = (data: SimulationFormData) => {
    if (isStaticSite) {
      const message = formatInvestmentForWhatsApp(
        data.name,
        data.phone,
        data.email,
        objective,
        data.monthlyAmount,
        data.timeframe
      );
      openWhatsAppWithMessage(message);
      toast({
        title: "Redirecionando para WhatsApp",
        description: "Você será redirecionado para continuar pelo WhatsApp!"
      });
      reset();
      setObjective("");
    } else {
      mutation.mutate({ ...data, objective });
    }
  };

  if (simulationType === 'consortium') {
    return <NewConsortiumSimulationForm />;
  }

  return (
    <section id="simule" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-firme-gray mb-4">
            PROJETE SEU FUTURO FINANCEIRO
          </h2>
          <h3 className="text-2xl font-bold text-firme-blue mb-4">
            Escolha o tipo de simulação:
          </h3>
          
          {/* Seletor de tipo de simulação */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={() => setSimulationType('investment')}
              variant={simulationType === 'investment' ? 'default' : 'outline'}
              className={`px-6 py-3 ${
                simulationType === 'investment'
                  ? 'bg-firme-blue text-white'
                  : 'border-firme-blue text-firme-blue hover:bg-firme-blue hover:text-white'
              }`}
              data-testid="button-investment-simulation"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Investimentos Tradicionais
            </Button>
            <Button
              onClick={() => setSimulationType('consortium')}
              variant={simulationType === 'consortium' ? 'default' : 'outline'}
              className={`px-6 py-3 ${
                simulationType === 'consortium'
                  ? 'bg-firme-blue text-white'
                  : 'border-firme-blue text-firme-blue hover:bg-firme-blue hover:text-white'
              }`}
              data-testid="button-consortium-simulation"
            >
              <PiggyBank className="w-5 h-5 mr-2" />
              Consórcio
            </Button>
          </div>
          
          <h4 className="text-xl font-bold text-firme-gray">
            Simule seu plano de investimentos:
          </h4>
        </div>
        
        <div className="max-w-2xl mx-auto bg-firme-light-gray p-8 rounded-xl">
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
              <Select value={objective} onValueChange={setObjective}>
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
              {!objective && errors.objective && <p className="text-red-500 text-sm mt-1">Selecione um objetivo</p>}
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
              className="w-full bg-firme-blue text-white py-3 rounded-lg font-medium hover:bg-firme-blue-light transition-colors"
              data-testid="button-submit-simulation"
            >
              <Calculator className="w-5 h-5 mr-2" />
              {(!isStaticSite && mutation.isPending) ? "Enviando..." : "CRIAR MINHA PROJEÇÃO"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
