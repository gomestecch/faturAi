import { Link } from "wouter";
import ThemeToggle from "@/components/ThemeToggle";
import { Wallet, SparkleIcon, Menu, User, HelpCircle, BarChart3 } from "lucide-react";
import { nubankColors } from "@/lib/nubank-theme";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header style={{ 
      backgroundColor: nubankColors.primary, 
      boxShadow: '0 4px 12px rgba(138, 5, 190, 0.1)',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="bg-white rounded-full p-2 mr-3">
              <Wallet className="h-6 w-6" style={{ color: nubankColors.primary }} />
            </div>
            <div className="flex items-baseline">
              <h1 className="text-2xl font-bold text-white">Fatur</h1>
              <h1 className="text-2xl font-bold text-white flex items-center">
                Ai
                <SparkleIcon className="h-4 w-4 ml-0.5 text-white" />
              </h1>
              <p className="text-xs ml-3 opacity-90 text-white">Análise inteligente de gastos</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            
            <Link href="/import">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                Importar
              </Button>
            </Link>
            
            <Link href="/categories">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                Categorias
              </Button>
            </Link>
            
            <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10">
              <HelpCircle className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
