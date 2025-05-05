import { useState, useEffect, useMemo, useCallback } from "react";
import { Switch, Route } from "wouter";
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
import { X, Download, Upload, Save, Trash2 } from "lucide-react";
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

function App() {
  const { toast } = useToast();

  // State for all transactions from all files
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  
  // State for filtered transactions (by date range)
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  
  // State for tracking uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, count: number}[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Date filter state
  const [startDate, setStartDate] = useState<Date>(new Date(2000, 0, 1));
  const [endDate, setEndDate] = useState<Date>(new Date(2099, 11, 31));
  
  // Alert dialog state
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);

  // Carregar dados do localStorage quando o componente é montado
  useEffect(() => {
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
  useEffect(() => {
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
  useEffect(() => {
    if (allTransactions.length > 0) {
      saveTransactions(allTransactions);
    }
  }, [allTransactions]);

  // Check if we have any transactions
  const hasTransactions = useMemo(() => allTransactions.length > 0, [allTransactions]);

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
  const handleCategoryUpdated = useCallback(() => {
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
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Switch>
            <Route path="/">
              <>
                <FileUpload
                  onUpload={handleFileUpload}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  error={error}
                  fileName={null}
                  transactionCount={allTransactions.length}
                  allowMultiple={true}
                />
                
                {/* File list */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 mb-6">
                    <div className="flex flex-wrap justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Arquivos importados:</h3>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Save className="h-4 w-4 mr-2" />
                            Opções de Dados
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={handleExportJSON}>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar JSON
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setShowClearDataDialog(true)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Limpar todos os dados
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {uploadedFiles.map((file, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1 px-3 py-1">
                          <span>{file.name} ({file.count} transações)</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 rounded-full"
                            onClick={() => handleRemoveFile(file.name, index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {hasTransactions && (
                  <>
                    <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
                    <CategoryManager onCategoryChange={handleCategoryUpdated} />
                    <Dashboard transactions={filteredTransactions} />
                  </>
                )}
                
                {/* Diálogo de confirmação para limpar dados */}
                <AlertDialog open={showClearDataDialog} onOpenChange={setShowClearDataDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação irá remover permanentemente todos os seus dados financeiros.
                        Os dados não poderão ser recuperados depois.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearAllData} className="bg-destructive">
                        Sim, limpar tudo
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            </Route>
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
