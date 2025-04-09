// Define shared interfaces used across features/components

export interface Municipio {
    id?: number; // Optional if not always present/needed
    nome: string;
    area_territorial?: number;
    populacao?: number;
    densidade_demografica?: number;
    idhm?: number;
    receitas_brutas?: number;
    despesas_brutas?: number;
    pib_per_capita?: number;
  }
  
  export interface Ano {
    ano: string;
  }
  
  export interface FaqItem {
    question: string;
    answer: string;
  }
  
  // Data structure for state-level expense data
  export interface Despesa {
      nome_municipio?: string; // Might be null/undefined for state level
      codigo_municipio?: string;
      estagio?: string;
      ano: string;
      despesa_total: number;
  }
  
  // Data structure for municipality-level expense data
  export interface DespesaMunicipio extends Despesa {
      nome_municipio: string; // Required for municipality level
  }
  
  // Data structure for state-level educational indicators
  export interface IndicadorEducacional {
      id?: number;
      ibge_id?: number;
      dependencia_id?: number;
      ciclo_id?: string;
      ano: number; // Changed to number based on usage
      ideb: number;
      fluxo: number;
      aprendizado?: number;
      nota_mt: number;
      nota_lp: number;
      nome_municipio?: string; // Might be null/undefined for state level
      dependencia?: string;
  }
  
  // Data structure for municipality-level educational indicators
  export interface IndicadorEducacionalMunicipio extends IndicadorEducacional {
      nome_municipio: string; // Required for municipality level
  }
  
  // Data structure for state-level ENEM averages
  export interface MediaEnem {
    nome?: string; // Might be null/undefined for state level
    media_geral: number;
    media_cn?: number;
    media_ch?: number;
    media_lc?: number;
    media_mt?: number;
    media_red?: number;
    ano: string;
  }
  
  // Data structure for municipality-level ENEM averages
  export interface MediaEnemMunicipio extends MediaEnem {
      nome: string; // Required for municipality level
  }
  
  // Type for the combined filter data used by the dashboard controller/hooks
  export interface DashboardFilterData {
    municipios: Municipio[];
    anos: Ano[];
    mediasEnem: MediaEnemMunicipio[];
    indicadores: IndicadorEducacionalMunicipio[];
    despesasMunicipios: DespesaMunicipio[];
  }
  
  
  // You can add more shared types here as needed
  