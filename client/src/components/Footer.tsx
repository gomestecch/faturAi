import { CreditCard, Shield, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center mb-4 gap-4">
          <div className="flex items-center text-primary">
            <Shield className="h-4 w-4 mr-2" />
            <span className="text-sm">Segurança</span>
          </div>
          <div className="flex items-center text-primary">
            <Lock className="h-4 w-4 mr-2" />
            <span className="text-sm">Privacidade</span>
          </div>
          <div className="flex items-center text-primary">
            <CreditCard className="h-4 w-4 mr-2" />
            <span className="text-sm">Análise Financeira</span>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FinançaFácil. Seus dados permanecem seguros no seu dispositivo.
        </p>
      </div>
    </footer>
  );
}
