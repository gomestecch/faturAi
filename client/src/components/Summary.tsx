import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import SummaryCard from "@/components/SummaryCard";
import SpendingTrend from "@/components/SpendingTrend";
import { Transaction } from "@/types";
import { getRandomTrend } from "@/lib/utils";
import { nubankColors } from "@/lib/nubank-theme";

interface SummaryProps {
  totalSpending: number;
  transactionCount: number;
  averageTransaction: number;
  maxTransaction: Transaction | null;
  transactions: Transaction[];
}

export default function Summary({
  totalSpending,
  transactionCount,
  averageTransaction,
  maxTransaction,
  transactions
}: SummaryProps) {
  const [timeFrame, setTimeFrame] = useState<"7D" | "30D" | "90D" | "12M">("30D");
  
  // In a real app, we would calculate actual trends based on previous data
  // Here we'll use random trends for demonstration
  const spendingTrend = getRandomTrend();
  const transactionTrend = getRandomTrend();
  const averageTrend = getRandomTrend();

  // Calculate incoming and outgoing totals
  const incomingTotal = transactions
    .filter(t => t.amount < 0) // Negative amounts represent incoming money
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const outgoingTotal = transactions
    .filter(t => t.amount > 0) // Positive amounts represent outgoing money
    .reduce((sum, t) => sum + t.amount, 0);

  // Estilo do botão de filtro de período ativo
  const activeButtonStyle = {
    backgroundColor: nubankColors.primary,
    color: nubankColors.textPrimary,
    fontWeight: 'bold',
    borderRadius: '4px'
  };

  // Estilo do botão de filtro de período inativo
  const inactiveButtonStyle = {
    backgroundColor: 'transparent',
    color: nubankColors.textSecondary,
    border: `1px solid ${nubankColors.primary}`,
    borderRadius: '4px'
  };

  return (
    <Card className="mb-6 border-t-4" style={{ borderTopColor: nubankColors.primary }}>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-6" style={{ color: nubankColors.primary }}>Resumo Financeiro</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Spending */}
          <SummaryCard 
            title="Total de Gastos" 
            value={outgoingTotal} 
            valueType="currency"
            trend={spendingTrend.value}
            trendIsPositive={!spendingTrend.isPositive} // Lower spending is good
            trendLabel="vs. período anterior"
            accentColor={nubankColors.primary}
          />
          
          {/* Total Income */}
          <SummaryCard 
            title="Total Recebido" 
            value={incomingTotal} 
            valueType="currency"
            trend={spendingTrend.value}
            trendIsPositive={spendingTrend.isPositive} // Higher income is good
            trendLabel="vs. período anterior"
            accentColor={nubankColors.success}
          />
          
          {/* Transaction Count */}
          <SummaryCard 
            title="Número de Transações" 
            value={transactionCount} 
            valueType="number"
            trend={transactionTrend.value}
            trendIsPositive={transactionTrend.isPositive}
            trendLabel="vs. período anterior"
            accentColor={nubankColors.secondary}
          />
          
          {/* Max Transaction */}
          <SummaryCard 
            title="Maior Gasto" 
            value={maxTransaction?.amount || 0}
            valueType="currency"
            subtitle={maxTransaction?.description || "Nenhuma transação registrada"}
            accentColor={nubankColors.warning}
          />
        </div>
        
        {/* Time frame selection */}
        <div className="flex justify-end gap-2 mb-4">
          {(['7D', '30D', '90D', '12M'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeFrame(period)}
              className="px-3 py-1 text-sm transition-colors duration-200"
              style={timeFrame === period ? activeButtonStyle : inactiveButtonStyle}
            >
              {period}
            </button>
          ))}
        </div>
        
        {/* Spending Trend Chart */}
        <div>
          <SpendingTrend 
            transactions={transactions} 
            timeFrame={timeFrame} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
