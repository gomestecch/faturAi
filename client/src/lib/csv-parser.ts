import Papa from 'papaparse';
import { Transaction } from '@/types';
import { detectCategory } from './category-detector';

interface RawCsvRow {
  [key: string]: string;
}

// Common CSV column patterns from major credit card issuers
const DATE_PATTERNS = [
  'data', 'date', 'dt', 'data transação', 'data da transação', 'data da compra', 
  'data-transação', 'date of transaction'
];

const DESCRIPTION_PATTERNS = [
  'descrição', 'descricao', 'estabelecimento', 'histórico', 'historico', 'lançamento',
  'description', 'merchant', 'establishment', 'desc'
];

const AMOUNT_PATTERNS = [
  'valor', 'value', 'amount', 'preço', 'preco', 'preço em reais', 'preco em reais',
  'valor em reais', 'quantia', 'total'
];

// Map column headers to Transaction fields
function mapHeaderToField(header: string): string | null {
  const lowerHeader = header.toLowerCase().trim();
  
  if (DATE_PATTERNS.some(pattern => lowerHeader.includes(pattern))) {
    return 'date';
  }
  
  if (DESCRIPTION_PATTERNS.some(pattern => lowerHeader.includes(pattern))) {
    return 'description';
  }
  
  if (AMOUNT_PATTERNS.some(pattern => lowerHeader.includes(pattern))) {
    return 'amount';
  }
  
  return null;
}

// Parse date strings in various formats
function parseDate(dateString: string): Date {
  // Handle different date formats (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
  dateString = dateString.trim();
  
  // Try to parse with browser's built-in date parsing
  const parsed = new Date(dateString);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  
  // Common Brazilian format DD/MM/YYYY
  const brPattern = /^(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{2,4})$/;
  const brMatch = dateString.match(brPattern);
  if (brMatch) {
    const [_, day, month, year] = brMatch;
    const fullYear = year.length === 2 ? `20${year}` : year;
    return new Date(`${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  }
  
  // American format MM/DD/YYYY
  const usPattern = /^(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})$/;
  const usMatch = dateString.match(usPattern);
  if (usMatch) {
    const [_, month, day, year] = usMatch;
    return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  }
  
  // Fallback to current date if unable to parse
  console.error(`Unable to parse date: ${dateString}`);
  return new Date();
}

// Parse amount strings in various formats
function parseAmount(amountString: string): number {
  if (!amountString) return 0;
  
  // Remove currency symbols, spaces and convert commas to periods for decimal
  let cleanAmount = amountString
    .replace(/[^\d,-\.]/g, '') // Remove all non-numeric chars except , - .
    .replace(',', '.'); // Convert comma to period for decimal
  
  // Handle negative amounts (may be in parentheses or with minus sign)
  const isNegative = amountString.includes('-') || 
                     amountString.includes('(') || 
                     /negativo|negative/i.test(amountString);
  
  // Parse to float
  let amount = parseFloat(cleanAmount);
  if (isNaN(amount)) return 0;
  
  // Ensure positive value (will be shown as expense anyway)
  return Math.abs(amount);
}

// Main CSV parsing function
export async function parseCsvFile(file: File): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        try {
          const { data, errors, meta } = results;
          
          if (errors.length > 0) {
            console.error('CSV parsing errors:', errors);
            reject(new Error('Erro ao processar o arquivo CSV. Verifique o formato e tente novamente.'));
            return;
          }
          
          if (!Array.isArray(data) || data.length === 0) {
            reject(new Error('Arquivo CSV vazio ou inválido.'));
            return;
          }
          
          // Detect column mapping
          const headerMapping: Record<string, string> = {};
          const headers = meta.fields || [];
          
          headers.forEach(header => {
            const field = mapHeaderToField(header);
            if (field) {
              headerMapping[header] = field;
            }
          });
          
          // If we couldn't identify the necessary columns, reject
          const requiredFields = ['date', 'description', 'amount'];
          const foundFields = Object.values(headerMapping);
          
          const missingFields = requiredFields.filter(field => !foundFields.includes(field));
          if (missingFields.length > 0) {
            reject(new Error(`Colunas necessárias não encontradas: ${missingFields.join(', ')}`));
            return;
          }
          
          // Transform raw data to Transaction objects
          const transactions: Transaction[] = (data as RawCsvRow[]).map(row => {
            // Extract values using mapped headers
            let dateValue = '';
            let descriptionValue = '';
            let amountValue = '';
            
            // Find the columns for each field
            Object.entries(headerMapping).forEach(([header, field]) => {
              const value = row[header];
              if (field === 'date') dateValue = value;
              else if (field === 'description') descriptionValue = value;
              else if (field === 'amount') amountValue = value;
            });
            
            const parsedDate = parseDate(dateValue);
            const amount = parseAmount(amountValue);
            const description = descriptionValue.trim();
            
            // Auto-detect category based on description
            const category = detectCategory(description);
            
            return {
              date: parsedDate,
              description,
              amount,
              category
            };
          });
          
          resolve(transactions);
        } catch (error) {
          console.error('Error processing CSV:', error);
          reject(new Error('Erro ao processar o arquivo. Verifique o formato e tente novamente.'));
        }
      },
      error: (error) => {
        console.error('Papa Parse error:', error);
        reject(new Error('Erro ao ler o arquivo CSV.'));
      }
    });
  });
}
