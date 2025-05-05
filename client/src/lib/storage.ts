import { Transaction } from "@/types";

const STORAGE_KEYS = {
  TRANSACTIONS: "finance_tracker_transactions",
  CATEGORIES: "finance_tracker_categories",
  SETTINGS: "finance_tracker_settings"
};

/**
 * Salva as transações no localStorage
 */
export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS, 
      JSON.stringify(transactions)
    );
  } catch (error) {
    console.error("Erro ao salvar transações:", error);
  }
}

/**
 * Carrega as transações do localStorage
 */
export function loadTransactions(): Transaction[] {
  try {
    const storedData = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!storedData) return [];
    
    const parsedData = JSON.parse(storedData) as Transaction[];
    
    // Convertendo as strings de data para objetos Date
    return parsedData.map(transaction => ({
      ...transaction,
      date: new Date(transaction.date)
    }));
  } catch (error) {
    console.error("Erro ao carregar transações:", error);
    return [];
  }
}

/**
 * Salva categorias personalizadas do usuário
 */
export function saveUserCategories(categories: any[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.CATEGORIES, 
      JSON.stringify(categories)
    );
  } catch (error) {
    console.error("Erro ao salvar categorias:", error);
  }
}

/**
 * Carrega categorias personalizadas do usuário
 */
export function loadUserCategories(): any[] {
  try {
    const storedData = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!storedData) return [];
    
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
    return [];
  }
}

/**
 * Salva configurações da aplicação
 */
export function saveSettings(settings: Record<string, any>): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.SETTINGS, 
      JSON.stringify(settings)
    );
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
  }
}

/**
 * Carrega configurações da aplicação
 */
export function loadSettings(): Record<string, any> {
  try {
    const storedData = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!storedData) return {};
    
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
    return {};
  }
}

/**
 * Limpa todos os dados armazenados
 */
export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  } catch (error) {
    console.error("Erro ao limpar dados:", error);
  }
}

/**
 * Verifica se há dados salvos
 */
export function hasSavedData(): boolean {
  return !!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
}