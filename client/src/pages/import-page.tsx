import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import { Transaction } from "@/types";
import { ArrowLeft } from "lucide-react";
import { saveTransactions } from "@/lib/storage";
import { nubankColors } from "@/lib/nubank-theme";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { SaveIcon, ArrowRightIcon } from "lucide-react";
import { detectCategory } from "@/lib/categories";

interface ImportPageProps {
  onFileUpload?: (transactions: Transaction[], fileName: string, error?: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function ImportPage({ 
  onFileUpload,
  isLoading: propIsLoading,
  error: propError 
}: ImportPageProps) {
  const { toast } = useToast();
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importedTransactions, setImportedTransactions] = useState<Transaction[]>([]);
  const [saved, setSaved] = useState(false);

  // Usar o loading e error das props se fornecidos, caso contrário, usar os do estado local
  const isLoading = propIsLoading !== undefined ? propIsLoading : localIsLoading;
  const error = propError !== undefined ? propError : localError;

  const handleFileUpload = async (
    newTransactions: Transaction[], 
    name: string, 
    uploadError?: string
  ) => {
    if (uploadError) {
      setLocalError(uploadError);
      return;
    }

    // Atualizar categorias
    const enhancedTransactions = newTransactions.map(transaction => ({
      ...transaction,
      category: transaction.category || detectCategory(transaction.description)
    }));
    
    setFileName(name);
    setImportedTransactions(enhancedTransactions);
    setLocalError(null);
    setSaved(false);
    
    toast({
      title: "Arquivo processado com sucesso",
      description: `${enhancedTransactions.length} transações de "${name}" foram processadas. Clique em "Salvar no Banco de Dados" para armazená-las.`,
    });
    
    // Se onFileUpload foi fornecido como prop, chamar também
    if (onFileUpload) {
      onFileUpload(enhancedTransactions, name);
    }
  };
  
  const handleSaveToDatabase = async () => {
    if (importedTransactions.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhuma transação para salvar. Importe um arquivo primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    setLocalIsLoading(true);
    
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(importedTransactions),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao salvar transações: ${response.status}`);
      }
      
      setSaved(true);
      
      toast({
        title: "Transações salvas",
        description: `${importedTransactions.length} transações foram salvas no banco de dados.`,
      });
    } catch (err) {
      console.error("Erro ao salvar transações:", err);
      setLocalError("Não foi possível salvar as transações. Tente novamente mais tarde.");
      
      toast({
        title: "Erro",
        description: "Não foi possível salvar as transações no banco de dados.",
        variant: "destructive"
      });
    } finally {
      setLocalIsLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: nubankColors.primary }}>Importar Faturas</h1>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: nubankColors.primary }}>Upload de Arquivo CSV</h2>
            <p className="mb-6" style={{ color: nubankColors.textTertiary }}>
              Faça upload das suas faturas do Nubank em formato CSV. 
              É possível selecionar múltiplos arquivos de uma vez.
            </p>
            
            <FileUpload
              onUpload={handleFileUpload}
              isLoading={isLoading}
              setIsLoading={setLocalIsLoading}
              error={error}
              fileName={fileName}
              transactionCount={importedTransactions.length}
              allowMultiple={true}
            />
            
            {importedTransactions.length > 0 && !error && (
              <Card className="mt-6 border-border/40 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: nubankColors.primary }}>
                        {importedTransactions.length} transações processadas
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Arquivo: {fileName}
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      {!saved ? (
                        <Button 
                          onClick={handleSaveToDatabase} 
                          disabled={isLoading || saved}
                          style={{ backgroundColor: nubankColors.primary, color: 'white' }}
                        >
                          <SaveIcon className="h-4 w-4 mr-2" />
                          Salvar no Banco de Dados
                        </Button>
                      ) : (
                        <Link href="/dashboard">
                          <Button style={{ backgroundColor: nubankColors.secondary, color: 'white' }}>
                            Ver no Dashboard
                            <ArrowRightIcon className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  {saved && (
                    <div className="p-3 rounded-md" style={{ backgroundColor: nubankColors.success + '20' }}>
                      <p className="text-sm" style={{ color: nubankColors.success }}>
                        Transações salvas com sucesso! Agora você pode visualizá-las no Dashboard.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-3" style={{ color: nubankColors.primary }}>Como exportar seu extrato do Nubank</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Acesse o app ou site do Nubank</li>
              <li>Navegue até a seção "Faturas"</li>
              <li>Selecione a fatura que deseja exportar</li>
              <li>Toque em "Exportar" ou no ícone de download</li>
              <li>Selecione o formato CSV</li>
              <li>Faça upload do arquivo baixado aqui</li>
            </ol>
            <p className="mt-4 text-sm" style={{ color: nubankColors.textTertiary }}>
              Você pode combinar múltiplas faturas para uma análise mais completa ao longo do tempo.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}