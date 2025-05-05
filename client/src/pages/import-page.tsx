import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import { Transaction } from "@/types";
import { ArrowLeft } from "lucide-react";
import { saveTransactions } from "@/lib/storage";
import { nubankColors } from "@/lib/nubank-theme";

export default function ImportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = (newTransactions: Transaction[], fileName: string, error?: string) => {
    setTransactions(newTransactions);
    setFileName(fileName);
    if (error) {
      setError(error);
    } else {
      setError(null);
      // Salvar transações no armazenamento local
      saveTransactions(newTransactions);
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
              onUpload={handleUpload}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              error={error}
              fileName={fileName}
              transactionCount={transactions.length}
              allowMultiple={true}
            />
            
            {transactions.length > 0 && !error && (
              <div className="mt-6 text-center">
                <p className="font-medium mb-4" style={{ color: nubankColors.success }}>
                  {transactions.length} transações importadas com sucesso!
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <Link href="/">
                    <Button style={{ backgroundColor: nubankColors.primary, color: 'white' }}>
                      Ver Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
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