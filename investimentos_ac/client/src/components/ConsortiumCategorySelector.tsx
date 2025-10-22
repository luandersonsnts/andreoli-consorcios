import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Home, Wrench, Truck, Zap, Bike, Ship, Sun } from 'lucide-react';
import { ConsortiumCategory, CATEGORY_LABELS, getGroupsByCategory } from '@shared/consortiumTypes';

interface ConsortiumCategorySelectorProps {
  onCategorySelect: (category: ConsortiumCategory) => void;
  selectedCategory?: ConsortiumCategory;
}

export default function ConsortiumCategorySelector({ 
  onCategorySelect, 
  selectedCategory 
}: ConsortiumCategorySelectorProps) {
  const categories: Array<{
    id: ConsortiumCategory;
    label: string;
    icon: React.ComponentType<any>;
    description: string;
    groups: number;
  }> = [
    {
      id: 'eletros',
      label: 'Eletros',
      icon: Zap,
      description: 'Eletrodomésticos e eletrônicos',
      groups: getGroupsByCategory('eletros').length
    },
    {
      id: 'carro',
      label: 'Carros',
      icon: Car,
      description: 'Carros zero km ou seminovos',
      groups: getGroupsByCategory('carro').length
    },
    {
      id: 'imovel',
      label: 'Imóveis',
      icon: Home,
      description: 'Casas, apartamentos e terrenos',
      groups: getGroupsByCategory('imovel').length
    },
    {
      id: 'moto',
      label: 'Motos',
      icon: Bike,
      description: 'Motos zero km ou seminovas',
      groups: getGroupsByCategory('moto').length
    },
    {
      id: 'servicos',
      label: 'Serviços',
      icon: Wrench,
      description: 'Reformas, viagens, cursos, cirurgias',
      groups: getGroupsByCategory('servicos').length
    },
    {
      id: 'barco',
      label: 'Barcos',
      icon: Ship,
      description: 'Embarcações e equipamentos náuticos',
      groups: getGroupsByCategory('barco').length
    },
    {
      id: 'energia_solar',
      label: 'Energia Solar',
      icon: Sun,
      description: 'Sistemas de energia solar',
      groups: getGroupsByCategory('energia_solar').length
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-firme-blue mb-2">
          Escolha sua categoria de consórcio
        </h3>
        <p className="text-gray-600">
          Selecione o tipo de bem que você deseja adquirir
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(({ id, label, icon: Icon, description, groups }) => (
          <Card 
            key={id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedCategory === id 
                ? 'ring-2 ring-firme-blue border-firme-blue' 
                : 'hover:border-firme-blue'
            }`}
            onClick={() => onCategorySelect(id)}
            data-testid={`card-category-${id}`}
          >
            <CardHeader className="text-center pb-2">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                selectedCategory === id ? 'bg-firme-blue text-white' : 'bg-gray-100 text-firme-blue'
              }`}>
                <Icon className="w-8 h-8" />
              </div>
              <CardTitle className="text-lg">{label}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-sm text-gray-500">
                {groups} {groups === 1 ? 'grupo' : 'grupos'} disponível{groups !== 1 ? 'is' : ''}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedCategory && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-medium">
            ✓ Categoria selecionada: {CATEGORY_LABELS[selectedCategory]}
          </p>
        </div>
      )}
    </div>
  );
}