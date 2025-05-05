import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UploadCloud, BarChart2, Tag, Settings, LogOut } from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Bem-vindo ao FaturAi!</h1>
            <p className="text-muted-foreground">
              Escolha uma das opções abaixo para começar.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/import">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-2">
                  <UploadCloud className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Importar Faturas</CardTitle>
                <CardDescription>
                  Importe faturas do Nubank em CSV para análise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Suporte para arquivos CSV exportados do Nubank.
                  Faça upload de uma ou múltiplas faturas.
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/dashboard">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-2">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>
                  Visualize gráficos e análises completas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Veja resumos, tendências de gastos, breakdown por categorias
                  e estabelecimentos mais frequentes.
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/categories">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-2">
                  <Tag className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Gerenciar Categorias</CardTitle>
                <CardDescription>
                  Personalize as categorias de despesas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Crie, edite e gerencie suas categorias de despesas.
                  Defina palavras-chave para categorização automática.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}