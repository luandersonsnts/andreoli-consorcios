import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  calcularConsorcioAutomatico,
  getTiposConsorcio, 
  formatarMoeda,
  type AutoConsortiumCalculation 
} from '@/lib/consortiumCalculator';
import { Calculator, TrendingUp, Info, DollarSign, Calendar, Percent, ArrowLeft } from 'lucide-react';

// Schema de validação
const simulationSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  email: z.string().email("Email inválido"),
  tipo: z.string().min(1, "Tipo de consórcio é obrigatório"),
  valorDesejado: z.string().min(1, "Valor desejado é obrigatório"),
  parcelaMaxima: z.string().min(1, "Parcela máxima é obrigatória"),
  usarLanceEmbutido: z.boolean().optional(),
});

type SimulationFormData = z.infer<typeof simulationSchema>;

interface UnifiedConsortiumSimulatorProps {
  onSimulationComplete?: (result: AutoConsortiumCalculation) => void;
}

export function UnifiedConsortiumSimulator({ onSimulationComplete }: UnifiedConsortiumSimulatorProps) {
  const [resultado, setResultado] = useState<AutoConsortiumCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [erro, setErro] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<SimulationFormData>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      usarLanceEmbutido: false
    }
  });

  const tiposConsorcio = getTiposConsorcio();

  const onSubmit = async (data: SimulationFormData) => {
    setIsCalculating(true);
    setErro('');

    try {
      const valorDesejado = parseFloat(data.valorDesejado.replace(/[^\d,]/g, '').replace(',', '.'));
      const parcelaMaxima = parseFloat(data.parcelaMaxima.replace(/[^\d,]/g, '').replace(',', '.'));

      if (isNaN(valorDesejado) || valorDesejado <= 0) {
        throw new Error('Valor desejado inválido');
      }

      if (isNaN(parcelaMaxima) || parcelaMaxima <= 0) {
        throw new Error('Parcela máxima inválida');
      }

      const resultadoCalculo = calcularConsorcioAutomatico(
        data.tipo,
        valorDesejado,
        parcelaMaxima,
        data.usarLanceEmbutido ? 15 : 0
      );

      setResultado(resultadoCalculo);
      onSimulationComplete?.(resultadoCalculo);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro no cálculo');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleNovaSimulacao = () => {
    setResultado(null);
    setErro('');
    reset();
  };

  const handleWhatsAppShare = () => {
    if (!resultado) return;

    const message = `
🏦 *Simulação de Consórcio*

💰 *Valor da Carta:* ${formatarMoeda(resultado.valorCarta)}
📅 *Parcelas:* ${resultado.parcelasCalculadas}x
💳 *Parcela:* ${formatarMoeda(resultado.parcelaReal)}

📊 *Composição:*
• Fundo de Reserva: ${formatarMoeda(resultado.fundoReserva)}
• Taxa Administração: ${formatarMoeda(resultado.taxaAdministracao)}
• Seguro Vida: ${formatarMoeda(resultado.seguroVida)}
• Seguro Quebra: ${formatarMoeda(resultado.seguroQuebra)}
${resultado.lanceEmbutido ? `• Lance Embutido: ${formatarMoeda(resultado.lanceEmbutido)}` : ''}

💰 *Total do Plano:* ${formatarMoeda(resultado.parcelaReal * resultado.parcelasCalculadas)}

Simulação feita em: ${new Date().toLocaleDateString('pt-BR')}
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5574988384902?text=${encodedMessage}`, '_blank');
  };

  // Se há resultado, mostra a tela de resultado
  if (resultado) {
    return (
      <div className="space-y-6">
        {/* Botões de Ação */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleNovaSimulacao}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Nova Simulação
          </Button>
          <Button
            onClick={handleWhatsAppShare}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Enviar por WhatsApp
          </Button>
        </div>

        {/* Resultado Simplificado */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-firme-blue" />
              <span>Resultado da Simulação</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Valor do Crédito</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatarMoeda(resultado.valorCarta)}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Primeira Parcela</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatarMoeda(resultado.parcelaReal)}
                  </p>
                </div>
              </div>

              {/* Informações do Lance */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-3">Informações do Lance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Lance Total</p>
                    <p className="text-lg font-bold text-yellow-700">
                      {formatarMoeda(resultado.lanceTotal)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Lance Embutido (15%)</p>
                    <p className="text-lg font-bold text-yellow-700">
                      {formatarMoeda(resultado.lanceEmbutido)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Valor a Pagar no Lance</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatarMoeda(resultado.valorAPagar)}
                    </p>
                    <p className="text-xs text-gray-500">35% do valor da carta</p>
                  </div>
                </div>
              </div>

              {/* Informações das Parcelas Restantes */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-3">Após o Lance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Parcelas Restantes</p>
                    <p className="text-lg font-bold text-purple-700">
                      {resultado.parcelasCalculadas - 1}x
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Valor Reduzido</p>
                    <p className="text-lg font-bold text-purple-700">
                      {formatarMoeda(resultado.parcelaReduzida)}
                    </p>
                    <p className="text-xs text-gray-500">Redução baseada no valor total pago do lance</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>
    );
  }

  // Formulário de entrada
  return (
    <div className="space-y-6">
      {/* Formulário de Entrada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-firme-blue" />
            <span>Simulação de Consórcio</span>
          </CardTitle>
          <CardDescription>
            Informe seus dados e descubra automaticamente o melhor plano para você
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Dados Pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Seu nome completo"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="(11) 99999-9999"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Dados da Simulação */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Consórcio</Label>
                <Select onValueChange={(value) => setValue('tipo', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                     {tiposConsorcio.map((tipo) => (
                       <SelectItem key={tipo.value} value={tipo.value}>
                         {tipo.label}
                       </SelectItem>
                     ))}
                   </SelectContent>
                </Select>
                {errors.tipo && (
                  <p className="text-sm text-red-600">{errors.tipo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorDesejado">Valor Desejado</Label>
                <Input
                  id="valorDesejado"
                  {...register('valorDesejado')}
                  placeholder="R$ 50.000,00"
                />
                <p className="text-xs text-gray-500">
                  Valor da carta que você deseja adquirir
                </p>
                {errors.valorDesejado && (
                  <p className="text-sm text-red-600">{errors.valorDesejado.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="parcelaMaxima">Parcela Máxima</Label>
                <Input
                  id="parcelaMaxima"
                  {...register('parcelaMaxima')}
                  placeholder="R$ 900,00"
                />
                <p className="text-xs text-gray-500">
                  O sistema calculará automaticamente o número de parcelas
                </p>
                {errors.parcelaMaxima && (
                  <p className="text-sm text-red-600">{errors.parcelaMaxima.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Opções de Lance</Label>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <Switch
                    id="usarLanceEmbutido"
                    {...register('usarLanceEmbutido')}
                    onCheckedChange={(checked) => setValue('usarLanceEmbutido', checked)}
                  />
                  <Label htmlFor="usarLanceEmbutido" className="text-sm">
                    Usar Lance Embutido (15%)
                  </Label>
                </div>
                <p className="text-xs text-gray-500">
                  Lance embutido reduz o valor líquido mas facilita a contemplação
                </p>
              </div>
            </div>

            {erro && (
              <Alert>
                <AlertDescription className="text-red-600">
                  {erro}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-firme-blue hover:bg-firme-blue/90"
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <Calculator className="mr-2 h-4 w-4 animate-spin" />
                  Calculando...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Calcular Simulação
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}