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

export const categoryColors = {
  alimentacao: "#820AD1", // Roxo principal
  moradia: "#A66DD4",     // Roxo mais claro
  transporte: "#00B4D8",  // Azul
  saude: "#06D6A0",       // Verde
  educacao: "#FF9505",    // Laranja
  lazer: "#820AD1",       // Roxo principal
  vestuario: "#A66DD4",   // Roxo mais claro
  servicos: "#00B4D8",    // Azul
  financas: "#06D6A0",    // Verde 
  outros: "#333333",      // Cinza escuro
};

export const defaultCategories: CategoryDefinition[] = [
  {
    id: "alimentacao",
    name: "Alimentação",
    color: categoryColors.alimentacao,
    description: "Gastos com alimentação, incluindo restaurantes, deliveries e supermercados",
    keywords: [
      "restaurante", "ifood", "delivery", "mercado", "supermercado", 
      "padaria", "lanchonete", "fast food", "hamburger", "burguer", "mc donalds",
      "pizza", "sushi", "rappi", "uber eats", "açougue", "cafeteria", "café"
    ]
  },
  {
    id: "moradia",
    name: "Moradia",
    color: categoryColors.moradia,
    description: "Despesas relacionadas à casa como aluguel, condomínio, água, luz e reformas",
    keywords: [
      "aluguel", "condomínio", "água", "luz", "energia", "gás", "iptu", 
      "internet", "reforma", "móveis", "decoração", "manutenção", "limpeza",
      "eletricidade", "casa", "apartamento", "residência"
    ]
  },
  {
    id: "transporte",
    name: "Transporte",
    color: categoryColors.transporte,
    description: "Gastos com transporte público, táxi, aplicativos de mobilidade, combustível e manutenção de veículos",
    keywords: [
      "uber", "99", "táxi", "taxi", "ônibus", "metrô", "trem", "combustível", 
      "gasolina", "etanol", "diesel", "estacionamento", "pedágio", "oficina",
      "manutenção", "seguro", "ipva", "carro", "moto", "bicicleta", "brt", "passagem"
    ]
  },
  {
    id: "saude",
    name: "Saúde",
    color: categoryColors.saude,
    description: "Gastos com plano de saúde, medicamentos, consultas médicas e dentistas",
    keywords: [
      "médico", "consulta", "exame", "plano de saúde", "farmácia", "remédio", 
      "medicamento", "hospital", "dentista", "psicólogo", "terapia", "fisioterapia",
      "academia", "suplemento", "proteína", "vitamina", "odontológico"
    ]
  },
  {
    id: "educacao",
    name: "Educação",
    color: categoryColors.educacao,
    description: "Despesas com mensalidades escolares, cursos, livros e material didático",
    keywords: [
      "escola", "faculdade", "universidade", "curso", "livro", "material", 
      "notebook", "computador", "mensalidade", "matrícula", "biblioteca",
      "udemy", "alura", "idioma", "inglês", "curso online", "educação"
    ]
  },
  {
    id: "lazer",
    name: "Lazer",
    color: categoryColors.lazer,
    description: "Entretenimento, viagens, passeios, assinaturas de streaming e hobbies",
    keywords: [
      "cinema", "teatro", "show", "concerto", "festa", "bar", "balada", 
      "viagem", "hotel", "passeio", "parque", "praia", "netflix", "spotify",
      "amazon", "prime", "disney", "hbo", "ingresso", "jogo", "videogame",
      "hobby", "livro", "música", "ingressos"
    ]
  },
  {
    id: "vestuario",
    name: "Vestuário",
    color: categoryColors.vestuario,
    description: "Roupas, calçados, acessórios e joias",
    keywords: [
      "roupa", "sapato", "tênis", "camisa", "calça", "vestido", "jaqueta", 
      "moda", "loja", "shopping", "renner", "zara", "c&a", "riachuelo",
      "joia", "relógio", "acessório", "bolsa", "mala", "cinto"
    ]
  },
  {
    id: "servicos",
    name: "Serviços e Assinaturas",
    color: categoryColors.servicos,
    description: "Serviços pessoais, assinaturas de software e outras assinaturas regulares",
    keywords: [
      "assinatura", "serviço", "barbeiro", "cabeleireiro", "salão", "manicure", 
      "pedicure", "estética", "maquiagem", "massagem", "spa", "lavanderia",
      "microsoft", "office", "aplicativo", "anual", "mensal", "recorrente"
    ]
  },
  {
    id: "financas",
    name: "Finanças e Investimentos",
    color: categoryColors.financas,
    description: "Investimentos, empréstimos, financiamentos, juros e taxas bancárias",
    keywords: [
      "investimento", "ação", "imposto", "taxa", "juros", "empréstimo", 
      "financiamento", "banco", "seguro", "previdência", "poupança", "tesouro",
      "cdb", "lci", "lca", "fundos", "corretora", "tarifas bancárias"
    ]
  },
  {
    id: "outros",
    name: "Outros",
    color: categoryColors.outros,
    description: "Despesas não classificadas nas demais categorias",
    keywords: [
      "diversos", "outros", "presente", "doação", "caridade", "imprevisto", 
      "emergência", "variados", "miscelânea", "diversos", "avulso", "pagamento"
    ]
  },
];

/**
 * Detecta a categoria de uma descrição de transação
 */
export function detectCategory(description: string): string {
  if (!description) return "outros";
  
  const descLower = description.toLowerCase();
  
  // Verificar correspondência com palavras-chave nas categorias
  for (const category of defaultCategories) {
    for (const keyword of category.keywords) {
      if (descLower.includes(keyword.toLowerCase())) {
        return category.id;
      }
    }
  }
  
  // Categorias específicas para alguns tipos comuns de operações
  if (descLower.includes("supermercado") || 
      descLower.includes("mercado") || 
      descLower.includes("aliment")) {
    return "alimentacao";
  }
  
  if (descLower.includes("uber") || 
      descLower.includes("99") || 
      descLower.includes("táxi") || 
      descLower.includes("taxi")) {
    return "transporte";
  }
  
  if (descLower.includes("farm") || 
      descLower.includes("remed") || 
      descLower.includes("medic") || 
      descLower.includes("hosp")) {
    return "saude";
  }
  
  // Categoria padrão se nenhuma correspondência for encontrada
  return "outros";
}

/**
 * Obtém uma categoria pelo ID
 */
export function getCategoryById(categoryId: string): CategoryDefinition {
  const category = defaultCategories.find(cat => cat.id === categoryId);
  if (!category) {
    return {
      id: "outros",
      name: "Outros",
      color: categoryColors.outros,
      description: "Despesas não classificadas nas demais categorias",
      keywords: []
    };
  }
  return category;
}

/**
 * Obtém a cor de uma categoria pelo ID
 */
export function getCategoryColor(categoryId: string): string {
  const category = defaultCategories.find(cat => cat.id === categoryId);
  return category ? category.color : categoryColors.outros;
}