#!/bin/bash

# Configuração da porta e segredo da sessão
PORT=5000
SESSION_SECRET="faturai-app-secret-key"
DATABASE_URL="file:./data/faturai.db"

# Exporta as variáveis de ambiente necessárias
export SESSION_SECRET
export PORT
export DATABASE_URL

echo "Iniciando FaturAi na porta $PORT"

# Executa em modo de produção ou desenvolvimento
if [ "$1" == "prod" ]; then
  echo "Modo: Produção"
  NODE_ENV=production node dist/index.js
else
  echo "Modo: Desenvolvimento"
  npm run dev
fi 