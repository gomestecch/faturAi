import { defineConfig } from "drizzle-kit";
import path from "path";

// Caminho do banco de dados SQLite
const dbPath = path.join(process.cwd(), 'data', 'faturai.db');

export default defineConfig({
  out: "./db/migrations",
  schema: "./shared/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: `file:${dbPath}`,
  },
  verbose: true,
});
