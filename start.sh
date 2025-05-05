#!/bin/bash

# Configuração da porta e URL do banco de dados
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/faturai"
SESSION_SECRET="faturai-app-secret-key"

# Exporta as variáveis de ambiente necessárias
export DATABASE_URL
export SESSION_SECRET
export PORT

echo "Iniciando FaturAi na porta $PORT"

# Executa em modo de produção ou desenvolvimento
if [ "$1" == "prod" ]; then
  echo "Modo: Produção"
  NODE_ENV=production node dist/index.js
else
  echo "Modo: Desenvolvimento"
  npm run dev
fi 