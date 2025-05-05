import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { nubankColors } from "@/lib/nubank-theme";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4" style={{ color: nubankColors.primary }}>404</h1>
        <h2 className="text-2xl font-semibold mb-2" style={{ color: nubankColors.primary }}>Página não encontrada</h2>
        <p className="mb-6" style={{ color: nubankColors.textTertiary }}>
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link href="/">
          <Button className="flex items-center gap-2" style={{ backgroundColor: nubankColors.primary, color: 'white' }}>
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para o Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
