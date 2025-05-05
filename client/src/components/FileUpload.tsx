import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { parseCsvFile } from "@/lib/csv-parser";
import { Transaction } from "@/types";

interface FileUploadProps {
  onUpload: (transactions: Transaction[], fileName: string, error?: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  fileName: string | null;
  transactionCount: number;
}

export default function FileUpload({
  onUpload,
  isLoading,
  setIsLoading,
  error,
  fileName,
  transactionCount
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        throw new Error('O arquivo deve estar no formato CSV');
      }
      
      const transactions = await parseCsvFile(file);
      onUpload(transactions, file.name);
    } catch (err) {
      onUpload([], file.name, (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
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
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium text-foreground mb-4">Upload de Arquivo CSV</h2>
        <p className="text-muted-foreground mb-4">
          Carregue sua fatura de cartão de crédito em formato CSV para análise. Seus dados são processados
          localmente e não são enviados para servidores.
        </p>
        
        <div 
          className={`drop-zone p-8 text-center mb-4 ${isDragActive ? 'active' : ''}`}
          onDragOver={(e) => { preventDefault(e); setIsDragActive(true); }}
          onDragEnter={(e) => { preventDefault(e); setIsDragActive(true); }}
          onDragLeave={(e) => { preventDefault(e); setIsDragActive(false); }}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className="mx-auto h-10 w-10 text-primary mb-2" />
          <p className="mb-2 font-medium">Arraste seu arquivo CSV ou</p>
          <Button variant="default" className="bg-primary hover:bg-primary/90">
            Selecionar Arquivo
          </Button>
          <input
            type="file"
            id="file-input"
            ref={fileInputRef}
            onChange={handleChange}
            accept=".csv"
            className="hidden"
            disabled={isLoading}
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Suporte para formatos padrão de grandes emissores de cartão
          </p>
        </div>
        
        {/* Success state */}
        {fileName && !error && (
          <div className="bg-success/10 border border-success rounded-md p-4 flex items-start mb-4">
            <CheckCircle className="text-success mr-3 mt-0.5 h-5 w-5" />
            <div>
              <h3 className="font-medium text-success">Arquivo carregado com sucesso!</h3>
              <p className="text-sm text-foreground">{fileName}</p>
              <p className="text-sm text-foreground">{transactionCount} transações encontradas</p>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
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
