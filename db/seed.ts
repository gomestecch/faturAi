import { db, closeDb } from './index';
import { users, transactions } from '../shared/schema';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function main() {
  console.log('🌱 Iniciando o seed do banco de dados...');

  try {
    // Criar tabelas manualmente se não existirem
    console.log('📊 Criando tabelas se não existirem...');
    
    // SQL para criar a tabela de usuários
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )`);
    
    // SQL para criar a tabela de transações
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      description TEXT NOT NULL,
      amount INTEGER NOT NULL,
      date TEXT NOT NULL,
      category TEXT,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    console.log('✅ Tabelas criadas com sucesso!');
    
    // Verificar se já existem dados para evitar duplicação
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length === 0) {
      console.log('👤 Criando usuário de demonstração...');
      
      // Criar usuário de demonstração
      const demoUser = await db.insert(users).values({
        username: 'demo',
        password: await hashPassword('demo123'),
      }).returning();
      
      console.log(`✅ Usuário criado com ID: ${demoUser[0].id}`);
      
      // Adicionar transações de exemplo para o usuário demo
      const today = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);
      
      console.log('💰 Criando transações de exemplo...');
      
      await db.insert(transactions).values([
        {
          description: 'Supermercado',
          amount: 15000, // R$ 150,00
          date: today.toISOString(),
          category: 'Alimentação',
          userId: demoUser[0].id,
        },
        {
          description: 'Netflix',
          amount: 3990, // R$ 39,90
          date: today.toISOString(),
          category: 'Entretenimento',
          userId: demoUser[0].id,
        },
        {
          description: 'Aluguel',
          amount: 120000, // R$ 1.200,00
          date: lastMonth.toISOString(),
          category: 'Moradia',
          userId: demoUser[0].id,
        },
        {
          description: 'Uber',
          amount: 2500, // R$ 25,00
          date: lastMonth.toISOString(),
          category: 'Transporte',
          userId: demoUser[0].id,
        },
        {
          description: 'Farmácia',
          amount: 8745, // R$ 87,45
          date: today.toISOString(),
          category: 'Saúde',
          userId: demoUser[0].id,
        },
      ]);
      
      console.log('✅ Transações criadas com sucesso!');
    } else {
      console.log('⏭️ Usuários já existem no banco de dados, pulando seed.');
    }
    
    console.log('✨ Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    closeDb();
  }
}

main();
