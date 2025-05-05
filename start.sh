#!/bin/bash

# Configuração da porta - padrão 5000
PORT=5000

# Verifica se a porta já está em uso
while netstat -tuln | grep ":$PORT " > /dev/null; do
  echo "Porta $PORT já está em uso. Tentando a próxima..."
  PORT=$((PORT + 1))
done

echo "Usando porta $PORT para o servidor FaturAi"

# Configura variáveis de ambiente
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/faturai"
export SESSION_SECRET="faturai-app-secret-key"
export PORT=$PORT

# Executa em modo de produção (usando os arquivos de build)
if [ "$1" == "prod" ]; then
  echo "Iniciando em modo de produção na porta $PORT"
  NODE_ENV=production node dist/index.js
else
  # Executa em modo de desenvolvimento
  echo "Iniciando em modo de desenvolvimento na porta $PORT"
  npm run dev
fi 