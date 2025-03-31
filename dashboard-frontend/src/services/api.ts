import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';
//autenticacao ???
const api = axios.create({
    baseURL: API_BASE_URL,
});

export async function fetchMunicipios() {
  try {
    const response = await api.get('/municipios');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar municípios:', error);
    throw error;
  }
}

export async function fetchMunicipiosDespesas() {
  try {
    const response = await api.get('/municipios/despesas');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar despesas dos municípios:', error);
    throw error;
  }
}

export async function fetchMediasEnemAgrupadaMunicipio() {
  try {
    const response = await api.get('/enem/medias');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar médias enem:', error);
    throw error;
  }
}

export async function fetchIndicadoresEducacionais() {
  try {
    const response = await api.get('/municipios/ideb/indicadores');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar indicadores educacionais:', error);
    throw error;
  }
}

export async function fetchIndicadoresEducacionaisParaiba() {
  try {
    const response = await api.get('/estados/ideb/indicadores');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar indicadores educacionais da paraíba:', error);
    throw error;
  }
}

export async function fetchDashboardData() {
  return {
    investimentoEducacao: 1200000000, // R$ 1.2B
    idebMedio: 4.8,
    mediaEnemGeral: 580.5,
    evolucaoIdeb: {
      series: [
        {
          name: 'IDEB',
          data: [4.2, 4.4, 4.6, 4.7, 4.8],
        },
      ],
      categories: ['2019', '2020', '2021', '2022', '2023'],
    },

    investimentoDesempenho: {
      series: [
        {
          name: 'Municípios',
          data: [
            [800000, 4.5],
            [1200000, 4.8],
            [1500000, 5.2],
            [2000000, 5.5],
          ],
        },
      ],
    },

    distribuicaoRecursos: {
      series: [40, 25, 20, 15],
      labels: ['Infraestrutura', 'Capacitação', 'Material Didático', 'Outros'],
    },

    desempenhoDisciplina: {
      series: [
        {
          name: 'Pontuação',
          data: [80, 75, 85, 70, 78],
        },
      ],
      categories: ['Português', 'Matemática', 'Ciências', 'História', 'Geografia'],
    },

    evasao: {
      series: [
        {
          name: 'Taxa de Evasão',
          data: [12, 10, 8, 7, 6],
        },
      ],
      categories: ['2019', '2020', '2021', '2022', '2023'],
    },

    comparacaoIdeb: {
      series: [
        {
          name: 'IDEB',
          data: [4.8, 4.6, 4.5, 4.3, 4.2],
        },
      ],
      categories: ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux'],
    },

    mediaEnemPorArea: {
      series: [
        {
          name: 'Média',
          data: [600, 550, 580, 650], // Humanas, Exatas, Linguagens, Redação
        },
      ],
      categories: ['Humanas', 'Exatas', 'Linguagens', 'Redação'],
    },

    gastosPopulacao: {
      series: [
        {
          name: 'Gastos (Milhões R$)',
          data: [800, 900, 1000, 1100, 1200],
        },
        {
          name: 'Estudantes (Milhares)',
          data: [150, 155, 158, 160, 165],
        },
      ],
      categories: ['2019', '2020', '2021', '2022', '2023'],
    },

    // Perguntas e respostas (caso queira mockar também)
    faqs: [
      {
        question: 'Qual a porcentagem de gastos com a educação comparado ao total?',
        answer:
          'O município investe 18% do seu orçamento total em educação, seguindo as diretrizes constitucionais que estabelecem um mínimo de 25% das receitas de impostos.',
      },
      {
        question: 'Quais disciplinas apresentam maior crescimento de desempenho no último triênio?',
        answer:
          'Matemática e Ciências apresentaram o maior crescimento, com aumento de 15% e 12% respectivamente nas notas médias dos estudantes.',
      },
      {
        question: 'Como a média do ENEM se relaciona com a evolução do IDEB?',
        answer:
          'Existe uma correlação positiva forte (0.85) entre o IDEB e as médias do ENEM, indicando que melhorias no ensino fundamental impactam positivamente o desempenho no ensino médio.',
      },
      {
        question: 'Quais estratégias podem ser adotadas para melhorar o IDEB em Matemática?',
        answer:
          'As principais estratégias incluem investimento em capacitação docente, implementação de metodologias ativas de ensino e reforço escolar direcionado.',
      },
      {
        question: 'Como comparar o investimento per capita em educação entre diferentes municípios?',
        answer:
          'O investimento per capita é calculado dividindo o total de recursos investidos pelo número de estudantes, permitindo uma comparação mais justa entre municípios de diferentes portes.',
      },
    ],
  }
}
