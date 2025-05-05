type CategoryDictionary = {
  [category: string]: string[];
};

// Keywords for common expense categories
const categoryKeywords: CategoryDictionary = {
  "Alimentação": [
    "super", "mercado", "merc ", "supermercado", "açougue", "acougue", "padaria", "restaurante", 
    "rest ", "lanchonete", "café", "cafe", "pizza", "food", "comida", "fast food", "delivery",
    "ifood", "rappi", "uber eats", "market", "grill", "burger", "lanches", "bar", "lanche",
    "frutas", "carnes", "pão", "feira", "hortifruti", "sorvete", "sorveteria", "confeitaria",
    "açaí", "acai", "hiper", "polyana", "burguer", "espetos", "multi minas", "armazem", "armazen",
    "nutri", "nutre", "epa", "frisa"
  ],
  "Transporte": [
    "uber", "99", "taxi", "táxi", "cabify", "carona", "metrô", "metro", "ônibus", "onibus",
    "transporte", "brt", "trem", "vlt", "barca", "combustivel", "combustível", "gasolina", "etanol",
    "alcool", "álcool", "diesel", "posto", "estacionamento", "pedágio", "pedagio", "passagem",
    "bilhete", "manutenção", "manutencao", "conserto", "oficina", "auto", "carro", "moto",
    "azul seguro auto", "alianca"
  ],
  "Lazer": [
    "cinema", "teatro", "show", "evento", "ingresso", "ticket", "bilhete", "netflix", "disney",
    "amazon prime", "spotify", "deezer", "streaming", "jogos", "games", "playstation", "xbox",
    "nintendo", "livro", "livraria", "museu", "viagem", "passeio", "parque", "praia", "hotel",
    "pousada", "resort", "airbnb", "hospedagem", "presente", "hobby", "festa", "imperial",
    "amazonprimebr", "amazon"
  ],
  "Saúde": [
    "farmácia", "farmacia", "remédio", "remedio", "medicamento", "drogaria", "médico", "medico",
    "consulta", "exame", "clinica", "clínica", "hospital", "laboratório", "laboratorio", "dentista",
    "psicólogo", "psicologo", "terapia", "fisioterapia", "nutricionista", "plano de saúde",
    "academia", "gym", "fitness", "suplemento", "vitamina", "indiana", "rdsaude", "rd saude",
    "são josé", "sao jose"
  ],
  "Assinaturas e Serviços": [
    "openai", "chatgpt", "netflix", "spotify", "disney+", "amazon prime", "hbo", "globoplay",
    "youtube premium", "apple music", "apple tv", "deezer", "tidal", "paramount+", "crunchyroll",
    "assinatura", "signature", "subscription", "mensalidade", "recorrente", "iof", "seguro",
    "amazonprimebr", "amazon"
  ],
  "Produtos para Pets": [
    "pet", "petshop", "animal", "cachorro", "cão", "cao", "gato", "pássaro", "passaro", "ração",
    "racao", "brinquedo", "veterinário", "veterinario", "banho", "tosa", "medicamento animal",
    "acessório pet", "aquário", "aquario", "petlove"
  ],
  "Vestuário": [
    "roupa", "calçado", "calcado", "sapato", "tênis", "tenis", "camiseta", "camisa", "calça", "calca",
    "blusa", "casaco", "jaqueta", "vestido", "saia", "short", "bermuda", "meia", "lingerie", "cueca",
    "moda", "fashion", "acessório", "acessorio", "bolsa", "carteira", "mochila", "óculos", "oculos",
    "lojas", "amigao", "adidas", "oboticario", "armarinho", "diamantino"
  ],
  "Pagamentos": [
    "pagamento recebido", "transferência recebida", "transferencia recebida", "reembolso", 
    "estorno", "cashback", "devolução", "devolucao", "salário", "salario", "depósito", "deposito"
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
