import React, { useEffect, useState } from 'react';
import { UnifiedConsortiumSimulator } from '@/components/UnifiedConsortiumSimulator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  ArrowLeft, 
  CheckCircle, 
  TrendingUp,
  Info,
  Lightbulb,
  Zap,
  Target,
  Clock
} from 'lucide-react';
import { Link } from 'wouter';
import { openWhatsAppWithMessage } from '@/lib/runtimeEnv';

export default function SimulacaoUnificada() {
  // Exibição direta do status de premiação (ajuda na validação de endereçamento/config)
  const [premiacaoStatus, setPremiacaoStatus] = useState<{
    premiacaoEnabled: boolean;
    campaignLabel: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Permitir override via parâmetro de URL também no cabeçalho:
    const params = new URLSearchParams(window.location.search);
    const premiacaoParam = params.get('premiacao')?.toLowerCase() || undefined;
    const isPremiacaoEnabledParam =
      premiacaoParam === 'on' || premiacaoParam === 'true'
        ? true
        : premiacaoParam === 'off' || premiacaoParam === 'false'
          ? false
          : undefined;

    const envPrem = ((import.meta.env?.VITE_PREMIACAO_ENABLED ?? 'true') === 'true');

    fetch('/api/config')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        const serverEnabled = data && typeof data.premiacaoEnabled !== 'undefined'
          ? Boolean(data.premiacaoEnabled)
          : undefined;
        const enabled = (typeof isPremiacaoEnabledParam === 'boolean')
          ? isPremiacaoEnabledParam
          : (typeof serverEnabled === 'boolean')
            ? serverEnabled
            : envPrem;

        setPremiacaoStatus({
          premiacaoEnabled: enabled,
          campaignLabel: String((data && data.campaignLabel) || 'dezembro').toLowerCase(),
        });

        if (data) {
          // Log auxiliar para inspeção em produção
          console.log('[Simulação] /api/config =>', data);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn('[Simulação] Falha ao consultar /api/config', err);
        const enabled = (typeof isPremiacaoEnabledParam === 'boolean') ? isPremiacaoEnabledParam : envPrem;
        setPremiacaoStatus({
          premiacaoEnabled: enabled,
          campaignLabel: 'dezembro'
        });
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-firme-blue">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-firme-gray">
                  Simulação de Consórcio
                </h1>
                <p className="text-sm text-gray-600">
                  Calcule automaticamente o melhor plano para você
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-firme-blue/10 text-firme-blue">
                <Zap className="h-3 w-3 mr-1" />
                Nova Versão
              </Badge>
              {premiacaoStatus && (
                <Badge variant={premiacaoStatus.premiacaoEnabled ? 'default' : 'secondary'}
                       className={premiacaoStatus.premiacaoEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                  {premiacaoStatus.premiacaoEnabled ? 'Premiação ativa' : 'Premiação inativa'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Simulador Principal */}
            <div className="lg:col-span-2">
              <UnifiedConsortiumSimulator />
            </div>

            {/* Sidebar com Informações */}
            <div className="space-y-6">
              {/* Vantagens do Novo Simulador */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <span>Novo Simulador</span>
                  </CardTitle>
                  <CardDescription>
                    Agora com cálculo automático inteligente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Cálculo Automático</p>
                      <p className="text-xs text-gray-600">
                        Informe apenas o valor desejado e a parcela máxima
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Fórmulas Oficiais</p>
                      <p className="text-xs text-gray-600">
                        Usa as mesmas fórmulas do mercado de consórcios
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Lance Embutido</p>
                      <p className="text-xs text-gray-600">
                        Opção de lance embutido de 15% para facilitar contemplação
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Resultados Detalhados</p>
                      <p className="text-xs text-gray-600">
                        Veja a composição completa da sua parcela
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Como Funciona */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Target className="h-5 w-5 text-firme-blue" />
                    <span>Como Funciona</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-firme-blue text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium">Informe seus dados</p>
                      <p className="text-xs text-gray-600">
                        Nome, telefone, email e tipo de consórcio
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-firme-blue text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium">Defina valor e parcela</p>
                      <p className="text-xs text-gray-600">
                        Valor desejado da carta e parcela máxima que pode pagar
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-firme-blue text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium">Escolha o lance</p>
                      <p className="text-xs text-gray-600">
                        Opcionalmente, use lance embutido de 15%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-medium">Receba o resultado</p>
                      <p className="text-xs text-gray-600">
                        Número de parcelas calculado automaticamente
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dicas Importantes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    <span>Dicas Importantes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Lance Embutido</p>
                    <p className="text-xs text-blue-600">
                      Reduz o valor líquido que você recebe, mas aumenta suas chances de contemplação
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Parcela Máxima</p>
                    <p className="text-xs text-green-600">
                      Seja realista com o valor que pode pagar mensalmente
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">Seguros</p>
                    <p className="text-xs text-yellow-600">
                      Seguros de vida e quebra são obrigatórios e calculados automaticamente
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contato */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-firme-blue" />
                    <span>Precisa de Ajuda?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Nossa equipe está pronta para esclarecer suas dúvidas e ajudar você a escolher o melhor plano.
                  </p>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      const msg = 'Olá! Gostaria de mais informações sobre consórcio.';
                      openWhatsAppWithMessage(msg);
                    }}
                  >
                    Falar no WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}