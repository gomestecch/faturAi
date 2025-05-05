import { useEffect, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Chart from "chart.js/auto";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/types";
import { nubankColors, getChartColors } from "@/lib/nubank-theme";

interface CategoryData {
  name: string;
  amount: number;
  color: string;
}

interface CategoryBreakdownProps {
  transactions: Transaction[];
}

export default function CategoryBreakdown({ transactions }: CategoryBreakdownProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Define category colors usando a paleta do Nubank
  const categoryColors = {
    'Alimentação': nubankColors.primary,
    'Transporte': nubankColors.secondary,
    'Lazer': nubankColors.primaryLight,
    'Saúde': nubankColors.success,
    'Moradia': nubankColors.secondary,
    'Educação': nubankColors.info,
    'Compras': nubankColors.warning,
    'Outros': nubankColors.textTertiary
  };
  
  // Group transactions by category
  const categoryData = useMemo(() => {
    const groupedByCategory: Record<string, number> = {};
    
    transactions.forEach((transaction) => {
      const category = transaction.category || 'Outros';
      if (!groupedByCategory[category]) {
        groupedByCategory[category] = 0;
      }
      groupedByCategory[category] += transaction.amount;
    });
    
    // Convert to array and sort by amount (descending)
    const categories: CategoryData[] = Object.entries(groupedByCategory)
      .map(([name, amount]) => ({
        name,
        amount,
        color: categoryColors[name as keyof typeof categoryColors] || nubankColors.primaryLight
      }))
      .sort((a, b) => b.amount - a.amount);
    
    return categories;
  }, [transactions]);
  
  useEffect(() => {
    if (!chartRef.current || categoryData.length === 0) return;
    
    // Clean up existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      // Obter cores do tema Nubank para o gráfico
      const chartColors = getChartColors(categoryData.length, 'mixed');
      
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: categoryData.map(c => c.name),
          datasets: [{
            data: categoryData.map(c => c.amount),
            backgroundColor: chartColors,
            borderColor: nubankColors.backgroundLight,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                padding: 20,
                color: nubankColors.textSecondary
              }
            },
            tooltip: {
              backgroundColor: nubankColors.background,
              titleColor: nubankColors.textPrimary,
              bodyColor: nubankColors.textPrimary,
              borderColor: nubankColors.primary,
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  const value = context.raw as number;
                  return `${context.label}: ${formatCurrency(value)}`;
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
  }, [categoryData]);
  
  return (
    <Card className="lg:col-span-1 border-t-4" style={{ borderTopColor: nubankColors.primary }}>
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium mb-4" style={{ color: nubankColors.primary }}>Categorias de Despesas</h2>
        <div className="chart-container h-[250px]">
          <canvas ref={chartRef}></canvas>
        </div>
        
        <div className="mt-4">
          {categoryData.map((category, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center py-2 border-b last:border-0"
              style={{ borderColor: 'rgba(138, 5, 190, 0.1)' }}
            >
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: getChartColors(categoryData.length, 'mixed')[index] }}
                ></div>
                <span>{category.name}</span>
              </div>
              <span className="font-mono font-semibold">
                {formatCurrency(category.amount)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
