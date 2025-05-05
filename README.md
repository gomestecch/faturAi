# FaturAi - Sistema de Análise de Faturamento

Aplicação para análise e categorização de faturas bancárias, com visualização de dados e insights financeiros.

## Funcionalidades

- Importação de faturas em formato CSV
- Categorização automática de transações
- Visualização de gastos por categoria
- Análise temporal de gastos
- Dashboard interativo
- Armazenamento local de dados

## Requisitos

- Node.js v16 ou superior
- npm ou yarn

## Tecnologias

- React
- Node.js
- Express
- TypeScript
- Tailwind CSS
- Chart.js
- SQLite com Drizzle ORM

## Configuração

1. Clone o repositório:
```bash
git clone https://github.com/gomestecch/faturAi.git
cd faturAi
```

2. Instale as dependências:
```bash
npm install
```

## Executando o projeto

O projeto pode ser executado de duas formas:

### Usando o script de inicialização (recomendado)

O script `start.sh` configura automaticamente as variáveis de ambiente necessárias e inicia o servidor na porta 5000:

```bash
# Desenvolvimento
./start.sh

# Produção (após build)
./start.sh prod
```

### Usando os comandos npm

```bash
# Modo de desenvolvimento
npm run start:dev

# Modo de produção
npm run build && npm run start
```

## Estrutura do projeto

- `/client` - Código do frontend (React)
- `/server` - Código do backend (Express)
- `/db` - Configuração e seeds do banco de dados
- `/shared` - Arquivos compartilhados entre cliente e servidor

## Banco de dados

O projeto utiliza Drizzle ORM com SQLite. O banco de dados é armazenado em `/data/faturai.db`.

Para atualizar o schema do banco de dados:

```bash
npm run db:push
```

Para preencher o banco com dados iniciais:

```bash
npm run db:seed
```

## Licença

MIT
