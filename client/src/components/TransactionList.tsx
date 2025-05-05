import { useState, useMemo } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { defaultCategories, getCategoryColor } from "@/lib/categories";
import { Transaction } from "@/types";

interface TransactionListProps {
  transactions: Transaction[];
  onCategoryUpdate?: (description: string, newCategory: string) => void;
}

export default function TransactionList({ transactions, onCategoryUpdate }: TransactionListProps) {
  const [category, setCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("date_desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    transactions.forEach(t => {
      if (t.category) uniqueCategories.add(t.category);
    });
    return Array.from(uniqueCategories).sort();
  }, [transactions]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    
    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter(t => t.category === category);
    }
    
    // Filter by search term
    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(search) || 
        (t.category && t.category.toLowerCase().includes(search))
      );
    }
    
    // Sort transactions
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case "date_desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date_asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount_desc":
          return b.amount - a.amount;
        case "amount_asc":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [transactions, category, sortOrder, searchTerm]);
  
  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);
  
  // Generate pagination items
  const paginationItems = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
  } else {
    // First page
    paginationItems.push(
      <PaginationItem key={1}>
        <PaginationLink 
          isActive={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Middle pages with ellipsis if needed
    if (currentPage > 3) {
      paginationItems.push(
        <PaginationItem key="ellipsis1">
          <span className="px-2">...</span>
        </PaginationItem>
      );
    }
    
    // Pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Second ellipsis if needed
    if (currentPage < totalPages - 2) {
      paginationItems.push(
        <PaginationItem key="ellipsis2">
          <span className="px-2">...</span>
        </PaginationItem>
      );
    }
    
    // Last page
    if (totalPages > 1) {
      paginationItems.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            isActive={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
  }
  
  // Function to get category name from ID
  const getCategoryName = (categoryId: string): string => {
    const category = defaultCategories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  // Function to format categories for select dropdown
  const formatCategoryOptions = () => {
    return defaultCategories.map(category => (
      <SelectItem key={category.id} value={category.id}>
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <span>{category.name}</span>
        </div>
      </SelectItem>
    ));
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-foreground mb-2 md:mb-0">Transações</h2>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Select 
              value={category} 
              onValueChange={setCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((cat, index) => (
                    <SelectItem key={index} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Select 
              value={sortOrder} 
              onValueChange={setSortOrder}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="date_desc">Data (recente)</SelectItem>
                  <SelectItem value="date_asc">Data (antiga)</SelectItem>
                  <SelectItem value="amount_desc">Valor (maior)</SelectItem>
                  <SelectItem value="amount_asc">Valor (menor)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar..."
                className="pl-8 w-full md:w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      {onCategoryUpdate ? (
                        <Select 
                          value={transaction.category || "outros"} 
                          onValueChange={(value) => {
                            if (onCategoryUpdate) {
                              onCategoryUpdate(transaction.description, value);
                            }
                          }}
                        >
                          <SelectTrigger className="w-[180px] h-8">
                            <SelectValue>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ 
                                    backgroundColor: getCategoryColor(transaction.category || "outros") 
                                  }}
                                />
                                <span>{getCategoryName(transaction.category || "outros")}</span>
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {formatCategoryOptions()}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge 
                          variant="outline" 
                          style={{ 
                            backgroundColor: `${getCategoryColor(transaction.category || "outros")}15`,
                            color: getCategoryColor(transaction.category || "outros"),
                            borderColor: `${getCategoryColor(transaction.category || "outros")}30` 
                          }}
                        >
                          {getCategoryName(transaction.category || "outros")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-destructive">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    Nenhuma transação encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
              </span> de <span className="font-medium">{filteredTransactions.length}</span> transações
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
                {paginationItems}
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
