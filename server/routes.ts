import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "../db";
import { transactions } from "../shared/schema";
import { eq } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configura a autenticação e rotas relacionadas
  setupAuth(app);
  
  // Rota para buscar todas as transações
  app.get("/api/transactions", async (req, res) => {
    try {
      // Se o usuário estiver autenticado, pegue as transações dele
      // Se não, pegue todas as transações (para fins de demonstração)
      let allTransactions;
      
      if (req.isAuthenticated()) {
        allTransactions = await db.select().from(transactions)
          .where(eq(transactions.userId, req.user.id));
      } else {
        allTransactions = await db.select().from(transactions);
      }
      
      res.json(allTransactions);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      res.status(500).json({ error: "Erro ao buscar transações" });
    }
  });
  
  // Rota para salvar transações
  app.post("/api/transactions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }
      
      const newTransactions = req.body;
      
      if (!Array.isArray(newTransactions)) {
        return res.status(400).json({ error: "Formato inválido. Esperado um array de transações." });
      }
      
      // Adicionar userId às transações
      const transactionsWithUserId = newTransactions.map(transaction => ({
        ...transaction,
        userId: req.user.id
      }));
      
      // Inserir as transações no banco de dados
      const result = await db.insert(transactions).values(transactionsWithUserId).returning();
      
      res.status(201).json(result);
    } catch (error) {
      console.error("Erro ao salvar transações:", error);
      res.status(500).json({ error: "Erro ao salvar transações" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
