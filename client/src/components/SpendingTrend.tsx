import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/types";
import { nubankColors } from "@/lib/nubank-theme";

interface SpendingTrendProps {
  transactions: Transaction[];
  timeFrame: "7D" | "30D" | "90D" | "12M";
}

export default function SpendingTrend({ 
  transactions, 
  timeFrame 
}: SpendingTrendProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Clean up existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Group transactions by date
    const today = new Date();
    let daysToShow: number;
    
    switch (timeFrame) {
      case "7D": daysToShow = 7; break;
      case "30D": daysToShow = 30; break;
      case "90D": daysToShow = 90; break;
      case "12M": daysToShow = 365; break;
      default: daysToShow = 7;
    }
    
    // Create dates for the selected timeframe
    const dates: string[] = [];
    const spendingData: number[] = [];
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit'
      });
      dates.push(dateString);
      
      // Sum transactions for this date
      const dateOnly = date.toISOString().split('T')[0];
      const dailyTotal = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.toISOString().split('T')[0] === dateOnly;
        })
        .reduce((sum, t) => sum + t.amount, 0);
      
      spendingData.push(dailyTotal);
    }
    
    // Create Chart
    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Gastos Diários',
            data: spendingData,
            borderColor: nubankColors.primary,
            backgroundColor: `rgba(138, 5, 190, 0.1)`,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: nubankColors.primary,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: nubankColors.background,
              titleColor: nubankColors.textPrimary,
              bodyColor: nubankColors.textPrimary,
              borderColor: nubankColors.primary,
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  return formatCurrency(context.parsed.y);
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: nubankColors.textTertiary
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(138, 5, 190, 0.1)'
              },
              ticks: {
                color: nubankColors.textTertiary,
                callback: function(value) {
                  return formatCurrency(value as number);
                }
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
  }, [transactions, timeFrame]);
  
  return (
    <div className="chart-container h-[250px]">
      <h3 className="text-sm font-medium mb-2" style={{ color: nubankColors.primary }}>Tendência de Gastos ({timeFrame})</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
