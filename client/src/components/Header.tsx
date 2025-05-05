import { Link } from "wouter";
import ThemeToggle from "@/components/ThemeToggle";
import { CreditCard } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="bg-white rounded-full p-2 mr-3">
              <CreditCard className="text-primary h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">FinançaFácil</h1>
              <p className="text-xs text-white/80">Inspirado no estilo Nubank</p>
            </div>
          </Link>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
