/**
 * Categorias padrão seguindo as melhores práticas de finanças pessoais
 */

export interface CategoryDefinition {
  id: string;
  name: string;
  color: string;
  description: string;
  keywords: string[];
}

// Paleta de cores acessível que segue as heurísticas de Nielsen para distinção visual
// Cores contrastantes que podem ser distinguidas mesmo com daltonismo
export const categoryColors = {
  housing: "#8E24AA", // Roxo (Nubank)
  food: "#43A047", // Verde
  transportation: "#1E88E5", // Azul
  entertainment: "#FFB300", // Amarelo
  shopping: "#D81B60", // Rosa
  health: "#00897B", // Verde azulado
  education: "#3949AB", // Azul escuro
  finance: "#F4511E", // Laranja
  personal: "#6D4C41", // Marrom
  utilities: "#5E35B1", // Roxo
  travel: "#039BE5", // Azul claro
  other: "#757575", // Cinza
};

// Categorias padrão com exemplos e palavras-chave para detecção automática
export const defaultCategories: CategoryDefinition[] = [
  {
    id: "moradia",
    name: "Moradia",
    color: categoryColors.housing,
    description: "Aluguel, condomínio, IPTU, reformas, etc.",
    keywords: ["aluguel", "condomínio", "iptu", "reforma", "apartamento", "casa", "imóvel", "prestação"]
  },
  {
    id: "alimentacao",
    name: "Alimentação",
    color: categoryColors.food,
    description: "Supermercado, restaurantes, delivery, etc.",
    keywords: ["restaurante", "ifood", "supermercado", "mercado", "lanchonete", "pizzaria", "delivery", "padaria", "açougue", "hortifruti"]
  },
  {
    id: "transporte",
    name: "Transporte",
    color: categoryColors.transportation,
    description: "Combustível, transporte público, aplicativos, manutenção, etc.",
    keywords: ["uber", "99", "gasolina", "combustível", "estacionamento", "metrô", "ônibus", "táxi", "pedágio", "oficina", "mecânico"]
  },
  {
    id: "lazer",
    name: "Lazer",
    color: categoryColors.entertainment,
    description: "Cinema, shows, streaming, jogos, etc.",
    keywords: ["cinema", "teatro", "show", "netflix", "spotify", "ingresso", "disney+", "prime", "jogos", "parque", "bar", "balada"]
  },
  {
    id: "compras",
    name: "Compras",
    color: categoryColors.shopping,
    description: "Roupas, calçados, eletrônicos, etc.",
    keywords: ["lojas", "shopping", "vestuário", "roupa", "calçado", "eletrônico", "celular", "amazon", "magazine", "americanas", "zara", "renner"]
  },
  {
    id: "saude",
    name: "Saúde",
    color: categoryColors.health,
    description: "Convênio, consultas, medicamentos, etc.",
    keywords: ["hospital", "médico", "farmácia", "remédio", "drogaria", "consulta", "exame", "dentista", "psicólogo", "terapia", "academia"]
  },
  {
    id: "educacao",
    name: "Educação",
    color: categoryColors.education,
    description: "Mensalidade, cursos, livros, etc.",
    keywords: ["faculdade", "escola", "curso", "livro", "material", "educação", "ensino", "universidade", "diploma", "mensalidade"]
  },
  {
    id: "financas",
    name: "Finanças",
    color: categoryColors.finance,
    description: "Juros, tarifas, investimentos, etc.",
    keywords: ["tarifa", "juros", "empréstimo", "financiamento", "seguro", "banco", "imposto", "taxa", "multa", "parcela"]
  },
  {
    id: "pessoal",
    name: "Cuidados Pessoais",
    color: categoryColors.personal,
    description: "Higiene, beleza, etc.",
    keywords: ["salão", "cabelo", "barbeiro", "manicure", "perfume", "maquiagem", "cosmético", "spa", "estética"]
  },
  {
    id: "utilidades",
    name: "Utilidades",
    color: categoryColors.utilities,
    description: "Água, luz, internet, telefone, etc.",
    keywords: ["conta de luz", "conta de água", "internet", "telefone", "celular", "gás", "tv", "contas", "energia"]
  },
  {
    id: "viagem",
    name: "Viagem",
    color: categoryColors.travel,
    description: "Passagens, hospedagem, passeios, etc.",
    keywords: ["passagem", "hotel", "hospedagem", "airbnb", "viagem", "resort", "excursão", "turismo", "pousada"]
  },
  {
    id: "assinaturas",
    name: "Assinaturas e Serviços",
    color: "#7B1FA2", // Roxo escuro
    description: "Assinaturas de serviços recorrentes",
    keywords: ["assinatura", "mensalidade", "recorrente", "serviço", "clube", "signature"]
  },
  {
    id: "pets",
    name: "Pets",
    color: "#D32F2F", // Vermelho
    description: "Despesas com animais de estimação",
    keywords: ["pet", "animal", "veterinário", "petshop", "ração", "aquário", "gato", "cachorro"]
  },
  {
    id: "outros",
    name: "Outros",
    color: categoryColors.other,
    description: "Gastos que não se encaixam nas categorias anteriores",
    keywords: []
  }
];

// Função para detectar a categoria com base na descrição
export function detectCategory(description: string): string {
  if (!description) return "outros";
  
  const normalizedDesc = description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  for (const category of defaultCategories) {
    for (const keyword of category.keywords) {
      if (normalizedDesc.includes(keyword.toLowerCase())) {
        return category.id;
      }
    }
  }
  
  return "outros";
}

// Retorna a definição completa de uma categoria pelo ID
export function getCategoryById(categoryId: string): CategoryDefinition {
  const category = defaultCategories.find(cat => cat.id === categoryId);
  return category || defaultCategories[defaultCategories.length - 1]; // Retorna "Outros" se não encontrar
}

// Obtém a cor de uma categoria pelo ID
export function getCategoryColor(categoryId: string): string {
  const category = getCategoryById(categoryId);
  return category.color;
}