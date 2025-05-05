import { useState } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";
import { Transaction } from "@/types";

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (
    newTransactions: Transaction[],
    name: string,
    error?: string
  ) => {
    if (error) {
      setError(error);
      setFileUploaded(false);
      return;
    }

    setTransactions(newTransactions);
    setFileUploaded(true);
    setFileName(name);
    setError(null);
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
                  fileName={fileName}
                  transactionCount={transactions.length}
                />
                {fileUploaded && (
                  <Dashboard transactions={transactions} />
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
