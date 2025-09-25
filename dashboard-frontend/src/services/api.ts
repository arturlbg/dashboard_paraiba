import axios from 'axios';
import { Municipio, DespesaMunicipio, MediaEnem, IndicadorEducacional, IndicadorEducacionalMunicipio, Despesa, MediaEnemMunicipio, FaqItem } from '../types'; // Import shared types

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

const handleApiError = (error: unknown, context: string): never => {
  console.error(`Erro ao buscar ${context}:`, error);
  if (axios.isAxiosError(error)) {
    throw new Error(`Erro na API (${error.response?.status || 'Network Error'}) ao buscar ${context}.`);
  }
  throw new Error(`Erro desconhecido ao buscar ${context}.`);
};

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
    const response = await api.get<MediaEnemMunicipio[]>('/enem/medias'); // Assuming this is the correct endpoint for MUNICIPIO level
    return response.data;
  } catch (error) {
    handleApiError(error, 'médias ENEM dos municípios');
  }
}

export async function fetchIndicadoresEducacionais(): Promise<IndicadorEducacionalMunicipio[]> {
  try {
    const response = await api.get<IndicadorEducacionalMunicipio[]>('/municipios/ideb/indicadores'); // Assuming this is the correct endpoint for MUNICIPIO level
    return response.data;
  } catch (error) {
    handleApiError(error, 'indicadores educacionais dos municípios');
  }
}

export async function fetchIndicadoresEducacionaisParaiba(): Promise<IndicadorEducacional[]> {
  try {
    const response = await api.get<IndicadorEducacional[]>('/estados/ideb/indicadores');
    return response.data;
  } catch (error) {
    handleApiError(error, 'indicadores educacionais da Paraíba');
  }
}

export async function fetchDespesasParaiba(): Promise<Despesa[]> {
  try {
    const response = await api.get<Despesa[]>('/estados/despesas');
    return response.data;
  } catch (error) {
    handleApiError(error, 'despesas da Paraíba');
  }
}

export async function fetchMediasEnemParaiba(): Promise<MediaEnem[]> {
  try {
    const response = await api.get<MediaEnem[]>('/enem/medias/estados');
    return response.data;
  } catch (error) {
    handleApiError(error, 'médias ENEM da Paraíba');
  }
}

interface MockDashboardData {
  investimentoEducacao: number;
  idebMedio: number;
  mediaEnemGeral: number;
  evolucaoIdeb?: any;
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
  console.warn("API fetchDashboardData está retornando DADOS MOCKADOS.");
  await new Promise(resolve => setTimeout(resolve, 50)); // simulate 50ms delay

  return {
     investimentoEducacao: 1200000000,
     idebMedio: 4.8,
     mediaEnemGeral: 580.5,
     faqs: [
     ],
     evolucaoIdeb: { series: [{ name: 'IDEB', data: [4.2, 4.4, 4.6, 4.7, 4.8] }], categories: ['2019', '2020', '2021', '2022', '2023'] },
  };
}