import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertComplaintSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isStaticSite, openWhatsAppWithMessage } from "@/lib/runtimeEnv";
import { Send, Info } from "lucide-react";
import type { z } from "zod";

type ComplaintFormData = z.infer<typeof insertComplaintSchema>;

export default function ComplaintsForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(insertComplaintSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      type: "",
      subject: "",
      message: "",
      contactAuthorized: false
    }
  });

  const type = watch("type");
  const contactAuthorized = watch("contactAuthorized");

  const mutation = useMutation({
    mutationFn: async (data: ComplaintFormData) => {
      const response = await apiRequest("POST", "/api/complaints", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Manifestação enviada!",
        description: "Recebemos sua manifestação e responderemos em até 24 horas úteis."
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ['/api/complaints'] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Verifique os dados e tente novamente."
      });
    }
  });

  const onSubmit = (data: ComplaintFormData) => {
    if (isStaticSite) {
      const typeLabel = data.type === "reclamacao" ? "Reclamação" : 
                       data.type === "sugestao" ? "Sugestão" : 
                       data.type === "elogio" ? "Elogio" : "Dúvida";
      const message = `*MANIFESTAÇÃO - ANDREOLI CONSÓRCIOS*

👤 *Dados do Cliente:*
Nome: ${data.name}
Email: ${data.email}
Telefone: ${data.phone}

📋 *Tipo:* ${typeLabel}
📌 *Assunto:* ${data.subject}

💬 *Mensagem:*
${data.message}

✅ *Autoriza contato:* ${data.contactAuthorized ? "Sim" : "Não"}`;

      openWhatsAppWithMessage(message);
      toast({
        title: "Redirecionando para WhatsApp",
        description: "Continue sua manifestação pelo WhatsApp!"
      });
      reset();
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <section id="reclameaqui" className="py-16 bg-firme-light-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-firme-gray mb-4">
            Reclame Aqui
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Sua opinião é muito importante para a ANDREOLI CONSÓRCIOS. Utilize este canal para enviar sugestões, elogios ou reclamações sobre nossos serviços.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="complaintsName" className="block text-firme-gray font-medium mb-2">Nome Completo</Label>
                <Input
                  id="complaintsName"
                  {...register("name")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-firme-blue focus:border-transparent"
                  placeholder="Seu nome completo"
                  data-testid="input-complaint-name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="complaintsEmail" className="block text-firme-gray font-medium mb-2">E-mail</Label>
                <Input
                  id="complaintsEmail"
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-firme-blue focus:border-transparent"
                  placeholder="seu@email.com"
                  data-testid="input-complaint-email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="complaintsPhone" className="block text-firme-gray font-medium mb-2">Telefone</Label>
                <Input
                  id="complaintsPhone"
                  type="tel"
                  {...register("phone")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-firme-blue focus:border-transparent"
                  placeholder="(11) 99999-9999"
                  data-testid="input-complaint-phone"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <Label className="block text-firme-gray font-medium mb-2">Tipo de Manifestação</Label>
                <Select value={type} onValueChange={(value) => setValue("type", value)}>
                  <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cavalcante-orange focus:border-transparent" data-testid="select-complaint-type">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reclamacao">Reclamação</SelectItem>
                    <SelectItem value="sugestao">Sugestão</SelectItem>
                    <SelectItem value="elogio">Elogio</SelectItem>
                    <SelectItem value="duvida">Dúvida</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
              </div>
            </div>
            
            <div>
              <Label htmlFor="complaintsSubject" className="block text-firme-gray font-medium mb-2">Assunto</Label>
              <Input
                id="complaintsSubject"
                {...register("subject")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cavalcante-orange focus:border-transparent"
                placeholder="Descreva brevemente o assunto"
                data-testid="input-complaint-subject"
              />
              {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="complaintsMessage" className="block text-firme-gray font-medium mb-2">Mensagem</Label>
              <Textarea
                id="complaintsMessage"
                {...register("message")}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cavalcante-orange focus:border-transparent resize-none"
                placeholder="Descreva detalhadamente sua manifestação..."
                data-testid="textarea-complaint-message"
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox
                id="contactAuth"
                checked={contactAuthorized}
                onCheckedChange={(checked) => setValue("contactAuthorized", checked === true)}
                className="w-4 h-4 text-firme-blue border-gray-300 rounded focus:ring-firme-blue"
                data-testid="checkbox-contact-authorized"
              />
              <Label htmlFor="contactAuth" className="text-sm text-gray-600">
                Autorizo o contato via e-mail e telefone para acompanhamento da manifestação.
              </Label>
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting || mutation.isPending}
              className="w-full bg-firme-blue text-white py-3 rounded-lg font-medium hover:bg-firme-blue-light transition-colors"
              data-testid="button-submit-complaint"
            >
              <Send className="w-5 h-5 mr-2" />
              {mutation.isPending ? "Enviando..." : "ENVIAR MANIFESTAÇÃO"}
            </Button>
          </form>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center text-blue-600">
              <Info className="w-5 h-5 mr-2" />
              <span className="font-medium">Informação importante:</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              Todas as manifestações são analisadas pela nossa equipe. Você receberá uma resposta em até 24 horas úteis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
