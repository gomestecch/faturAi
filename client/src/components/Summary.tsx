import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SummaryCard from "@/components/SummaryCard";
import SpendingTrend from "@/components/SpendingTrend";
import { Transaction } from "@/types";
import { getRandomTrend } from "@/lib/utils";

interface SummaryProps {
  totalSpending: number;
  transactionCount: number;
  averageTransaction: number;
  maxTransaction: Transaction | null;
  timeFrame: "7D" | "30D" | "90D" | "12M";
  setTimeFrame: (timeFrame: "7D" | "30D" | "90D" | "12M") => void;
  transactions: Transaction[];
}

export default function Summary({
  totalSpending,
  transactionCount,
  averageTransaction,
  maxTransaction,
  timeFrame,
  setTimeFrame,
  transactions
}: SummaryProps) {
  // In a real app, we would calculate actual trends based on previous data
  // Here we'll use random trends for demonstration
  const spendingTrend = getRandomTrend();
  const transactionTrend = getRandomTrend();
  const averageTrend = getRandomTrend();

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium text-foreground mb-4">Resumo Financeiro</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Spending */}
          <SummaryCard 
            title="Total de Gastos" 
            value={totalSpending} 
            valueType="currency"
            trend={spendingTrend.value}
            trendIsPositive={spendingTrend.isPositive}
            trendLabel="vs. mês anterior"
          />
          
          {/* Transaction Count */}
          <SummaryCard 
            title="Número de Transações" 
            value={transactionCount} 
            valueType="number"
            trend={transactionTrend.value}
            trendIsPositive={transactionTrend.isPositive}
            trendLabel="vs. mês anterior"
          />
          
          {/* Average Transaction */}
          <SummaryCard 
            title="Valor Médio" 
            value={averageTransaction} 
            valueType="currency"
            trend={averageTrend.value}
            trendIsPositive={!averageTrend.isPositive} // Lower average is good
            trendLabel="vs. mês anterior"
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium text-foreground">Gastos por Período</h3>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant={timeFrame === "7D" ? "default" : "outline"} 
                onClick={() => setTimeFrame("7D")}
              >
                7D
              </Button>
              <Button 
                size="sm" 
                variant={timeFrame === "30D" ? "default" : "outline"} 
                onClick={() => setTimeFrame("30D")}
              >
                30D
              </Button>
              <Button 
                size="sm" 
                variant={timeFrame === "90D" ? "default" : "outline"} 
                onClick={() => setTimeFrame("90D")}
              >
                90D
              </Button>
              <Button 
                size="sm" 
                variant={timeFrame === "12M" ? "default" : "outline"} 
                onClick={() => setTimeFrame("12M")}
              >
                12M
              </Button>
            </div>
          </div>
          
          <SpendingTrend 
            transactions={transactions} 
            timeFrame={timeFrame} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
