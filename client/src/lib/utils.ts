import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

export function formatDate(date: Date | string): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toLocaleDateString('pt-BR');
  } catch {
    return '';
  }
}

export function calculateTrend(current: number, previous: number): {
  value: number;
  isPositive: boolean;
} {
  if (previous === 0) return { value: 0, isPositive: false };
  
  const trendValue = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(trendValue),
    isPositive: trendValue >= 0
  };
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getRandomTrend(): {
  value: number;
  isPositive: boolean;
} {
  const value = Math.random() * 15; // Random value between 0 and 15
  const isPositive = Math.random() > 0.5; // Randomly decide if positive or negative
  return { value, isPositive };
}
