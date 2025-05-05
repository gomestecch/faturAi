import { useState } from "react";
import { format, addMonths, startOfMonth, endOfMonth, isAfter, isBefore, isEqual } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

export default function DateRangeFilter({ onDateRangeChange }: DateRangeFilterProps) {
  const today = new Date();
  const firstDayCurrentMonth = startOfMonth(today);
  const lastDayCurrentMonth = endOfMonth(today);
  
  const [startDate, setStartDate] = useState<Date | undefined>(firstDayCurrentMonth);
  const [endDate, setEndDate] = useState<Date | undefined>(lastDayCurrentMonth);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);
  
  // Handler for first calendar selection
  const handleStartSelect = (date: Date | undefined) => {
    setStartDate(date);
    
    // If end date is not selected or before start date, set it to start date
    if (!endDate || (date && isBefore(endDate, date))) {
      setEndDate(date);
    }
    
    // If both dates are selected, dispatch change
    if (date && endDate) {
      onDateRangeChange(date, endDate);
    }
    
    // Close start calendar and open end calendar
    setIsStartOpen(false);
    setIsEndOpen(true);
  };
  
  // Handler for second calendar selection
  const handleEndSelect = (date: Date | undefined) => {
    setEndDate(date);
    
    // If start date is not selected or after end date, set it to end date
    if (!startDate || (date && isAfter(startDate, date))) {
      setStartDate(date);
    }
    
    // If both dates are selected, dispatch change
    if (startDate && date) {
      onDateRangeChange(startDate, date);
    }
    
    setIsEndOpen(false);
  };
  
  // Quick select options
  const handleQuickSelect = (option: string) => {
    let newStartDate: Date;
    let newEndDate: Date = today;
    
    switch (option) {
      case "this-month":
        newStartDate = firstDayCurrentMonth;
        newEndDate = lastDayCurrentMonth;
        break;
      case "last-month":
        const lastMonth = addMonths(today, -1);
        newStartDate = startOfMonth(lastMonth);
        newEndDate = endOfMonth(lastMonth);
        break;
      case "last-3-months":
        newStartDate = startOfMonth(addMonths(today, -3));
        newEndDate = lastDayCurrentMonth;
        break;
      case "last-6-months":
        newStartDate = startOfMonth(addMonths(today, -6));
        newEndDate = lastDayCurrentMonth;
        break;
      case "year-to-date":
        newStartDate = new Date(today.getFullYear(), 0, 1);
        newEndDate = today;
        break;
      case "last-year":
        newStartDate = new Date(today.getFullYear() - 1, 0, 1);
        newEndDate = new Date(today.getFullYear() - 1, 11, 31);
        break;
      default:
        return;
    }
    
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    onDateRangeChange(newStartDate, newEndDate);
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-2 mb-4">
      <div className="flex gap-2 items-center">
        <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal max-w-[200px]",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "dd/MM/yyyy") : "Selecione a data inicial"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartSelect}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
        
        <span className="text-muted-foreground">até</span>
        
        <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal max-w-[200px]",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "dd/MM/yyyy") : "Selecione a data final"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndSelect}
              initialFocus
              fromDate={startDate}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleQuickSelect("this-month")}
          className={cn(
            startDate && endDate && 
            isEqual(startDate, firstDayCurrentMonth) && 
            isEqual(endDate, lastDayCurrentMonth) ? 
            "bg-primary/10 border-primary/50" : ""
          )}
        >
          Este mês
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleQuickSelect("last-month")}
        >
          Mês anterior
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleQuickSelect("last-3-months")}
        >
          Últimos 3 meses
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleQuickSelect("last-6-months")}
        >
          Últimos 6 meses
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleQuickSelect("year-to-date")}
        >
          Ano atual
        </Button>
      </div>
    </div>
  );
}