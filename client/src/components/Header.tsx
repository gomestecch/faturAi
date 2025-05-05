import { Link } from "wouter";
import ThemeToggle from "@/components/ThemeToggle";
import { Wallet, SparkleIcon } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="bg-white rounded-full p-2 mr-3">
              <Wallet className="text-primary h-6 w-6" />
            </div>
            <div className="flex items-baseline">
              <h1 className="text-2xl font-bold text-white">Fatur</h1>
              <h1 className="text-2xl font-bold text-white flex items-center">
                Ai
                <SparkleIcon className="h-4 w-4 ml-0.5 text-amber-300" />
              </h1>
              <p className="text-xs text-white/80 ml-3">Análise inteligente de gastos</p>
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
