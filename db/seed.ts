import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from 'drizzle-orm';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    // Verifica se o usuário admin já existe
    const existingUser = await db.select().from(schema.users).where(eq(schema.users.username, 'admin'));
    
    if (existingUser.length === 0) {
      // Cria usuário admin com a senha fornecida
      const adminUser = {
        username: 'admin',
        password: await hashPassword('X2pkOsEjaMJQUqOcCBeX')
      };
      
      await db.insert(schema.users).values(adminUser);
      console.log('Usuário admin criado com sucesso!');
    } else {
      console.log('Usuário admin já existe, pulando criação.');
    }
  } catch (error) {
    console.error('Erro ao executar seed:', error);
  }
}

seed();
