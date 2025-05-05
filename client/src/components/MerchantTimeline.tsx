import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@/types";
import { Search, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  
  // Group transactions by merchant (description)
  const merchantData = useMemo(() => {
    const merchants: Record<string, MerchantData> = {};
    
    transactions.forEach(transaction => {
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
  }, [transactions]);
  
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
  
  return (
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
  );
}