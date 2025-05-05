import { useEffect, useRef, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Chart from "chart.js/auto";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/types";
import { Search } from "lucide-react";

interface MerchantTimelineProps {
  transactions: Transaction[];
}

interface MerchantData {
  name: string;
  totalSpent: number;
  dates: Date[];
  amounts: number[];
}

export default function MerchantTimeline({ transactions }: MerchantTimelineProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Group transactions by merchant (description)
  const merchantData = useMemo(() => {
    const merchants: Record<string, MerchantData> = {};
    
    transactions.forEach(transaction => {
      const description = transaction.description.trim();
      
      if (!merchants[description]) {
        merchants[description] = {
          name: description,
          totalSpent: 0,
          dates: [],
          amounts: []
        };
      }
      
      merchants[description].totalSpent += transaction.amount;
      merchants[description].dates.push(new Date(transaction.date));
      merchants[description].amounts.push(transaction.amount);
    });
    
    // Convert to array and sort by total spent (descending)
    return Object.values(merchants)
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }, [transactions]);
  
  // Filter merchants by search term
  const filteredMerchants = useMemo(() => {
    if (!searchTerm.trim()) {
      // Show only top 10 merchants if no search
      return merchantData.slice(0, 10);
    }
    
    const term = searchTerm.toLowerCase();
    return merchantData
      .filter(merchant => merchant.name.toLowerCase().includes(term))
      .slice(0, 10); // Still limit to 10 results
  }, [merchantData, searchTerm]);
  
  // Create chart
  useEffect(() => {
    if (!chartRef.current || filteredMerchants.length === 0) return;
    
    // Clean up existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const datasets = filteredMerchants.map((merchant, index) => {
      // Generate a color based on index to ensure different colors
      const hue = (index * 137) % 360; // Use golden angle approximation for even distribution
      const color = `hsl(${hue}, 70%, 60%)`;
      
      // Sort dates and amounts together
      const sortedData = merchant.dates.map((date, i) => ({
        date,
        amount: merchant.amounts[i]
      })).sort((a, b) => a.date.getTime() - b.date.getTime());
      
      return {
        label: merchant.name,
        data: sortedData.map(item => ({
          x: item.date,
          y: item.amount
        })),
        borderColor: color,
        backgroundColor: `${color}33`,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        borderWidth: 2
      };
    });
    
    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                boxWidth: 8,
                padding: 20
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw.y as number;
                  return `${context.dataset.label}: ${formatCurrency(value)}`;
                }
              }
            }
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'dd/MM'
                },
                tooltipFormat: 'dd/MM/yyyy'
              },
              title: {
                display: true,
                text: 'Data'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Valor (R$)'
              },
              ticks: {
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
  }, [filteredMerchants]);
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-medium">Linha do Tempo por Loja/Estabelecimento</h2>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar estabelecimento..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {filteredMerchants.length > 0 ? (
          <div className="h-[400px] mt-4">
            <canvas ref={chartRef}></canvas>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            {searchTerm ? "Nenhum estabelecimento encontrado com esse termo." : "Sem dados disponíveis."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}