import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

export default function DateRangeFilter({ onDateRangeChange }: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedFilter, setSelectedFilter] = useState<string>("todos");

  // Calculate date range based on filter selection
  useEffect(() => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (selectedFilter) {
      case "7dias":
        start.setDate(today.getDate() - 7);
        break;
      case "30dias":
        start.setDate(today.getDate() - 30);
        break;
      case "90dias":
        start.setDate(today.getDate() - 90);
        break;
      case "6meses":
        start.setMonth(today.getMonth() - 6);
        break;
      case "1ano":
        start.setFullYear(today.getFullYear() - 1);
        break;
      case "custom":
        // Use already set custom dates
        if (startDate && endDate) {
          onDateRangeChange(startDate, endDate);
          return;
        }
        break;
      default:
        // "todos" - use minimum and maximum dates
        start = new Date(2000, 0, 1); // Arbitrary old date
        end = new Date(2099, 11, 31); // Arbitrary future date
    }

    // If not custom, update the date fields
    if (selectedFilter !== "custom") {
      setStartDate(start);
      setEndDate(end);
      onDateRangeChange(start, end);
    }
  }, [selectedFilter, startDate, endDate, onDateRangeChange]);

  const handleCustomDateChange = (type: "start" | "end", date: Date | undefined) => {
    if (date) {
      if (type === "start") {
        setStartDate(date);
        // If end date is before start date, reset it
        if (endDate && date > endDate) {
          setEndDate(date);
        }
      } else {
        setEndDate(date);
        // If start date is after end date, reset it
        if (startDate && date < startDate) {
          setStartDate(date);
        }
      }

      // If both dates are selected, apply filter
      if ((type === "start" && endDate) || (type === "end" && startDate)) {
        onDateRangeChange(startDate || new Date(), endDate || new Date());
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-6">
      <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
        <Button
          variant={selectedFilter === "todos" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("todos")}
        >
          Todos
        </Button>
        <Button
          variant={selectedFilter === "7dias" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("7dias")}
        >
          7 dias
        </Button>
        <Button
          variant={selectedFilter === "30dias" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("30dias")}
        >
          30 dias
        </Button>
        <Button
          variant={selectedFilter === "90dias" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("90dias")}
        >
          90 dias
        </Button>
        <Button
          variant={selectedFilter === "6meses" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("6meses")}
        >
          6 meses
        </Button>
        <Button
          variant={selectedFilter === "1ano" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("1ano")}
        >
          1 ano
        </Button>
        <Button
          variant={selectedFilter === "custom" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("custom")}
        >
          Personalizado
        </Button>
      </div>

      {selectedFilter === "custom" && (
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "P", { locale: ptBR }) : "Data inicial"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                locale={ptBR}
                selected={startDate}
                onSelect={(date) => handleCustomDateChange("start", date)}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "P", { locale: ptBR }) : "Data final"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                locale={ptBR}
                selected={endDate}
                onSelect={(date) => handleCustomDateChange("end", date)}
                disabled={(date) => date > new Date() || (startDate ? date < startDate : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}