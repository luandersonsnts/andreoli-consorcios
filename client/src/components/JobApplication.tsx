import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertJobApplicationSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Upload, FileText } from "lucide-react";
import type { z } from "zod";

type JobApplicationFormData = z.infer<typeof insertJobApplicationSchema>;

export default function JobApplication() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<JobApplicationFormData>({
    resolver: zodResolver(insertJobApplicationSchema.omit({ resumeFilename: true })),
    defaultValues: {
      name: "",
      phone: "",
      email: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: JobApplicationFormData & { file?: File }) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('email', data.email);
      if (data.file) {
        formData.append('resume', data.file);
      }

      const response = await fetch('/api/job-applications', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Currículo enviado!",
        description: "Recebemos sua candidatura e entraremos em contato em breve."
      });
      reset();
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['/api/job-applications'] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Verifique os dados e tente novamente."
      });
    }
  });

  const onSubmit = (data: JobApplicationFormData) => {
    mutation.mutate({ ...data, file: selectedFile || undefined });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Tipo de arquivo inválido",
          description: "Apenas arquivos PDF, DOC e DOCX são aceitos."
        });
        return;
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 5MB."
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-cavalcante-gray mb-4">
            Já imaginou conquistando um ótimo emprego com oportunidade de crescimento em PETROLINA/PE?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Venha fazer parte do Time Firme INVESTIMENTOS, uma empresa que conecta clientes aos seus sonhos financeiros. Faça parte!
          </p>
          
          <h3 className="text-2xl font-bold text-cavalcante-orange">Envie o seu currículo</h3>
        </div>
        
        <div className="max-w-2xl mx-auto bg-firme-light-gray p-8 rounded-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="jobName" className="block text-firme-gray font-medium mb-2">Nome</Label>
                <Input
                  id="jobName"
                  {...register("name")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-firme-blue focus:border-transparent"
                  placeholder="Seu nome completo"
                  data-testid="input-job-name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="jobPhone" className="block text-firme-gray font-medium mb-2">Telefone</Label>
                <Input
                  id="jobPhone"
                  type="tel"
                  {...register("phone")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-firme-blue focus:border-transparent"
                  placeholder="(11) 99999-9999"
                  data-testid="input-job-phone"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
            </div>
            
            <div>
              <Label htmlFor="jobEmail" className="block text-firme-gray font-medium mb-2">E-mail</Label>
              <Input
                id="jobEmail"
                type="email"
                {...register("email")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cavalcante-orange focus:border-transparent"
                placeholder="seu@email.com"
                data-testid="input-job-email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <Label className="block text-firme-gray font-medium mb-2">Envie seu currículo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-firme-blue transition-colors">
                {selectedFile ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="w-8 h-8 text-firme-blue" />
                    <span className="text-firme-gray font-medium">{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-red-500 hover:text-red-700"
                      data-testid="button-remove-file"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Clique aqui ou arraste seu arquivo</p>
                    <p className="text-sm text-gray-500">PDF, DOC ou DOCX (máx. 5MB)</p>
                  </>
                )}
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  data-testid="input-job-resume"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting || mutation.isPending}
              className="w-full bg-firme-blue text-white py-3 rounded-lg font-medium hover:bg-firme-blue-light transition-colors"
              data-testid="button-submit-job-application"
            >
              {mutation.isPending ? "Enviando..." : "Quero fazer parte do time!"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
