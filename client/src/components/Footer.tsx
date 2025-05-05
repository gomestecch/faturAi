import { Link } from "wouter";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { nubankColors } from "@/lib/nubank-theme";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-8" style={{ borderColor: 'rgba(138, 5, 190, 0.1)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-baseline mb-2">
              <span className="text-xl font-bold" style={{ color: nubankColors.primary }}>Fatur</span>
              <span className="text-xl font-bold" style={{ color: nubankColors.primary }}>Ai</span>
            </div>
            <p className="text-sm text-center md:text-left" style={{ color: nubankColors.textTertiary }}>
              O jeito mais fácil de visualizar seus gastos
            </p>
          </div>
          
          <div className="flex flex-col space-y-1 items-center md:items-end">
            <div className="flex space-x-4">
              <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">
                <Github style={{ color: nubankColors.textSecondary }} className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">
                <Twitter style={{ color: nubankColors.textSecondary }} className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">
                <Linkedin style={{ color: nubankColors.textSecondary }} className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">
                <Instagram style={{ color: nubankColors.textSecondary }} className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs" style={{ color: nubankColors.textTertiary }}>
              &copy; {currentYear} FaturAi. Todos os direitos reservados.
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm"
          style={{ borderColor: 'rgba(138, 5, 190, 0.1)' }}>
          <div>
            <h3 className="font-medium mb-2" style={{ color: nubankColors.primary }}>Produto</h3>
            <ul className="space-y-2">
              <li><Link href="/import" style={{ color: nubankColors.textSecondary }}>Importar Faturas</Link></li>
              <li><Link href="/categories" style={{ color: nubankColors.textSecondary }}>Gerenciar Categorias</Link></li>
              <li><Link href="/" style={{ color: nubankColors.textSecondary }}>Dashboard</Link></li>
              <li><a href="#" style={{ color: nubankColors.textSecondary }}>Preços</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2" style={{ color: nubankColors.primary }}>Suporte</h3>
            <ul className="space-y-2">
              <li><a href="#" style={{ color: nubankColors.textSecondary }}>Central de Ajuda</a></li>
              <li><a href="#" style={{ color: nubankColors.textSecondary }}>Contato</a></li>
              <li><a href="#" style={{ color: nubankColors.textSecondary }}>Status</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2" style={{ color: nubankColors.primary }}>Empresa</h3>
            <ul className="space-y-2">
              <li><a href="#" style={{ color: nubankColors.textSecondary }}>Sobre</a></li>
              <li><a href="#" style={{ color: nubankColors.textSecondary }}>Blog</a></li>
              <li><a href="#" style={{ color: nubankColors.textSecondary }}>Carreiras</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2" style={{ color: nubankColors.primary }}>Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" style={{ color: nubankColors.textSecondary }}>Termos de Uso</a></li>
              <li><a href="#" style={{ color: nubankColors.textSecondary }}>Privacidade</a></li>
              <li><a href="#" style={{ color: nubankColors.textSecondary }}>Cookies</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
