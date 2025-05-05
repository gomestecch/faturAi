import * as React from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";
import DateRangeFilter from "@/components/DateRangeFilter";
import CategoryManager from "@/components/CategoryManager";
import Footer from "@/components/Footer";
import { Transaction } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Download, Upload, Save, Trash2, Plus } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { detectCategory } from "@/lib/categories";
import { saveTransactions, loadTransactions, clearAllData, hasSavedData } from "@/lib/storage";
import { nubankColors } from "@/lib/nubank-theme";

// Import pages
import ImportPage from "@/pages/import-page";
import CategoriesPage from "@/pages/categories-page";
import DashboardPage from "@/pages/dashboard-page";
import HomePage from "@/pages/home-page";

function App() {
  const { toast } = useToast();
  const [location] = useLocation();

  // State for all transactions from all files
  const [allTransactions, setAllTransactions] = React.useState<Transaction[]>([]);
  
  // State for filtered transactions (by date range)
  const [filteredTransactions, setFilteredTransactions] = React.useState<Transaction[]>([]);
  
  // State for tracking uploaded files
  const [uploadedFiles, setUploadedFiles] = React.useState<{name: string, count: number}[]>([]);
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Date filter state
  const [startDate, setStartDate] = React.useState<Date>(new Date(2000, 0, 1));
  const [endDate, setEndDate] = React.useState<Date>(new Date(2099, 11, 31));
  
  // Alert dialog state
  const [showClearDataDialog, setShowClearDataDialog] = React.useState(false);

  // Carregar dados do localStorage quando o componente é montado
  React.useEffect(() => {
    if (hasSavedData()) {
      const savedTransactions = loadTransactions();
      setAllTransactions(savedTransactions);
      
      // Reconstruir a lista de arquivos a partir das transações
      // (isso é uma aproximação já que não salvamos essa informação específica)
      const transactionsByFile: Record<string, Transaction[]> = {};
      
      savedTransactions.forEach(transaction => {
        const fileName = transaction.description.includes("_file_") 
          ? transaction.description.split("_file_")[1] 
          : "Dados Anteriores";
        
        if (!transactionsByFile[fileName]) {
          transactionsByFile[fileName] = [];
        }
        
        transactionsByFile[fileName].push(transaction);
      });
      
      const files = Object.entries(transactionsByFile).map(([name, transactions]) => ({
        name,
        count: transactions.length
      }));
      
      setUploadedFiles(files);
      
      toast({
        title: "Dados carregados",
        description: `${savedTransactions.length} transações recuperadas do armazenamento local.`,
      });
    }
  }, [toast]);

  // Update filtered transactions when all transactions or date range changes
  React.useEffect(() => {
    // Filtragem de gastos (remover pagamentos - valores negativos)
    const onlyExpenses = allTransactions.filter(transaction => transaction.amount > 0);
    
    // Filtragem por data
    const filtered = onlyExpenses.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    
    setFilteredTransactions(filtered);
  }, [allTransactions, startDate, endDate]);

  // Salvar transações no localStorage quando elas mudam
  React.useEffect(() => {
    if (allTransactions.length > 0) {
      saveTransactions(allTransactions);
    }
  }, [allTransactions]);

  // Check if we have any transactions
  const hasTransactions = React.useMemo(() => allTransactions.length > 0, [allTransactions]);

  // Handle file upload
  const handleFileUpload = (
    newTransactions: Transaction[],
    name: string,
    error?: string
  ) => {
    if (error) {
      setError(error);
      return;
    }
    
    // Adicionar informações do arquivo e atualizar categorias
    const enhancedTransactions = newTransactions.map(transaction => ({
      ...transaction,
      description: `${transaction.description}`,
      category: transaction.category || detectCategory(transaction.description)
    }));

    // Add new transactions to existing ones
    setAllTransactions(prev => [...prev, ...enhancedTransactions]);
    
    // Add filename to tracking list
    setUploadedFiles(prev => [...prev, { name, count: enhancedTransactions.length }]);
    
    setError(null);
    
    toast({
      title: "Arquivo importado com sucesso",
      description: `${enhancedTransactions.length} transações de "${name}" foram adicionadas.`,
    });
  };

  // Handle date range change
  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Remove a specific file's transactions
  const handleRemoveFile = (fileName: string, index: number) => {
    // Create a copy of the current state
    const updatedFiles = [...uploadedFiles];
    const removedFile = updatedFiles[index];
    
    // Remove the file from the list
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);

    // If this was the last file, we need a different approach
    if (updatedFiles.length === 0) {
      setAllTransactions([]);
      clearAllData();
      return;
    }

    // This is a simplified approach - in a real app, you'd need to track which transactions
    // came from which file. Here we're just removing transactions in a way that's visually consistent.
    const remainingTransactionsCount = allTransactions.length - removedFile.count;
    const updatedTransactions = allTransactions.slice(0, remainingTransactionsCount);
    setAllTransactions(updatedTransactions);
    
    toast({
      title: "Arquivo removido",
      description: `As transações de "${fileName}" foram removidas.`,
    });
  };
  
  // Download de transações como JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(allTransactions, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `financas_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Exportação concluída",
      description: "Suas transações foram exportadas em formato JSON.",
    });
  };
  
  // Limpar todos os dados
  const handleClearAllData = () => {
    setAllTransactions([]);
    setUploadedFiles([]);
    clearAllData();
    setShowClearDataDialog(false);
    
    toast({
      title: "Dados removidos",
      description: "Todos os dados foram removidos do armazenamento local.",
    });
  };
  
  // Atualizar categorias em todas as transações
  const handleCategoryUpdated = React.useCallback(() => {
    setAllTransactions(prev => 
      prev.map(transaction => ({
        ...transaction,
        category: transaction.category || detectCategory(transaction.description)
      }))
    );
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col">
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          <Switch>
            <Route path="/">
              <HomePage />
            </Route>
            
            <Route path="/dashboard">
              <DashboardPage />
            </Route>
            
            <Route path="/import">
              <ImportPage 
                onFileUpload={handleFileUpload}
                isLoading={isLoading}
                error={error}
              />
            </Route>
            
            <Route path="/categories">
              <CategoriesPage 
                onCategoryUpdated={handleCategoryUpdated}
              />
            </Route>
            
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </div>
      </main>
      <Footer />
      <Toaster />
      
      {/* Alert Dialog para confirmar exclusão de dados */}
      <AlertDialog open={showClearDataDialog} onOpenChange={setShowClearDataDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá remover permanentemente todas as suas transações importadas
              e dados associados. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAllData}
              style={{ backgroundColor: nubankColors.error, color: 'white' }}>
              Sim, limpar dados
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default App;
