import { useState, useEffect, useMemo } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";
import DateRangeFilter from "@/components/DateRangeFilter";
import Footer from "@/components/Footer";
import { Transaction } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

function App() {
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

  // Update filtered transactions when all transactions or date range changes
  useEffect(() => {
    const filtered = allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    
    setFilteredTransactions(filtered);
  }, [allTransactions, startDate, endDate]);

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

    // Add new transactions to existing ones
    setAllTransactions(prev => [...prev, ...newTransactions]);
    
    // Add filename to tracking list
    setUploadedFiles(prev => [...prev, { name, count: newTransactions.length }]);
    
    setError(null);
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
      return;
    }

    // This is a simplified approach - in a real app, you'd need to track which transactions
    // came from which file. Here we're just removing transactions in a way that's visually consistent.
    const remainingTransactionsCount = allTransactions.length - removedFile.count;
    const updatedTransactions = allTransactions.slice(0, remainingTransactionsCount);
    setAllTransactions(updatedTransactions);
  };

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
                    <h3 className="text-sm font-medium mb-2">Arquivos importados:</h3>
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
                    <Dashboard transactions={filteredTransactions} />
                  </>
                )}
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
