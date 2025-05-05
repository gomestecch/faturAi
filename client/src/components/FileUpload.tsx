import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, CheckCircle, AlertCircle, FilePlus } from "lucide-react";
import { parseCsvFile } from "@/lib/csv-parser";
import { Transaction } from "@/types";

interface FileUploadProps {
  onUpload: (transactions: Transaction[], fileName: string, error?: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  fileName: string | null;
  transactionCount: number;
  allowMultiple?: boolean;
}

export default function FileUpload({
  onUpload,
  isLoading,
  setIsLoading,
  error,
  fileName,
  transactionCount,
  allowMultiple = false
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [processingFiles, setProcessingFiles] = useState(0);
  const [processedFiles, setProcessedFiles] = useState(0);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    try {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        throw new Error('O arquivo deve estar no formato CSV');
      }
      
      const transactions = await parseCsvFile(file);
      onUpload(transactions, file.name);
      setProcessedFiles(prev => prev + 1);
    } catch (err) {
      onUpload([], file.name, (err as Error).message);
      setProcessedFiles(prev => prev + 1);
    }
  };

  const handleFilesUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    setProcessingFiles(files.length);
    setProcessedFiles(0);
    
    try {
      // Process files one by one to avoid overwhelming the browser
      for (let i = 0; i < files.length; i++) {
        await handleFileUpload(files[i]);
      }
    } finally {
      setIsLoading(false);
      setProcessingFiles(0);
      setProcessedFiles(0);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesUpload(e.target.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const preventDefault = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Card className="mb-6 border-border/40 shadow-sm overflow-hidden">
      <div className="flex items-center p-6 bg-gradient-to-r from-primary/10 to-background border-b">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Importe suas faturas</h2>
          <p className="text-muted-foreground">
            Carregue seus extratos do Nubank para análise detalhada de gastos
          </p>
        </div>
      </div>
      
      <CardContent className="pt-6">
        <div className="mb-6 text-sm text-muted-foreground">
          <p>
            Seus dados são processados localmente e não são enviados para servidores. 
            Suas informações financeiras ficam apenas no seu navegador.
          </p>
        </div>
        
        <div 
          className={`border-2 border-dashed ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'} 
            rounded-lg p-8 text-center mb-6 cursor-pointer transition-colors hover:border-primary/50 hover:bg-primary/5`}
          onDragOver={(e) => { preventDefault(e); setIsDragActive(true); }}
          onDragEnter={(e) => { preventDefault(e); setIsDragActive(true); }}
          onDragLeave={(e) => { preventDefault(e); setIsDragActive(false); }}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className="mx-auto h-12 w-12 text-primary mb-4" />
          <p className="mb-4 font-medium text-lg">
            {allowMultiple 
              ? "Arraste seus arquivos CSV ou selecione múltiplos arquivos" 
              : "Arraste seu arquivo CSV ou"
            }
          </p>
          <Button variant="default" className="bg-primary hover:bg-primary/90 px-6 text-md font-medium">
            {allowMultiple ? "Selecionar Arquivos" : "Selecionar Arquivo"}
          </Button>
          <input
            type="file"
            id="file-input"
            ref={fileInputRef}
            onChange={handleChange}
            accept=".csv"
            className="hidden"
            disabled={isLoading}
            multiple={allowMultiple}
          />
          <p className="mt-4 text-sm text-muted-foreground">
            Compatível com arquivos CSV da Nubank, Itaú, Bradesco, Banco do Brasil e outros
          </p>
        </div>
        
        {/* Instruções para baixar fatura do Nubank */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            Como baixar sua fatura do Nubank
          </h3>
          <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1">
            <li>Abra o aplicativo do Nubank</li>
            <li>Acesse a área de cartão de crédito</li>
            <li>Toque em "Faturas"</li>
            <li>Selecione a fatura que deseja analisar</li>
            <li>Pressione o botão "Exportar fatura" ou ícone de download</li>
            <li>Selecione formato CSV</li>
          </ol>
        </div>
        
        {/* Processing state */}
        {isLoading && (
          <div className="bg-primary/10 border border-primary rounded-md p-4 flex items-start mb-4">
            <FilePlus className="text-primary mr-3 mt-0.5 h-5 w-5" />
            <div>
              <h3 className="font-medium text-primary">Processando arquivos...</h3>
              <p className="text-sm text-foreground">
                {processedFiles} de {processingFiles} arquivos processados
              </p>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-destructive/10 border border-destructive rounded-md p-4 flex items-start mb-4">
            <AlertCircle className="text-destructive mr-3 mt-0.5 h-5 w-5" />
            <div>
              <h3 className="font-medium text-destructive">Erro ao carregar arquivo</h3>
              <p className="text-sm text-foreground">{error}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
