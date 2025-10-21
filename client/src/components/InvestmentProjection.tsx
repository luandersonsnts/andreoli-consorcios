import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Calendar, Target, Send } from 'lucide-react';
import { InvestmentCalculation } from '@/lib/consortiumCalculator';

interface InvestmentProjectionProps {
  calculation: InvestmentCalculation;
  clientData: {
    name: string;
    phone: string;
    email: string;
    objective: string;
  };
  onSendWhatsApp: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};

export function InvestmentProjection({ calculation, clientData, onSendWhatsApp }: InvestmentProjectionProps) {
  return (
    <div className="space-y-6 mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🎯 Sua Projeção de Investimento
        </h2>
        <p className="text-gray-600">
          Olá <strong>{clientData.name}</strong>, aqui está sua simulação personalizada!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Aporte Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(calculation.monthlyAmount)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Prazo
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {calculation.timeframe} anos
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Investido
            </CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(calculation.totalInvested)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Rentabilidade
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatPercentage(calculation.annualRate)}
            </div>
            <p className="text-xs text-gray-500">ao ano</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Resultado Final
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-green-100 text-sm">Valor Total Acumulado</p>
              <p className="text-3xl font-bold">
                {formatCurrency(calculation.totalReturn)}
              </p>
            </div>
            <div>
              <p className="text-green-100 text-sm">Lucro Obtido</p>
              <p className="text-3xl font-bold">
                {formatCurrency(calculation.profit)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Evolução Anual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {calculation.yearlyBreakdown.map((year) => (
              <div key={year.year} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-700">
                  Ano {year.year}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Investido: {formatCurrency(year.totalInvested)}
                  </div>
                  <div className="font-bold text-green-600">
                    Total: {formatCurrency(year.totalReturn)}
                  </div>
                  <div className="text-sm text-blue-600">
                    Lucro: {formatCurrency(year.profit)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Objetivo: {clientData.objective}
              </h3>
              <p className="text-gray-600 text-sm">
                Esta simulação foi criada especialmente para você alcançar seus objetivos financeiros.
                Entre em contato conosco via WhatsApp para dar continuidade ao seu investimento!
              </p>
            </div>
            
            <Button 
              onClick={onSendWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
              size="lg"
            >
              <Send className="mr-2 h-5 w-5" />
              Enviar para WhatsApp
            </Button>
            
            <p className="text-xs text-gray-500">
              Ao clicar, você será redirecionado para o WhatsApp com todos os dados da sua simulação
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}