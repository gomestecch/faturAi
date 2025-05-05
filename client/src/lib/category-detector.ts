type CategoryDictionary = {
  [category: string]: string[];
};

// Keywords for common expense categories
const categoryKeywords: CategoryDictionary = {
  "Alimentação": [
    "super", "mercado", "merc ", "supermercado", "açougue", "acougue", "padaria", "restaurante", 
    "rest ", "lanchonete", "café", "cafe", "pizza", "food", "comida", "fast food", "delivery",
    "ifood", "rappi", "uber eats", "market", "grill", "burger", "lanches", "bar", "lanche",
    "frutas", "carnes", "pão", "feira", "hortifruti", "sorvete", "sorveteria", "confeitaria"
  ],
  "Transporte": [
    "uber", "99", "taxi", "táxi", "cabify", "carona", "metrô", "metro", "ônibus", "onibus",
    "transporte", "brt", "trem", "vlt", "barca", "combustivel", "combustível", "gasolina", "etanol",
    "alcool", "álcool", "diesel", "posto", "estacionamento", "pedágio", "pedagio", "passagem",
    "bilhete", "manutenção", "manutencao", "conserto", "oficina", "auto", "carro", "moto"
  ],
  "Lazer": [
    "cinema", "teatro", "show", "evento", "ingresso", "ticket", "bilhete", "netflix", "disney",
    "amazon prime", "spotify", "deezer", "streaming", "jogos", "games", "playstation", "xbox",
    "nintendo", "livro", "livraria", "museu", "viagem", "passeio", "parque", "praia", "hotel",
    "pousada", "resort", "airbnb", "hospedagem", "presente", "hobby", "festa"
  ],
  "Saúde": [
    "farmácia", "farmacia", "remédio", "remedio", "medicamento", "drogaria", "médico", "medico",
    "consulta", "exame", "clinica", "clínica", "hospital", "laboratório", "laboratorio", "dentista",
    "psicólogo", "psicologo", "terapia", "fisioterapia", "nutricionista", "plano de saúde",
    "academia", "gym", "fitness", "suplemento", "vitamina"
  ],
  "Educação": [
    "escola", "colégio", "colegio", "universidade", "faculdade", "facul", "curso", "livro didático",
    "material escolar", "mensalidade", "matrícula", "matricula", "educação", "educacao", "ensino",
    "certificado", "diploma", "especialização", "especializacao", "palestra", "workshop", "treinamento"
  ],
  "Moradia": [
    "aluguel", "condomínio", "condominio", "prestação", "prestacao", "financiamento", "imobiliária",
    "imobiliaria", "luz", "energia", "elétrica", "eletrica", "água", "agua", "gás", "gas", "internet",
    "tv a cabo", "telefone", "móveis", "moveis", "decoração", "decoracao", "reforma", "construção",
    "construcao", "material", "iptu", "seguro residencial"
  ],
  "Vestuário": [
    "roupa", "calçado", "calcado", "sapato", "tênis", "tenis", "camiseta", "camisa", "calça", "calca",
    "blusa", "casaco", "jaqueta", "vestido", "saia", "short", "bermuda", "meia", "lingerie", "cueca",
    "moda", "fashion", "acessório", "acessorio", "bolsa", "carteira", "mochila", "óculos", "oculos"
  ]
};

// Detect category based on transaction description
export function detectCategory(description: string): string {
  if (!description) return "Outros";
  
  const lowerDesc = description.toLowerCase();
  
  // Check each category's keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  // Default category if no match found
  return "Outros";
}
