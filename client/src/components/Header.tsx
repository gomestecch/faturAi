import { Link } from "wouter";
import ThemeToggle from "@/components/ThemeToggle";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Sparkles className="text-primary mr-2 h-6 w-6" />
            <h1 className="text-xl font-semibold text-foreground">AnalisaGastos</h1>
          </Link>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
