import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConsortiumCategory, ConsortiumGroup, getGroupsByCategory } from '@shared/consortiumTypes';

interface ConsortiumGroupSelectorProps {
  category: ConsortiumCategory;
  onGroupSelect: (group: ConsortiumGroup) => void;
  selectedGroup?: ConsortiumGroup;
}

export default function ConsortiumGroupSelector({ 
  category, 
  onGroupSelect, 
  selectedGroup 
}: ConsortiumGroupSelectorProps) {
  const groups = getGroupsByCategory(category);

  if (groups.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum grupo disponível para esta categoria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-firme-blue mb-2">
          Escolha o grupo de consórcio
        </h3>
        <p className="text-gray-600">
          Selecione o grupo que melhor se adequa às suas necessidades
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => (
          <Card 
            key={group.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedGroup?.id === group.id 
                ? 'ring-2 ring-firme-blue border-firme-blue' 
                : 'hover:border-firme-blue'
            }`}
            onClick={() => onGroupSelect(group)}
            data-testid={`card-group-${group.id}`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription className="mt-1">
                    Até {group.maxDuration} meses
                  </CardDescription>
                </div>
                {selectedGroup?.id === group.id && (
                  <Badge variant="default" className="bg-firme-blue">
                    Selecionado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="font-medium text-gray-700">Taxa Admin</div>
                  <div className="text-firme-blue font-bold">{group.adminTax}%</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="font-medium text-gray-700">Fundo Reserva</div>
                  <div className="text-firme-blue font-bold">{group.fundReserve}%</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="font-medium text-gray-700">Lance Mín.</div>
                  <div className="text-firme-blue font-bold">{group.minBid}%</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="font-medium text-gray-700">Lance Máx.</div>
                  <div className="text-firme-blue font-bold">{group.maxBid}%</div>
                </div>
              </div>
              
              <div className="text-xs text-gray-600">
                <div className="mb-1">
                  <strong>Participantes:</strong> {group.participants.toLocaleString()}
                </div>
                <div className="mb-1">
                  <strong>Reajuste:</strong> {group.reajustType} anual
                </div>
                <div>
                  <strong>Seguro:</strong> {group.insuranceRate}% ao mês
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedGroup && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="mb-2">
            <p className="text-blue-800 font-medium">
              ✓ Grupo selecionado: {selectedGroup.name}
            </p>
          </div>
          <div className="text-sm text-blue-700">
            <p><strong>Regras:</strong> {selectedGroup.priceTableRules}</p>
            <p><strong>Contemplações:</strong> {selectedGroup.contemplations}</p>
          </div>
        </div>
      )}
    </div>
  );
}