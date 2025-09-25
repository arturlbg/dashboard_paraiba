export interface Municipio {
    id?: number; 
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
  
  export interface Despesa {
      nome_municipio?: string;
      codigo_municipio?: string;
      estagio?: string;
      ano: string;
      despesa_total: number;
  }
  
  export interface DespesaMunicipio extends Despesa {
      nome_municipio: string;
  }
  
  export interface IndicadorEducacional {
      id?: number;
      ibge_id?: number;
      dependencia_id?: number;
      ciclo_id?: string;
      ano: number; 
      ideb: number;
      fluxo: number;
      aprendizado?: number;
      nota_mt: number;
      nota_lp: number;
      nome_municipio?: string;
      dependencia?: string;
  }
  
  export interface IndicadorEducacionalMunicipio extends IndicadorEducacional {
      nome_municipio: string;
  }
  
  export interface MediaEnem {
    nome?: string;
    media_geral: number;
    media_cn?: number;
    media_ch?: number;
    media_lc?: number;
    media_mt?: number;
    media_red?: number;
    ano: string;
  }
  
  export interface MediaEnemMunicipio extends MediaEnem {
      nome: string;
  }
  
  export interface DashboardFilterData {
    municipios: Municipio[];
    anos: Ano[];
    mediasEnem: MediaEnemMunicipio[];
    indicadores: IndicadorEducacionalMunicipio[];
    despesasMunicipios: DespesaMunicipio[];
  }