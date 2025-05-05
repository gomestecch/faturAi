import { useEffect, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Chart from "chart.js/auto";
import { Transaction } from "@/types";

interface TransactionFrequencyProps {
  transactions: Transaction[];
  className?: string;
}

export default function TransactionFrequency({ 
  transactions, 
  className = ""
}: TransactionFrequencyProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  // Group transactions by date to count frequency
  const frequencyData = useMemo(() => {
    const groupedByDate: Record<string, number> = {};
    
    // Initialize with last 15 days
    const today = new Date();
    for (let i = 14; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit'
      });
      groupedByDate[dateString] = 0;
    }
    
    // Count transactions for each date
    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const dateString = transactionDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      });
      
      if (groupedByDate[dateString] !== undefined) {
        groupedByDate[dateString]++;
      }
    });
    
    return {
      labels: Object.keys(groupedByDate),
      data: Object.values(groupedByDate)
    };
  }, [transactions]);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Clean up existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: frequencyData.labels,
          datasets: [{
            label: 'Número de Transações',
            data: frequencyData.data,
            backgroundColor: 'hsl(var(--secondary))'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                stepSize: 1
              }
            }
          }
        }
      });
    }
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [frequencyData]);
  
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium text-foreground mb-4">Frequência de Transações</h2>
        <div className="chart-container h-[250px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
