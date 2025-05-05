// Paleta de cores do Nubank
export const nubankColors = {
  // Cores principais
  primary: '#8A05BE', // Roxo Nubank principal
  primaryLight: '#A43BD6',
  primaryDark: '#7304A0',
  
  // Cores secundárias
  secondary: '#00A4EF', // Azul
  secondaryLight: '#33B4F3',
  secondaryDark: '#0080BA',
  
  // Cores neutras
  background: '#121214', // Background escuro (modo noturno)
  backgroundLight: '#F5F5F7', // Background claro (modo diurno)
  
  // Cores de UI
  success: '#1ABF70', // Verde para sucesso
  warning: '#F5A623', // Amarelo para avisos
  error: '#E73C5E', // Vermelho para erros
  info: '#2C82CB', // Azul para informação
  
  // Gradientes
  gradient: 'linear-gradient(135deg, #8A05BE 0%, #A43BD6 100%)',
  
  // Texto
  textPrimary: '#ffffff', // Branco sobre roxo
  textSecondary: '#121214', // Quase preto
  textTertiary: '#8A8A8E', // Cinza
  
  // Graficos
  chart: {
    main: ['#8A05BE', '#A43BD6', '#7304A0', '#C571ED'],
    secondary: ['#00A4EF', '#33B4F3', '#0080BA', '#66C7F6'],
    accent: ['#1ABF70', '#F5A623', '#E73C5E', '#2C82CB'],
    mixed: ['#8A05BE', '#00A4EF', '#1ABF70', '#F5A623', '#E73C5E', '#7304A0', '#0080BA', '#66C7F6']
  }
};

// Função para obter uma cor aleatória da paleta para gráficos de pizza/donut
export const getRandomChartColor = (set: 'main' | 'secondary' | 'accent' | 'mixed' = 'mixed') => {
  const colors = nubankColors.chart[set];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Função para obter um array de cores baseado na quantidade de dados
export const getChartColors = (count: number, set: 'main' | 'secondary' | 'accent' | 'mixed' = 'mixed'): string[] => {
  const colors = nubankColors.chart[set];
  
  // Se tivermos cores suficientes, use-as
  if (count <= colors.length) {
    return colors.slice(0, count);
  }
  
  // Caso contrário, repita as cores
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  
  return result;
};

// Configuração de tema para charts.js
export const chartJsTheme = {
  color: nubankColors.textTertiary,
  backgroundColor: 'transparent',
  borderColor: nubankColors.primary,
  
  // Configurações específicas de gráficos
  bar: {
    backgroundColor: nubankColors.primary,
    hoverBackgroundColor: nubankColors.primaryLight
  },
  
  line: {
    borderColor: nubankColors.primary,
    pointBackgroundColor: nubankColors.primary,
    pointBorderColor: nubankColors.backgroundLight
  },
  
  pie: {
    backgroundColor: [
      nubankColors.primary,
      nubankColors.secondary,
      nubankColors.success,
      nubankColors.warning,
      nubankColors.error,
      nubankColors.info
    ]
  },
  
  // Dicas gerais para gráficos
  tooltip: {
    backgroundColor: nubankColors.background,
    titleColor: nubankColors.textPrimary,
    bodyColor: nubankColors.textTertiary,
    borderColor: nubankColors.primary,
    borderWidth: 1
  }
}; 