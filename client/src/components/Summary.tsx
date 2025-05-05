import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import SummaryCard from "@/components/SummaryCard";
import SpendingTrend from "@/components/SpendingTrend";
import { Transaction } from "@/types";
import { getRandomTrend } from "@/lib/utils";

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

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Resumo Financeiro</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Spending */}
          <SummaryCard 
            title="Total de Gastos" 
            value={outgoingTotal} 
            valueType="currency"
            trend={spendingTrend.value}
            trendIsPositive={!spendingTrend.isPositive} // Lower spending is good
            trendLabel="vs. período anterior"
          />
          
          {/* Total Income */}
          <SummaryCard 
            title="Total Recebido" 
            value={incomingTotal} 
            valueType="currency"
            trend={spendingTrend.value}
            trendIsPositive={spendingTrend.isPositive} // Higher income is good
            trendLabel="vs. período anterior"
          />
          
          {/* Transaction Count */}
          <SummaryCard 
            title="Número de Transações" 
            value={transactionCount} 
            valueType="number"
            trend={transactionTrend.value}
            trendIsPositive={transactionTrend.isPositive}
            trendLabel="vs. período anterior"
          />
          
          {/* Max Transaction */}
          <SummaryCard 
            title="Maior Gasto" 
            value={maxTransaction?.amount || 0}
            valueType="currency"
            subtitle={maxTransaction?.description || "Nenhuma transação registrada"}
          />
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
