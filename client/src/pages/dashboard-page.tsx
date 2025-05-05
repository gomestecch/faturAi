import { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import DateRangeFilter from '@/components/DateRangeFilter';
import { Transaction } from '@/types';
import { nubankColors } from '@/lib/nubank-theme';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  
  // Data filtro
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), 0, 1) // Primeiro dia do ano atual
  );
  const [endDate, setEndDate] = useState<Date>(new Date()); // Hoje
  
  // Buscar transações do banco de dados
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/transactions');
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar transações: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Converter as transações para o formato correto
        const formattedTransactions = data.map((transaction: any) => ({
          id: transaction.id,
          date: new Date(transaction.date),
          description: transaction.description,
          amount: transaction.amount,
          category: transaction.category
        }));
        
        setTransactions(formattedTransactions);
        
        if (formattedTransactions.length === 0) {
          toast({
            title: 'Nenhuma transação encontrada',
            description: 'Importe algumas transações para começar a análise.',
          });
        }
      } catch (err) {
        console.error('Erro ao buscar transações:', err);
        setError('Não foi possível carregar as transações. Tente novamente mais tarde.');
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as transações.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [toast]);
  
  // Filtrar transações quando a data mudar
  useEffect(() => {
    if (transactions.length === 0) {
      setFilteredTransactions([]);
      return;
    }
    
    // Filtrar apenas despesas por data
    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction.amount > 0 && // Apenas despesas
        transactionDate >= startDate && 
        transactionDate <= endDate
      );
    });
    
    setFilteredTransactions(filtered);
  }, [transactions, startDate, endDate]);
  
  // Manipulador de alteração do intervalo de datas
  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6" style={{ color: nubankColors.primary }}>
        Dashboard FaturAi
      </h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
          />
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: nubankColors.primary }} />
          <span className="ml-2 text-lg">Carregando transações...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-8">
          <p>Nenhuma transação encontrada para o período selecionado.</p>
        </div>
      ) : (
        <Dashboard transactions={filteredTransactions} />
      )}
    </div>
  );
} 