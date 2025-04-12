import axios from 'axios';
import { Municipio, DespesaMunicipio, MediaEnem, IndicadorEducacional, IndicadorEducacionalMunicipio, Despesa, MediaEnemMunicipio, FaqItem } from '../types'; // Import shared types

// Ensure this matches your actual backend URL
const API_BASE_URL = 'https://dashboard-paraiba.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Add other default headers if needed, e.g., Authorization
  }
});

// Helper function for error handling
const handleApiError = (error: unknown, context: string): never => {
  console.error(`Erro ao buscar ${context}:`, error);
  if (axios.isAxiosError(error)) {
    // Handle specific Axios errors (e.g., network error, 404, 500)
    throw new Error(`Erro na API (${error.response?.status || 'Network Error'}) ao buscar ${context}.`);
  }
  throw new Error(`Erro desconhecido ao buscar ${context}.`);
};

// --- API Functions with Typing ---

export async function fetchMunicipios(): Promise<Municipio[]> {
  try {
    const response = await api.get<Municipio[]>('/municipios');
    return response.data;
  } catch (error) {
    handleApiError(error, 'municípios');
  }
}

export async function fetchMunicipiosDespesas(): Promise<DespesaMunicipio[]> {
  try {
    const response = await api.get<DespesaMunicipio[]>('/municipios/despesas');
    return response.data;
  } catch (error) {
    handleApiError(error, 'despesas dos municípios');
  }
}

export async function fetchMediasEnemAgrupadaMunicipio(): Promise<MediaEnemMunicipio[]> {
  try {
    // Ensure the endpoint returns data matching MediaEnemMunicipio[]
    const response = await api.get<MediaEnemMunicipio[]>('/enem/medias'); // Assuming this is the correct endpoint for MUNICIPIO level
    return response.data;
  } catch (error) {
    handleApiError(error, 'médias ENEM dos municípios');
  }
}

export async function fetchIndicadoresEducacionais(): Promise<IndicadorEducacionalMunicipio[]> {
  try {
     // Ensure the endpoint returns data matching IndicadorEducacionalMunicipio[]
    const response = await api.get<IndicadorEducacionalMunicipio[]>('/municipios/ideb/indicadores'); // Assuming this is the correct endpoint for MUNICIPIO level
    return response.data;
  } catch (error) {
    handleApiError(error, 'indicadores educacionais dos municípios');
  }
}

export async function fetchIndicadoresEducacionaisParaiba(): Promise<IndicadorEducacional[]> {
  try {
    // Ensure the endpoint returns data matching IndicadorEducacional[] (state level)
    const response = await api.get<IndicadorEducacional[]>('/estados/ideb/indicadores');
    return response.data;
  } catch (error) {
    handleApiError(error, 'indicadores educacionais da Paraíba');
  }
}

export async function fetchDespesasParaiba(): Promise<Despesa[]> {
  try {
     // Ensure the endpoint returns data matching Despesa[] (state level)
    const response = await api.get<Despesa[]>('/estados/despesas');
    return response.data;
  } catch (error) {
    handleApiError(error, 'despesas da Paraíba');
  }
}

export async function fetchMediasEnemParaiba(): Promise<MediaEnem[]> {
  try {
     // Ensure the endpoint returns data matching MediaEnem[] (state level)
    const response = await api.get<MediaEnem[]>('/enem/medias/estados');
    return response.data;
  } catch (error) {
    handleApiError(error, 'médias ENEM da Paraíba');
  }
}

// --- Mock Data Function (Kept for reference, but ideally removed if backend is live) ---

// Define the return type explicitly based on the hook that uses it
interface MockDashboardData {
  investimentoEducacao: number;
  idebMedio: number;
  mediaEnemGeral: number;
  evolucaoIdeb?: any; // Keep 'any' or use Apex types if stable
  investimentoDesempenho?: any;
  distribuicaoRecursos?: { series: number[]; labels: string[] };
  desempenhoDisciplina?: { series: any; categories: string[] };
  evasao?: any;
  comparacaoIdeb?: { series: any; categories: string[] };
  mediaEnemPorArea?: { series: any; categories: string[] };
  gastosPopulacao?: any;
  faqs: FaqItem[];
}


export async function fetchDashboardData(): Promise<MockDashboardData> {
  console.warn("API fetchDashboardData está retornando DADOS MOCKADOS."); // Add a warning
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate 50ms delay

  return {
    // ... (mock data remains the same as provided) ...
     investimentoEducacao: 1200000000, // R$ 1.2B
     idebMedio: 4.8,
     mediaEnemGeral: 580.5,
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
       // ... other FAQs
     ],
     // Add other mock chart data structures if needed by useMunicipiosDashboardData
     evolucaoIdeb: { series: [{ name: 'IDEB', data: [4.2, 4.4, 4.6, 4.7, 4.8] }], categories: ['2019', '2020', '2021', '2022', '2023'] },
     // ... etc
  };
}