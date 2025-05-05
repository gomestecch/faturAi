import { ArrowDown, ArrowUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { nubankColors } from "@/lib/nubank-theme";

interface SummaryCardProps {
  title: string;
  value: number;
  valueType: "currency" | "number" | "percentage";
  trend?: number;
  trendIsPositive?: boolean;
  trendLabel?: string;
  subtitle?: string;
  accentColor?: string;
}

export default function SummaryCard({
  title,
  value,
  valueType,
  trend,
  trendIsPositive,
  trendLabel,
  subtitle,
  accentColor = nubankColors.primary
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
    <div className="rounded-lg p-4 border" style={{ 
      borderLeft: `4px solid ${accentColor}`,
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    }}>
      <p className="text-sm font-medium" style={{ color: accentColor }}>{title}</p>
      <p className="text-2xl font-mono font-semibold">{formatValue()}</p>
      
      {trend !== undefined && trendIsPositive !== undefined && (
        <div className="flex items-center text-sm mt-1">
          {trendIsPositive ? (
            <ArrowUp className="h-4 w-4" style={{ color: nubankColors.success }} />
          ) : (
            <ArrowDown className="h-4 w-4" style={{ color: nubankColors.error }} />
          )}
          <span 
            style={{ color: trendIsPositive ? nubankColors.success : nubankColors.error }}
          >
            {trend.toFixed(1)}%
          </span>
          {trendLabel && (
            <span className="ml-1" style={{ color: nubankColors.textTertiary }}>{trendLabel}</span>
          )}
        </div>
      )}
      
      {subtitle && (
        <p className="text-xs mt-1 truncate" style={{ color: nubankColors.textTertiary }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
