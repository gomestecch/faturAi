export interface Transaction {
  date: Date | string;
  description: string;
  amount: number;
  category?: string;
}
