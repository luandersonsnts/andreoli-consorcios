import React, { useEffect, useState } from 'react';
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
import { openWhatsAppWithMessage } from '@/lib/runtimeEnv';
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
  preSelectedTipo?: string;
}

export function UnifiedConsortiumSimulator({ onSimulationComplete, preSelectedTipo }: UnifiedConsortiumSimulatorProps) {
  const [resultado, setResultado] = useState<AutoConsortiumCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [erro, setErro] = useState<string>('');
  const [editarTipo, setEditarTipo] = useState(false);
  // Estados para o fluxo de premiação (rascunho)
  const [showOfferCTA, setShowOfferCTA] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const [offerApplied, setOfferApplied] = useState(false);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const urlParamsDraft = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const [globalConfig, setGlobalConfig] = useState<{ premiacaoEnabled: boolean; campaignLabel: string } | null>(null);
  const campaignLabel = (globalConfig?.campaignLabel || urlParamsDraft.get('utm_campaign') || 'dezembro').toLowerCase();
  const mesesPtBr = [
    'janeiro','fevereiro','março','abril','maio','junho',
    'julho','agosto','setembro','outubro','novembro','dezembro'
  ];
  const baseIndex = mesesPtBr.indexOf(campaignLabel);
  const effectiveIndex = baseIndex >= 0 ? baseIndex : mesesPtBr.indexOf('dezembro');
  const deferredMonthLabel = mesesPtBr[(effectiveIndex + 2) % 12];
  const utmContent = urlParamsDraft.get('utm_content') || '';
  const utmPremiacao = urlParamsDraft.get('utm_premiacao') || '';
  const premiacaoEnabledByUrl = utmPremiacao === 'on' || ['premiacao_draft', 'premiacao_on', 'vencedor_dezembro', 'vencedor_fevereiro'].includes(utmContent);
  const premiacaoDisabledByUrl = utmPremiacao === 'off' || utmContent === 'premiacao_off';
  const premiacaoEnabledByEnv = (import.meta.env?.VITE_PREMIACAO_ENABLED === 'true');
  const isPremiacaoEnabledServer = globalConfig?.premiacaoEnabled === true;
  const isPremiacaoDraft = (premiacaoEnabledByUrl || isPremiacaoEnabledServer || premiacaoEnabledByEnv) && !premiacaoDisabledByUrl;

  useEffect(() => {
    let cancelled = false;
    // Tenta ler configuração pública do servidor; ignora erros em modo estático
    fetch('/api/config')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!cancelled && data && typeof data.premiacaoEnabled !== 'undefined') {
          setGlobalConfig(data);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

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

  // Pré-seleção do tipo via URL ou prop
  const [tipoPreSelecionado, setTipoPreSelecionado] = useState<string | null>(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tipoFromUrl = urlParams.get('tipo');
    const effectiveTipo = preSelectedTipo ?? tipoFromUrl ?? null;
    if (effectiveTipo) {
      setTipoPreSelecionado(effectiveTipo);
      setValue('tipo', effectiveTipo);
    }
  }, [preSelectedTipo, setValue]);

  // Controla exibição do CTA/roleta em modo rascunho após resultado
  useEffect(() => {
    if (resultado && isPremiacaoDraft) {
      setShowOfferCTA(true);
    } else {
      setShowOfferCTA(false);
      setShowWheel(false);
      setOfferApplied(false);
      setWheelSpinning(false);
    }
  }, [resultado, isPremiacaoDraft]);

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

    // Dados do cliente a partir do formulário
    const nome = watch('name');
    const telefone = watch('phone');
    const email = watch('email');
    const tipo = watch('tipo');
    const tipoLabel = getTiposConsorcio().find(t => t.value === tipo)?.label || tipo;

    // Linha extra da premiação (rascunho) quando aplicada
    const premiacaoAtiva = (isPremiacaoDraft && offerApplied);
    const premiacaoLine = premiacaoAtiva
      ? `\n🎁 Premiação aplicada: 1ª parcela somente em ${deferredMonthLabel}`
      : "";
    const premiacaoRegras = premiacaoAtiva
      ? `\n\n📜 Condição especial\n• Validade: durante a campanha de ${campaignLabel}\n• Regras: elegibilidade sujeita à análise; disponibilidade de grupos; não cumulativa`
      : "";

    // Mensagem simplificada apenas com dados preenchidos e resumo exibido
    const message = `
🏦 *Simulação de Consórcio - ANDREOLI*

👤 *Cliente*
Nome: ${nome}
Telefone: ${telefone}
Email: ${email}

📂 *Tipo*: ${tipoLabel}

📈 *Resumo da Simulação*
• Valor da Carta: ${formatarMoeda(resultado.valorCarta)}
• Primeira Parcela: ${formatarMoeda(resultado.parcelaReal)}
• Parcelas: ${resultado.parcelasCalculadas}x

💸 *Informações do Lance*
• Lance Total (50%): ${formatarMoeda(resultado.lanceTotal)}
• Lance Embutido (15%): ${formatarMoeda(resultado.lanceEmbutido)}
• A pagar no lance (35%): ${formatarMoeda(resultado.valorAPagar)}

 🧮 *Após o Lance*
 • Parcelas Restantes: ${resultado.parcelasCalculadas}x
 • Parcela Reduzida: ${formatarMoeda(resultado.parcelaReduzida)}${premiacaoLine}${premiacaoRegras}

Simulação gerada em ${new Date().toLocaleDateString('pt-BR')}
    `.trim();

    openWhatsAppWithMessage(message);
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
            {isPremiacaoDraft && offerApplied ? 'Enviar com premiação' : 'Enviar por WhatsApp'}
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
              {/* Selo de Premiação aplicado (rascunho) */}
              {isPremiacaoDraft && offerApplied && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    🥳 Premiação aplicada: 1ª parcela somente em {deferredMonthLabel}
                  </Badge>
                </div>
              )}

              {/* Banner explicativo da premiação (rascunho) */}
              {isPremiacaoDraft && offerApplied && (
                <div className="p-5 rounded-xl border border-green-200 bg-green-50">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl" aria-hidden>🎉</span>
                    <div>
                      <p className="text-base font-semibold text-green-800">Você ganhou uma condição especial</p>
                      <p className="text-lg font-bold text-green-700 mt-1">1ª parcela somente em fevereiro</p>
                      <p className="text-sm text-green-800 mt-2">
                        A premiação foi aplicada à sua simulação. Ao enviar, nossa equipe identifica sua proposta com essa condição para seguir no atendimento.
                      </p>
                      <ul className="mt-3 text-sm text-green-900 list-disc list-inside space-y-1">
                        <li>Válida nesta simulação em modo de testes</li>
                        <li>Visível para você e para nossa equipe no envio</li>
                      </ul>

                      <div className="mt-4 pt-3 border-t border-green-200">
                        <p className="text-sm font-semibold text-green-800">Validade e regras</p>
                        <ul className="mt-2 text-sm text-green-900 list-disc list-inside space-y-1">
                          <li>{`Campanha de ${campaignLabel}; válida durante o mês de ${campaignLabel}`}</li>
                          <li>Elegibilidade sujeita à análise e disponibilidade de grupos</li>
                          <li>Não cumulativa com outras ofertas ou descontos</li>
                          <li>Pode variar conforme categoria e consórcio escolhida</li>
                          <li>Válida apenas para propostas geradas nesta simulação</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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

              {/* CTA para roleta (rascunho) */}
              {isPremiacaoDraft && showOfferCTA && !showWheel && !offerApplied && (
                <div className="mt-4 p-6 bg-blue-50 rounded-xl border border-blue-200 text-center">
                  <p className="text-sm text-blue-800 mb-3">Descubra sua condição exclusiva</p>
                  <Button
                    className="mx-auto block px-6 py-3 bg-gradient-to-r from-firme-blue to-blue-600 text-white shadow-lg hover:shadow-xl animate-pulse"
                    onClick={() => setShowWheel(true)}
                  >
                    Gire e receba uma oferta
                  </Button>
                  <div className="mt-3">
                    <Button variant="outline" onClick={handleWhatsAppShare} className="mx-auto">
                      Prefere enviar sem oferta? Enviar simulação
                    </Button>
                  </div>
                </div>
              )}

              {/* Roleta (rascunho) */}
              {isPremiacaoDraft && showWheel && !offerApplied && (
                <div className="mt-8 flex flex-col items-center">
                  {/* Ponteiro */}
                  <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-red-500 mb-2" aria-hidden/>

                  {/* Roleta aprimorada */}
                  <div
                    className={`relative w-56 h-56 rounded-full ring-4 ${wheelSpinning ? 'ring-blue-300' : 'ring-blue-200'} shadow-2xl overflow-hidden`}
                    style={{
                      backgroundImage:
                        'conic-gradient(#c7d2fe 0 60deg, #93c5fd 60deg 120deg, #60a5fa 120deg 180deg, #38bdf8 180deg 240deg, #22d3ee 240deg 300deg, #a5b4fc 300deg 360deg)',
                      transform: `rotate(${wheelRotation}deg)`,
                      transition: 'transform 2.2s cubic-bezier(.22,.61,.36,1)'
                    }}
                  >
                    {/* Hub central */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/90 border-2 border-blue-200 shadow-md flex items-center justify-center">
                        <span className="text-xs font-semibold text-firme-blue">GIRAR</span>
                      </div>
                    </div>
                  </div>

                  {/* Botão de giro */}
                  <Button
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-firme-blue to-blue-600 text-white shadow-lg hover:shadow-xl"
                    onClick={() => {
                      if (wheelSpinning) return;
                      setWheelSpinning(true);
                      const spins = 1440; // 4 voltas completas
                      const offset = 30; // leve ajuste de parada
                      setWheelRotation((prev) => prev + spins + offset);
                      setTimeout(() => {
                        setWheelSpinning(false);
                        setOfferApplied(true);
                        try {
                          if (navigator?.vibrate) navigator.vibrate([80, 40, 80]);
                        } catch {}
                      }, 2200);
                    }}
                  >
                    Girar roleta
                  </Button>
                  <p className="text-xs text-gray-600 mt-2">Premiação garantida neste teste: 1ª parcela somente em {deferredMonthLabel}</p>
                </div>
              )}
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
                  className="placeholder:text-gray-400 text-gray-900"
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
                  className="placeholder:text-gray-400 text-gray-900"
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
                  className="placeholder:text-gray-400 text-gray-900"
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
                {tipoPreSelecionado && !editarTipo ? (
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {tiposConsorcio.find(t => t.value === tipoPreSelecionado)?.label || tipoPreSelecionado}
                    </Badge>
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditarTipo(true)}>
                      Mudar categoria
                    </Button>
                  </div>
                ) : (
                  <>
                    <Select value={watch('tipo') || ''} onValueChange={(value) => setValue('tipo', value)}>
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
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorDesejado">Valor Desejado</Label>
                <Input
                  id="valorDesejado"
                  {...register('valorDesejado')}
                  placeholder="R$ 50.000,00"
                  className="placeholder:text-gray-400 text-gray-900"
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
                  className="placeholder:text-gray-400 text-gray-900"
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