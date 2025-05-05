import { useState, useCallback } from "react";
import Summary from "@/components/Summary";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import TransactionFrequency from "@/components/TransactionFrequency";
import TransactionList from "@/components/TransactionList";
import MerchantTimeline from "@/components/MerchantTimeline";
import { Transaction } from "@/types";

interface DashboardProps {
  transactions: Transaction[];
}

export default function Dashboard({ transactions }: DashboardProps) {
  // Store editable transactions in state so we can modify categories
  const [editableTransactions, setEditableTransactions] = useState<Transaction[]>(transactions);
  
  // Update transactions when props change
  if (transactions !== editableTransactions && transactions.length !== editableTransactions.length) {
    setEditableTransactions(transactions);
  }
  
  // Calculate summary data
  const totalSpending = editableTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  
  const averageTransaction = totalSpending / (editableTransactions.length || 1);
  
  const maxTransaction = editableTransactions.length
    ? editableTransactions.reduce(
        (max, transaction) => 
          transaction.amount > max.amount ? transaction : max,
        editableTransactions[0]
      )
    : null;
  
  // Handler for updating a transaction category
  const handleCategoryUpdate = useCallback((description: string, newCategory: string) => {
    // Update the category for all transactions that match this description
    setEditableTransactions(prevTransactions => {
      return prevTransactions.map(transaction => {
        if (transaction.description === description) {
          return { ...transaction, category: newCategory };
        }
        return transaction;
      });
    });
  }, []);
  
  return (
    <div>
      {/* Summary Section */}
      <Summary 
        totalSpending={totalSpending}
        transactionCount={editableTransactions.length}
        averageTransaction={averageTransaction}
        maxTransaction={maxTransaction}
        transactions={editableTransactions}
      />
      
      {/* Categories and Transactions Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <CategoryBreakdown transactions={editableTransactions} />
        <TransactionFrequency transactions={editableTransactions} className="lg:col-span-2" />
      </div>
      
      {/* Merchant Timeline */}
      <MerchantTimeline transactions={editableTransactions} />
      
      {/* Transaction List */}
      <TransactionList 
        transactions={editableTransactions} 
        onCategoryUpdate={handleCategoryUpdate} 
      />
    </div>
  );
}
