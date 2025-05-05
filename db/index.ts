import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";
import path from 'path';
import fs from 'fs';

// Garantir que o diretório data exista
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Caminho do banco de dados SQLite
const dbPath = path.join(dataDir, 'faturai.db');

// Inicializar o banco de dados SQLite
const sqlite = new Database(dbPath);

// Configurar Drizzle com SQLite
export const db = drizzle(sqlite, { schema });

// Adicionar método run para executar SQL direto
db.run = (sql: string, params: any[] = []) => {
  return sqlite.prepare(sql).run(params);
};

// Exportar uma função para fechar a conexão
export const closeDb = () => {
  sqlite.close();
};