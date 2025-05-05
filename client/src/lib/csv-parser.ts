import Papa from "papaparse";
import { Transaction } from "@/types";
import { detectCategory } from "./categories";

interface RawCsvRow {
  [key: string]: string;
}

function mapHeaderToField(header: string): string | null {
  // Mapeamento para formato Nubank
  if (header.includes("data") || header.includes("date")) return "date";
  if (header.includes("título") || header.includes("title") || header.includes("description")) return "description";
  if (header.includes("valor") || header.includes("amount")) return "amount";
  if (header.includes("categoria") || header.includes("category")) return "category";
  
  // Outros bancos podem usar nomes diferentes
  // Exemplos para outros bancos comuns no Brasil
  if (header.includes("lançamento") || header.includes("transação")) return "description";
  if (header.includes("histórico") || header.includes("estabelecimento")) return "description";
  
  return null;
}

function parseDate(dateString: string): Date {
  // Tenta formatos comuns no Brasil
  try {
    // Formato DD/MM/YYYY ou DD-MM-YYYY
    if (dateString.includes("/") || dateString.includes("-")) {
      const parts = dateString.split(/[-\/]/);
      if (parts.length === 3) {
        // Assume formato brasileiro (DD/MM/YYYY)
        if (parts[0].length <= 2 && parts[1].length <= 2) {
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        // Formato americano (YYYY-MM-DD)
        else if (parts[0].length === 4) {
          return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }
      }
    }
    
    // Tenta com Date.parse como fallback
    const timestamp = Date.parse(dateString);
    if (!isNaN(timestamp)) {
      return new Date(timestamp);
    }
    
    // Valor padrão para datas que não podem ser parseadas
    return new Date();
  } catch (error) {
    console.error("Erro ao parsear data:", dateString, error);
    return new Date();
  }
}

function parseAmount(amountString: string): number {
  try {
    // Verifica se o valor já está no formato do CSV americano (43.98)
    if (/^-?\d+\.\d+$/.test(amountString)) {
      return parseFloat(amountString);
    }
    
    // Se estiver no formato brasileiro, converte (R$ 43,98)
    const cleanedValue = amountString
      .replace(/[R$\s]/g, "")     // Remove R$ e espaços
      .replace(/\./g, "")         // Remove pontos de milhar
      .replace(",", ".");         // Substitui vírgula decimal por ponto
    
    // Converte para número
    const amount = parseFloat(cleanedValue);
    
    // Verifica se o valor é válido
    if (isNaN(amount)) {
      console.warn("Valor não numérico:", amountString);
      return 0;
    }
    
    return amount;
  } catch (error) {
    console.error("Erro ao parsear valor:", amountString, error);
    return 0;
  }
}

export async function parseCsvFile(file: File): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data as RawCsvRow[];
          
          if (rows.length === 0) {
            reject("O arquivo CSV está vazio ou não contém dados válidos.");
            return;
          }
          
          // Detecta os campos no cabeçalho
          const firstRow = rows[0];
          const headers = Object.keys(firstRow);
          
          const fieldMap: Record<string, string> = {};
          
          // Mapeia os cabeçalhos para os campos internos
          for (const header of headers) {
            const field = mapHeaderToField(header.toLowerCase());
            if (field) {
              fieldMap[header] = field;
            }
          }
          
          // Verifica se os campos obrigatórios estão presentes
          const requiredFields = ["date", "description", "amount"];
          const mappedFields = Object.values(fieldMap);
          const missingFields = requiredFields.filter(field => !mappedFields.includes(field));
          
          if (missingFields.length > 0) {
            reject(`O arquivo CSV não contém os campos obrigatórios: ${missingFields.join(", ")}`);
            return;
          }
          
          // Converte as linhas para o formato de transação
          const transactions: Transaction[] = rows.map(row => {
            const transaction: Partial<Transaction> = {};
            
            // Mapeia cada campo da linha para o modelo de dados
            for (const [header, value] of Object.entries(row)) {
              const field = fieldMap[header];
              if (!field) continue;
              
              if (field === "date") {
                transaction.date = parseDate(value);
              } else if (field === "description") {
                transaction.description = value.trim();
              } else if (field === "amount") {
                transaction.amount = parseAmount(value);
              } else if (field === "category") {
                transaction.category = value.trim();
              }
            }
            
            // Detecta a categoria automaticamente se não estiver presente
            if (!transaction.category && transaction.description) {
              transaction.category = detectCategory(transaction.description);
            }
            
            return transaction as Transaction;
          });
          
          resolve(transactions);
        } catch (error) {
          console.error("Erro ao processar arquivo CSV:", error);
          reject("Ocorreu um erro ao processar o arquivo CSV. Verifique se o formato está correto.");
        }
      },
      error: (error) => {
        console.error("Erro ao parsear CSV:", error);
        reject(`Erro ao parsear CSV: ${error.message}`);
      }
    });
  });
}