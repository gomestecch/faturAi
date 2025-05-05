import { ArrowDown, ArrowUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: number;
  valueType: "currency" | "number" | "percentage";
  trend?: number;
  trendIsPositive?: boolean;
  trendLabel?: string;
  subtitle?: string;
}

export default function SummaryCard({
  title,
  value,
  valueType,
  trend,
  trendIsPositive,
  trendLabel,
  subtitle
}: SummaryCardProps) {
  const formatValue = () => {
    if (valueType === "currency") {
      return formatCurrency(value);
    } else if (valueType === "percentage") {
      return `${value.toFixed(1)}%`;
    } else {
      return value.toLocaleString('pt-BR');
    }
  };

  return (
    <div className="bg-muted rounded-lg p-4 border border-border">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-mono font-semibold text-foreground">{formatValue()}</p>
      
      {trend !== undefined && trendIsPositive !== undefined && (
        <div className="flex items-center text-sm mt-1">
          {trendIsPositive ? (
            <ArrowUp className="text-success h-4 w-4" />
          ) : (
            <ArrowDown className="text-destructive h-4 w-4" />
          )}
          <span 
            className={trendIsPositive ? "text-success" : "text-destructive"}
          >
            {trend.toFixed(1)}%
          </span>
          {trendLabel && (
            <span className="text-muted-foreground ml-1">{trendLabel}</span>
          )}
        </div>
      )}
      
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
}
