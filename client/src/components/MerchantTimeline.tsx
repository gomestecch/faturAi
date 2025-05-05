import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@/types";
import { 
  Search, 
  TrendingUp, 
  ChevronRight, 
  Calendar, 
  ArrowLeft,
  BarChart3,
  Banknote,
  History
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCategoryColor } from "@/lib/categories";

interface MerchantTimelineProps {
  transactions: Transaction[];
}

interface MerchantData {
  name: string;
  totalSpent: number;
  lastPurchaseDate: Date;
  frequency: number;
  transactions: Transaction[];
}

export default function MerchantTimeline({ transactions }: MerchantTimelineProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantData | null>(null);
  
  // Filtrar apenas gastos (valores positivos), removendo pagamentos
  const expenseTransactions = useMemo(() => {
    return transactions.filter(t => t.amount > 0);
  }, [transactions]);
  
  // Group transactions by merchant (description)
  const merchantData = useMemo(() => {
    const merchants: Record<string, MerchantData> = {};
    
    expenseTransactions.forEach(transaction => {
      const description = transaction.description.trim();
      
      if (!merchants[description]) {
        merchants[description] = {
          name: description,
          totalSpent: 0,
          lastPurchaseDate: new Date(transaction.date),
          frequency: 0,
          transactions: []
        };
      }
      
      // Add amount to total
      merchants[description].totalSpent += transaction.amount;
      
      // Track last purchase date
      const purchaseDate = new Date(transaction.date);
      if (purchaseDate > merchants[description].lastPurchaseDate) {
        merchants[description].lastPurchaseDate = purchaseDate;
      }
      
      // Add to transaction list
      merchants[description].transactions.push(transaction);
    });
    
    // Calculate frequency (transactions per month)
    Object.values(merchants).forEach(merchant => {
      merchant.frequency = merchant.transactions.length;
    });
    
    // Convert to array and sort by total spent (descending)
    return Object.values(merchants)
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }, [expenseTransactions]);
  
  // Filter merchants by search term
  const filteredMerchants = useMemo(() => {
    if (!searchTerm.trim()) {
      // Show only top 15 merchants if no search
      return merchantData.slice(0, 15);
    }
    
    const term = searchTerm.toLowerCase();
    return merchantData
      .filter(merchant => merchant.name.toLowerCase().includes(term))
      .slice(0, 15); // Still limit to 15 results
  }, [merchantData, searchTerm]);
  
  // Handle merchant selection
  const handleMerchantClick = (merchant: MerchantData) => {
    setSelectedMerchant(merchant);
  };
  
  // Função para calcular o gasto médio
  const calculateAverageSpend = (merchant: MerchantData): number => {
    return merchant.totalSpent / merchant.frequency;
  };
  
  // Função para determinar o mês com o maior gasto
  const findPeakMonth = (merchant: MerchantData): { month: string, amount: number } => {
    const monthlySpends: Record<string, number> = {};
    
    merchant.transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthlySpends[monthKey] = (monthlySpends[monthKey] || 0) + t.amount;
    });
    
    let peakMonth = '';
    let peakAmount = 0;
    
    Object.entries(monthlySpends).forEach(([month, amount]) => {
      if (amount > peakAmount) {
        peakMonth = month;
        peakAmount = amount;
      }
    });
    
    const [year, month] = peakMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    
    return {
      month: date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      amount: peakAmount
    };
  };
  
  return (
    <>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Estabelecimentos mais frequentes</h2>
              <p className="text-muted-foreground text-sm">Conheça os locais onde você mais gasta</p>
            </div>
            
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estabelecimento</TableHead>
                    <TableHead>Total Gasto</TableHead>
                    <TableHead>Frequência</TableHead>
                    <TableHead>Última Compra</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMerchants.map((merchant, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{merchant.name}</TableCell>
                      <TableCell className="font-mono text-destructive">
                        {formatCurrency(merchant.totalSpent)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={merchant.frequency > 3 ? "secondary" : "outline"} 
                            className="px-2 py-0.5 rounded-md text-xs font-medium">
                            {merchant.frequency}× 
                          </Badge>
                          {merchant.frequency > 5 && (
                            <TrendingUp className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(merchant.lastPurchaseDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleMerchantClick(merchant)}
                          aria-label={`Ver detalhes de ${merchant.name}`}
                        >
                          <span className="mr-1">Detalhes</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              {searchTerm ? "Nenhum estabelecimento encontrado com esse termo." : "Sem dados disponíveis."}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Merchant Detail Dialog */}
      <Dialog open={!!selectedMerchant} onOpenChange={(open) => !open && setSelectedMerchant(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedMerchant(null)}
                className="absolute left-4 top-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-xl ml-6">
                {selectedMerchant?.name}
              </DialogTitle>
            </div>
            <DialogDescription>
              Detalhes de todas as transações neste estabelecimento
            </DialogDescription>
          </DialogHeader>
          
          {selectedMerchant && (
            <div className="mt-4">
              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Banknote className="h-5 w-5 text-primary" />
                      <h3 className="text-sm font-medium">Gasto total</h3>
                    </div>
                    <p className="text-2xl font-bold text-destructive">
                      {formatCurrency(selectedMerchant.totalSpent)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Em {selectedMerchant.frequency} compras
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <h3 className="text-sm font-medium">Média por compra</h3>
                    </div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(calculateAverageSpend(selectedMerchant))}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Média por transação
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h3 className="text-sm font-medium">Pico de gastos</h3>
                    </div>
                    {selectedMerchant.transactions.length > 0 && (
                      <>
                        <p className="text-lg font-bold capitalize">
                          {findPeakMonth(selectedMerchant).month}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatCurrency(findPeakMonth(selectedMerchant).amount)}
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Transaction history */}
              <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                <History className="h-4 w-4" />
                Histórico de transações
              </h3>
              
              <ScrollArea className="h-[300px] rounded-md border">
                <div className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Categoria</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedMerchant.transactions
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((transaction, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{formatDate(transaction.date)}</TableCell>
                            <TableCell className="font-mono text-destructive">
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell>
                              {transaction.category && (
                                <Badge 
                                  variant="outline" 
                                  style={{ 
                                    backgroundColor: `${getCategoryColor(transaction.category)}15`,
                                    color: getCategoryColor(transaction.category),
                                    borderColor: `${getCategoryColor(transaction.category)}30` 
                                  }}
                                >
                                  {transaction.category}
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}