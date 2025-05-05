import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { nubankColors } from "@/lib/nubank-theme";
import { BarChart3, Upload, Plus, ChevronRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-bold mb-3" style={{ color: nubankColors.primary }}>
        Bem-vindo ao FaturAi
      </h1>
      <p className="text-lg mb-8 text-center max-w-2xl">
        A solução inteligente para análise de suas faturas e controle financeiro pessoal, com a estética do Nubank.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Card para Dashboard */}
        <div className="bg-white rounded-lg shadow-lg p-8 border-t-4" 
          style={{ borderTopColor: nubankColors.primary }}>
          <div className="flex items-center mb-4">
            <div className="rounded-full p-3 mr-4" style={{ backgroundColor: nubankColors.primary + '20' }}>
              <BarChart3 className="h-8 w-8" style={{ color: nubankColors.primary }} />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: nubankColors.primary }}>Dashboard</h2>
          </div>
          
          <p className="mb-6 text-gray-600">
            Visualize suas despesas, análise de categorias e tendências de gastos com gráficos interativos.
          </p>
          
          <Link href="/dashboard">
            <Button className="w-full" 
              style={{ backgroundColor: nubankColors.primary, color: 'white' }}>
              Acessar Dashboard
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Card para Importação */}
        <div className="bg-white rounded-lg shadow-lg p-8 border-t-4" 
          style={{ borderTopColor: nubankColors.secondary }}>
          <div className="flex items-center mb-4">
            <div className="rounded-full p-3 mr-4" style={{ backgroundColor: nubankColors.secondary + '20' }}>
              <Upload className="h-8 w-8" style={{ color: nubankColors.secondary }} />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: nubankColors.secondary }}>Importar Faturas</h2>
          </div>
          
          <p className="mb-6 text-gray-600">
            Importe suas faturas do cartão de crédito em formato CSV e comece a analisar seus gastos.
          </p>
          
          <Link href="/import">
            <Button className="w-full" 
              style={{ backgroundColor: nubankColors.secondary, color: 'white' }}>
              Importar Agora
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Recursos adicionais */}
      <div className="mt-12 w-full max-w-4xl">
        <h3 className="text-xl font-semibold mb-4" style={{ color: nubankColors.primary }}>
          Recursos adicionais
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/categories">
            <Button variant="outline" className="w-full justify-start" 
              style={{ borderColor: nubankColors.primary, color: nubankColors.primary }}>
              <Plus className="mr-2 h-4 w-4" />
              Gerenciar Categorias
            </Button>
          </Link>
          
          <a href="https://github.com/seu-usuario/faturai" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full justify-start">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Repositório no GitHub
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}