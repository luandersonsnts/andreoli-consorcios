import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ConsortiumData {
  type: 'automovel' | 'imovel' | 'motocicleta' | 'pesados';
  value: number;
  duration: number;
  monthlyPayment: number;
  adminFee: number;
  totalAmount: number;
}

interface ConsortiumContextType {
  consortiumData: ConsortiumData | null;
  setConsortiumData: (data: ConsortiumData | null) => void;
  calculateConsortium: (type: string, value: number, duration: number) => ConsortiumData;
  isSimulationOpen: boolean;
  setIsSimulationOpen: (open: boolean) => void;
}

const ConsortiumContext = createContext<ConsortiumContextType | undefined>(undefined);

export const useConsortium = () => {
  const context = useContext(ConsortiumContext);
  if (context === undefined) {
    throw new Error('useConsortium must be used within a ConsortiumProvider');
  }
  return context;
};

interface ConsortiumProviderProps {
  children: ReactNode;
}

export const ConsortiumProvider: React.FC<ConsortiumProviderProps> = ({ children }) => {
  const [consortiumData, setConsortiumData] = useState<ConsortiumData | null>(null);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);

  const calculateConsortium = (type: string, value: number, duration: number): ConsortiumData => {
    // Taxas de administração por tipo de consórcio (em %)
    const adminRates = {
      automovel: 0.25,     // 0.25% ao mês
      imovel: 0.30,        // 0.30% ao mês
      motocicleta: 0.28,   // 0.28% ao mês
      pesados: 0.32        // 0.32% ao mês
    };

    const adminRate = adminRates[type as keyof typeof adminRates] || 0.25;
    const adminFeeMonthly = value * (adminRate / 100);
    const monthlyPayment = (value / duration) + adminFeeMonthly;
    const totalAmount = monthlyPayment * duration;
    const totalAdminFee = adminFeeMonthly * duration;

    return {
      type: type as ConsortiumData['type'],
      value,
      duration,
      monthlyPayment,
      adminFee: totalAdminFee,
      totalAmount
    };
  };

  const value = {
    consortiumData,
    setConsortiumData,
    calculateConsortium,
    isSimulationOpen,
    setIsSimulationOpen
  };

  return (
    <ConsortiumContext.Provider value={value}>
      {children}
    </ConsortiumContext.Provider>
  );
};

export default ConsortiumContext;