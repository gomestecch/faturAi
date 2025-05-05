export interface Transaction {
  date: Date;
  description: string;
  amount: number;
  category?: string;
}
