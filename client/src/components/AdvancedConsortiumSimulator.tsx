import React, { useState, useEffect } from 'react';
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
  calcularConsorcioAvancado, 
  calcularConsorcioAutomatico,
  getTiposConsorcio, 
  validarEntradaConsorcio, 
  formatarMoeda,
  type AdvancedConsortiumResult,
  type AutoConsortiumCalculation 
} from '@/lib/consortiumCalculator';
import { Calculator, TrendingUp, TrendingDown, Info, DollarSign, Calendar, Percent } from 'lucide-react';

interface AdvancedConsortiumSimulatorProps {
  onSimulationComplete?: (result: AdvancedConsortiumResult) => void;
}

export function AdvancedConsortiumSimulator({ onSimulationComplete }: AdvancedConsortiumSimulatorProps) {
  const [tipo, setTipo] = useState<string>('');
  const [valorDesejado, setValorDesejado] = useState<string>('');
  const [parcelaMaxima, setParcelaMaxima] = useState<string>('');
  const [lancePercentual, setLancePercentual] = useState<string>('25');
  const [usarEmbutido, setUsarEmbutido] = useState<boolean>(false);
  const [incluirLance, setIncluirLance] = useState<boolean>(false);
  
  const [resultado, setResultado] = useState<AutoConsortiumCalculation | null>(null);
  const [erro, setErro] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const tiposConsorcio = getTiposConsorcio();

  const handleCalculate = async () => {
    setErro('');
    setIsCalculating(true);

    try {
      const valor = parseFloat(valorDesejado.replace(/[^\d,]/g, '').replace(',', '.'));
      const parcela = parseFloat(parcelaMaxima.replace(/[^\d,]/g, '').replace(',', '.'));
      const percentualLance = incluirLance && usarEmbutido ? parseFloat(lancePercentual) : 0;

      // Validações básicas
      if (!tipo) {
        setErro('Selecione o tipo de consórcio');
        return;
      }
      if (!valor || valor <= 0) {
        setErro('Informe um valor válido para a carta');
        return;
      }
      if (!parcela || parcela <= 0) {
        setErro('Informe um valor válido para a parcela máxima');
        return;
      }

      // Calcular usando a nova função
      const result = calcularConsorcioAutomatico(
        tipo,
        valor,
        parcela,
        percentualLance
      );

      setResultado(result);

    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro no cálculo');
    } finally {
      setIsCalculating(false);
    }
  };

  const formatInputValue = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('pt-BR').format(parseInt(numericValue) || 0);
  };

  const handleValueChange = (value: string) => {
    setValorDesejado(formatInputValue(value));
  };

  const handleParcelaChange = (value: string) => {
    setParcelaMaxima(formatInputValue(value));
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Entrada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-firme-blue" />
            <span>Simulação Avançada de Consórcio</span>
          </CardTitle>
          <CardDescription>
            Calcule com precisão usando as fórmulas oficiais do mercado de consórcios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tipo de Consórcio */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Consórcio</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de consórcio" />
              </SelectTrigger>
              <SelectContent>
                {tiposConsorcio.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Valor Desejado */}
          <div className="space-y-2">
            <Label htmlFor="valor">Valor Desejado da Carta</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="valor"
                type="text"
                placeholder="0"
                value={valorDesejado}
                onChange={(e) => handleValueChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Parcela Máxima */}
          <div className="space-y-2">
            <Label htmlFor="parcela-maxima">Parcela Máxima que Pode Pagar</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="parcela-maxima"
                type="text"
                placeholder="0"
                value={parcelaMaxima}
                onChange={(e) => handleParcelaChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-500">
              O sistema calculará automaticamente o número de parcelas necessárias
            </p>
          </div>

          {/* Configurações de Lance */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <Label htmlFor="incluir-lance" className="text-sm font-medium">
                Incluir Simulação de Lance
              </Label>
              <Switch
                id="incluir-lance"
                checked={incluirLance}
                onCheckedChange={setIncluirLance}
              />
            </div>

            {incluirLance && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="lance-percentual">Percentual do Lance (%)</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="lance-percentual"
                      type="number"
                      placeholder={usarEmbutido ? "15" : "25"}
                      min={usarEmbutido ? "15" : "15"}
                      max={usarEmbutido ? "15" : "99"}
                      step="0.1"
                      value={lancePercentual}
                      onChange={(e) => setLancePercentual(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {usarEmbutido 
                      ? "Lance embutido: máximo 15%" 
                      : "Lance livre: entre 15% e 99%"
                    }
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="usar-embutido" className="text-sm font-medium">
                      Usar Lance Embutido
                    </Label>
                    <p className="text-xs text-gray-500">
                      Parte do lance é coberta pelo próprio crédito
                    </p>
                  </div>
                  <Switch
                    id="usar-embutido"
                    checked={usarEmbutido}
                    onCheckedChange={setUsarEmbutido}
                  />
                </div>
              </>
            )}
          </div>

          {/* Botão de Calcular */}
          <Button 
            onClick={handleCalculate} 
            disabled={!tipo || !valorDesejado || !parcelas || isCalculating}
            className="w-full"
          >
            {isCalculating ? 'Calculando...' : 'Calcular Simulação'}
          </Button>

          {/* Erro */}
          {erro && (
            <Alert variant="destructive">
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Resultados */}
      {resultado && (
        <div className="space-y-4">
          {/* Resumo Principal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Resultado da Simulação</span>
                <Badge variant="outline" className="text-firme-blue">
                  {resultado.detalhes.tipo.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">
                    {resultado.lanceEmbutido ? 'Valor Líquido (Desejado)' : 'Valor da Carta'}
                  </Label>
                  <p className="text-2xl font-bold text-firme-blue">
                    {formatarMoeda(resultado.valorCarta)}
                  </p>
                  {resultado.lanceEmbutido && (
                    <p className="text-sm text-gray-500">
                      Valor bruto da carta: {formatarMoeda(resultado.valorCartaAjustado)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Número de Parcelas</Label>
                  <p className="text-2xl font-bold text-orange-600">
                    {resultado.parcelasCalculadas}x
                  </p>
                  <p className="text-xs text-gray-500">Calculado automaticamente</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Parcela Real</Label>
                  <p className="text-2xl font-bold text-green-600">
                    {formatarMoeda(resultado.parcelaReal)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Máx. informada: {formatarMoeda(resultado.parcelaMaxima)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhamento dos Encargos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Composição dos Valores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Valor da Carta</span>
                  <span className="font-medium">
                    {formatarMoeda(resultado.lanceEmbutido ? resultado.valorCartaAjustado : resultado.valorCarta)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fundo de Reserva</span>
                  <span className="font-medium">{formatarMoeda(resultado.fundoReserva)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taxa de Administração</span>
                  <span className="font-medium">{formatarMoeda(resultado.taxaAdministracao)}</span>
                </div>
                {resultado.lanceEmbutido && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lance Embutido</span>
                    <span className="font-medium text-blue-600">{formatarMoeda(resultado.lanceEmbutido)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center font-bold">
                  <span>Total com Encargos</span>
                  <span className="text-orange-600">{formatarMoeda(resultado.totalComEncargos)}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Seguro de Vida (total)</span>
                    <span className="font-medium">{formatarMoeda(resultado.seguroVida)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Seguro Quebra (total)</span>
                    <span className="font-medium">{formatarMoeda(resultado.seguroQuebra)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Seguros Mensais</span>
                    <span className="font-medium">{formatarMoeda(resultado.detalhes.segurosTotal)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Lance Embutido */}
          {resultado.lanceEmbutido && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <span>Lance Embutido (15%)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Valor do Lance Embutido</span>
                    <span className="font-medium text-blue-600">
                      {formatarMoeda(resultado.lanceEmbutido)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                    <Info className="h-4 w-4 inline mr-1" />
                    O lance embutido reduz o valor líquido da carta que você receberá
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resumo dos Encargos Totais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Fundo de Reserva Total</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatarMoeda(resultado.fundoReservaTotal)}
                  </p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Taxa de Administração Total</p>
                  <p className="text-lg font-bold text-purple-600">
                    {formatarMoeda(resultado.taxaAdministracaoTotal)}
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Valor Total do Plano</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatarMoeda(resultado.parcelaReal * resultado.numeroParcelas)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}