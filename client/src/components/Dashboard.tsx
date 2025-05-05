import { useState } from "react";
import Summary from "@/components/Summary";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import TransactionFrequency from "@/components/TransactionFrequency";
import TransactionList from "@/components/TransactionList";
import { Transaction } from "@/types";

interface DashboardProps {
  transactions: Transaction[];
}

export default function Dashboard({ transactions }: DashboardProps) {
  const [timeFrame, setTimeFrame] = useState<"7D" | "30D" | "90D" | "12M">("7D");
  
  // Calculate summary data
  const totalSpending = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  
  const averageTransaction = totalSpending / (transactions.length || 1);
  
  const maxTransaction = transactions.length
    ? transactions.reduce(
        (max, transaction) => 
          transaction.amount > max.amount ? transaction : max,
        transactions[0]
      )
    : null;
  
  return (
    <div>
      {/* Summary Section */}
      <Summary 
        totalSpending={totalSpending}
        transactionCount={transactions.length}
        averageTransaction={averageTransaction}
        maxTransaction={maxTransaction}
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
        transactions={transactions}
      />
      
      {/* Categories and Transactions Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <CategoryBreakdown transactions={transactions} />
        <TransactionFrequency transactions={transactions} className="lg:col-span-2" />
      </div>
      
      {/* Transaction List */}
      <TransactionList transactions={transactions} />
    </div>
  );
}
