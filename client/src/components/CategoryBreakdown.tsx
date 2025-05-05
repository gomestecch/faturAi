import { useEffect, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Chart from "chart.js/auto";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/types";

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

  // Define category colors
  const categoryColors = {
    'Alimentação': 'hsl(var(--primary))',
    'Transporte': 'hsl(var(--secondary))',
    'Lazer': 'hsl(var(--accent))',
    'Saúde': 'hsl(var(--success))',
    'Outros': 'hsl(var(--muted-foreground))'
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
        color: categoryColors[name as keyof typeof categoryColors] || 'hsl(var(--muted-foreground))'
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
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: categoryData.map(c => c.name),
          datasets: [{
            data: categoryData.map(c => c.amount),
            backgroundColor: categoryData.map(c => c.color),
            borderWidth: 1
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
                padding: 20
              }
            },
            tooltip: {
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
    <Card className="lg:col-span-1">
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium text-foreground mb-4">Categorias de Despesas</h2>
        <div className="chart-container h-[250px]">
          <canvas ref={chartRef}></canvas>
        </div>
        
        <div className="mt-4">
          {categoryData.map((category, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-foreground">{category.name}</span>
              </div>
              <span className="font-mono text-foreground">
                {formatCurrency(category.amount)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
