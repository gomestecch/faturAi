import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import CategoryManager from "@/components/CategoryManager";

export default function CategoriesPage() {
  const handleCategoryChange = () => {
    // Atualização feita pelo próprio componente CategoryManager
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <CategoryManager onCategoryChange={handleCategoryChange} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}