import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Since all processing happens client-side, we don't need any API routes
  // for this application. We're just serving the static React application.
  
  const httpServer = createServer(app);
  return httpServer;
}
