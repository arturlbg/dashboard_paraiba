import React, { useState, useEffect } from 'react';
import { getDashboardMunicipiosData } from '../hooks/getDashboardMunicipiosData';
import { getMunicipiosFilterData } from '../hooks/getMunicipiosFilterData';
import '../style.css';
import { MediaEnemPorAreaChart } from '../components/charts/MediaEnemPorAreaChart';
import { DesempenhoDisciplinaChart } from '../components/charts/DesempenhoDisciplinaChart';
import { InvestimentoEnemChart } from '../components/charts/InvestimentoEnemChart';
import { ComparativoMediaChart } from '../components/charts/ComparacaoMediaChart';
import { TaxaAprovacaoChart } from '../components/charts/TaxaAprovacaoChart';
import { FaqSection } from '../components/FaqSection';
import Select from '../components/Select';
import { calcularMedias } from '../components/tools/Tools';

//
// ──────────────────────────────────────────────────────────────────────────────
//   >>> Interfaces necessárias <<<
// ──────────────────────────────────────────────────────────────────────────────
//

interface Municipio {
  nome: string;
  populacao: number;
  idhm: number;
  area_territorial: number;
}

interface MediaEnem {
  nome: string;
  ano: string;
  media_geral: number;
  media_lc: number;
  media_ch: number;
  media_cn: number;
  media_mt: number;
  media_red: number;
}

interface Indicador {
  nome_municipio: string;
  ano: string;
  ideb: number;
  fluxo: number;
  nota_mt: number;
  nota_lp: number;
}

interface MunicipioDespesa {
  nome_municipio: string;
  ano: string;
  despesa_total: number;
}

interface Ano {
  ano: string;
}

interface Filter {
  municipios: Municipio[];
  anos: Ano[];
  medias_enem: MediaEnem[];
  indicadores: Indicador[];
  municipios_despesas: MunicipioDespesa[];
}

interface Dashboard {
  faqs: any[]; // Ajuste o tipo real conforme necessidade
}

//
// ──────────────────────────────────────────────────────────────────────────────
//   >>> Componentes de Filtro <<<
// ──────────────────────────────────────────────────────────────────────────────
//

interface MunicipioFiltersProps {
  filter: Filter | null;
  selectedMunicipio: Municipio | null;
  setSelectedMunicipio: (municipio: Municipio) => void;
  selectedAno: string | null;
  setSelectedAno: (ano: string) => void;
}

export const MunicipioFilters: React.FC<MunicipioFiltersProps> = ({
  filter,
  selectedMunicipio,
  setSelectedMunicipio,
  selectedAno,
  setSelectedAno,
}) => {
  if (!filter) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
      <Select
        data={filter.municipios}
        value={selectedMunicipio}
        onChange={(value: Municipio) => setSelectedMunicipio(value)}
        labelKey="nome"
      />
      <Select
        data={[
          { ano: '2019' },
          { ano: '2020' },
          { ano: '2021' },
          { ano: '2022' },
          { ano: '2023' },
        ]}
        value={selectedAno}
        onChange={(value: Ano) => setSelectedAno(value.ano)}
        labelKey="ano"
      />
    </div>
  );
};

//
// ──────────────────────────────────────────────────────────────────────────────
//   >>> Dashboard para Municípios <<<
// ──────────────────────────────────────────────────────────────────────────────
//

interface DashboardMunicipiosProps {
  setLoadingState: (isLoading: boolean) => void;
  selectedMunicipio: Municipio | null;
  setSelectedMunicipio: (municipio: Municipio) => void;
  selectedAno: string | null;
  setSelectedAno: (ano: string) => void;
}

export const DashboardMunicipios: React.FC<DashboardMunicipiosProps> = ({
  setLoadingState,
  selectedMunicipio,
  setSelectedMunicipio,
  selectedAno,
  setSelectedAno,
}) => {
  const [mediaEnem, setMediaEnem] = useState<MediaEnem[] | null>(null);
  const [indicadorIdeb, setIndicadorIdeb] = useState<Indicador[] | null>(null);
  const [municipioDespesa, setMunicipioDespesa] = useState<MunicipioDespesa[] | null>(null);

  // Hooks personalizados para obter dados
  const { filter, isLoadingFilter, filterError } = getMunicipiosFilterData<Filter>();
  const { dashboard, isLoadingDashboard, dashboardError } = getDashboardMunicipiosData<Dashboard>();

  //
  // Controla estado "loading" no componente pai
  //
  useEffect(() => {
    setLoadingState(isLoadingFilter || isLoadingDashboard);
  }, [isLoadingFilter, isLoadingDashboard, setLoadingState]);

  //
  // Processa dados do município selecionado e ano selecionado
  //
  useEffect(() => {
    if (
      !selectedMunicipio ||
      !selectedAno ||
      !filter?.medias_enem ||
      !filter?.indicadores ||
      !filter?.municipios_despesas
    ) {
      return;
    }

    // Filtra médias do ENEM
    const filteredEnem = filter.medias_enem.filter(
      (media) => media.nome === selectedMunicipio.nome && media.ano === selectedAno
    );
    setMediaEnem(filteredEnem);

    // Define qual ano de IDEB mostrar (exemplo de lógica)
    let idebAno = selectedAno;
    if (['2019', '2020'].includes(selectedAno)) {
      idebAno = '2019';
    } else if (['2021', '2022'].includes(selectedAno)) {
      idebAno = '2021';
    }

    // Filtra indicadores IDEB
    const filteredIdeb = filter.indicadores.filter(
      (indicador) =>
        indicador.nome_municipio === selectedMunicipio.nome && indicador.ano == idebAno
    );
    setIndicadorIdeb(filteredIdeb);

    // Filtra despesas
    const filteredDespesas = filter.municipios_despesas.filter(
      (despesa) =>
        despesa.nome_municipio === selectedMunicipio.nome && despesa.ano == selectedAno
    );
    setMunicipioDespesa(filteredDespesas);
  }, [selectedMunicipio, selectedAno, filter]);

  //
  // Trata erros de carregamento
  //
  if (dashboardError || filterError) {
    return <p className="text-red-500">Erro: {dashboardError || filterError}</p>;
  }
  if (!dashboard || !filter) {
    return <p>Nenhum dado disponível.</p>;
  }

  //
  // ──────────────────────────────────────────────────────────────────────────────
  //   >>> Extraindo dados do dashboard e filter (caso necessário) <<<
  // ──────────────────────────────────────────────────────────────────────────────
  //
  const { faqs } = dashboard; // Ajuste conforme precisar de outros campos
  // const { municipios, anos, municipios_despesas } = filter; // Exemplo se quiser usar em outro lugar

  //
  // Helper de formatação de moeda
  //
  const formatCurrency = (value: number): string =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  //
  // Renderiza informações gerais do município
  //
  const renderMunicipioInfo = () => (
    <div className="mt-24 mb-6 bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Informações do Município</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="material-symbols-outlined text-blue-500">location_city</span>
          <p className="text-sm mt-2">População</p>
          <p className="text-lg font-semibold">{selectedMunicipio?.populacao} habitantes</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="material-symbols-outlined text-green-500">trending_up</span>
          <p className="text-sm mt-2">IDH</p>
          <p className="text-lg font-semibold">{selectedMunicipio?.idhm}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="material-symbols-outlined text-purple-500">straighten</span>
          <p className="text-sm mt-2">Área Total</p>
          <p className="text-lg font-semibold">
            {selectedMunicipio?.area_territorial} km²
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="material-symbols-outlined text-orange-500">public</span>
          <p className="text-sm mt-2">Região</p>
          <p className="text-lg font-semibold">Nordeste</p>
        </div>
      </div>
    </div>
  );

  //
  // Renderiza cards com investimento, IDEB e ENEM
  //
  const renderSummaryCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
      {/* Investimento em Educação */}
      <div className="min-h-[440px] max-h-[440px] overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
        <span className="material-symbols-outlined text-blue-500 text-3xl mb-3">payments</span>
        <h3 className="text-lg font-semibold mb-2">Investimento em Educação</h3>
        <p className="text-2xl font-bold mb-4">
          {municipioDespesa?.[0]?.despesa_total
            ? formatCurrency(municipioDespesa[0].despesa_total)
            : 'N/A'}
        </p>
        <div className="flex items-start gap-2 p-3 bg-blue-200/50 rounded-lg">
          <span className="material-symbols-outlined text-blue-600 text-xl mt-1">group</span>
          <p className="text-sm text-gray-600">
            O investimento em educação é proveniente do governo federal,
            proporcional ao número de habitantes.
          </p>
        </div>
      </div>

      {/* IDEB Médio */}
      <div className="min-h-[440px] max-h-[440px] bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
        <span className="material-symbols-outlined text-green-500 text-3xl mb-3">school</span>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Indicadores Educacionais</h3>
          <div className="relative group">
            <span className="material-symbols-outlined text-gray-400 text-lg cursor-help mt-2">
              help
            </span>
            <div className="absolute left-3 p-3 bg-white shadow-lg rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 w-64">
              <p className="text-sm text-gray-700">
                Desempenho do município em métricas oficiais (IDEB, SAEB, etc.).
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {[
            {
              label: 'IDEB',
              value: indicadorIdeb?.[0]?.ideb ?? 'N/A',
              icon: 'analytics',
            },
            {
              label: 'Taxa de Aprovação',
              value:
                indicadorIdeb?.[0]?.fluxo !== undefined
                  ? (indicadorIdeb[0].fluxo * 100).toFixed(1) + '%'
                  : 'N/A',
              icon: 'analytics',
            },
            {
              label: 'SAEB - Matemática',
              value: indicadorIdeb?.[0]?.nota_mt ?? 'N/A',
              icon: 'functions',
            },
            {
              label: 'SAEB - Língua Portuguesa',
              value: indicadorIdeb?.[0]?.nota_lp ?? 'N/A',
              icon: 'menu_book',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="mt-3 flex items-center justify-between gap-2 px-3 py-3 text-sm bg-green-200 rounded-full group transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-2">
                {['2020', '2022'].includes(selectedAno || '') && (
                  <div className="relative group">
                    <span className="material-symbols-outlined text-amber-500 text-sm cursor-help">
                      warning
                    </span>
                    <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-white shadow-lg rounded-lg border border-amber-200
                                    opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                      <p className="text-sm text-gray-700">
                        Informação replicada do ano anterior (realizada a cada 2 anos).
                      </p>
                    </div>
                  </div>
                )}

                <span className="font-semibold bg-green-50 px-2 py-0.5 rounded-full group-hover:bg-green-400 group-hover:text-white transition-colors">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Média ENEM */}
      <div className="min-h-[440px] max-h-[440px] bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
        <span className="material-symbols-outlined text-purple-500 text-3xl mb-3">
          analytics
        </span>
        <h3 className="text-lg font-semibold mb-2">Média ENEM</h3>
        <p className="text-2xl font-bold mb-4">
          {mediaEnem?.[0]?.media_geral?.toFixed(2) ?? 'N/A'}
        </p>

        <div className="flex flex-col gap-2">
          {[
            { label: 'Linguagens', value: mediaEnem?.[0]?.media_lc, icon: 'menu_book' },
            { label: 'Ciências Humanas', value: mediaEnem?.[0]?.media_ch, icon: 'history_edu' },
            { label: 'Ciências da Natureza', value: mediaEnem?.[0]?.media_cn, icon: 'science' },
            { label: 'Matemática', value: mediaEnem?.[0]?.media_mt, icon: 'functions' },
            { label: 'Redação', value: mediaEnem?.[0]?.media_red, icon: 'edit_note' },
          ].map((item, i) => (
            <div
              key={i}
              className="mt-1 flex items-center justify-between gap-2 px-2 py-2 text-sm bg-purple-200 rounded-full group transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              <span className="font-semibold bg-purple-50 px-2 py-0.5 rounded-full group-hover:bg-purple-400 group-hover:text-white transition-colors">
                {item.value !== undefined ? item.value.toFixed(2) : 'N/A'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  //
  // Renderiza os gráficos
  //
  const renderCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* Enem - Média por Área */}
      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">Enem - Média por Área</h3>
        <MediaEnemPorAreaChart
          series={[
            {
              name: 'Média Enem',
              data: mediaEnem
                ? [
                    mediaEnem[0]?.media_cn?.toFixed(2),
                    mediaEnem[0]?.media_ch?.toFixed(2),
                    mediaEnem[0]?.media_lc?.toFixed(2),
                    mediaEnem[0]?.media_mt?.toFixed(2),
                    mediaEnem[0]?.media_red?.toFixed(2),
                  ]
                : [0, 0, 0, 0, 0],
            },
          ]}
          categories={['Natureza', 'Humanas', 'Linguagens', 'Matemática', 'Redação']}
        />
      </div>

      {/* Enem - Desempenho por Disciplina */}
      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">Enem - Desempenho por Disciplina</h3>
        <DesempenhoDisciplinaChart
          series={[
            {
              name: 'Média Enem',
              data: mediaEnem
                ? [
                    mediaEnem[0]?.media_cn?.toFixed(2),
                    mediaEnem[0]?.media_ch?.toFixed(2),
                    mediaEnem[0]?.media_lc?.toFixed(2),
                    mediaEnem[0]?.media_mt?.toFixed(2),
                    mediaEnem[0]?.media_red?.toFixed(2),
                  ]
                : [0, 0, 0, 0, 0],
            },
          ]}
          categories={['Natureza', 'Humanas', 'Linguagens', 'Matemática', 'Redação']}
        />
      </div>

      {/* Enem - Investimento e Média */}
      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">
          Enem - Investimento em Educação e Média
        </h3>
        <InvestimentoEnemChart
          mediasEnem={
            selectedMunicipio
              ? filter.medias_enem.filter(
                  (media) => media.nome === selectedMunicipio.nome
                )
              : []
          }
          despesas={
            selectedMunicipio
              ? filter.municipios_despesas.filter(
                  (despesa) => despesa.nome_municipio === selectedMunicipio.nome
                )
              : []
          }
        />
      </div>

      {/* Enem - Município vs Paraíba */}
      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">
          Enem - Média do Município vs Média da Paraíba
        </h3>
        <ComparativoMediaChart
          mediasMunicipio={calcularMedias(
            selectedMunicipio && selectedAno
              ? filter.medias_enem.filter(
                  (media) => media.nome === selectedMunicipio.nome && media.ano === selectedAno
                )
              : []
          )}
          mediasParaiba={calcularMedias(filter.medias_enem)}
          chaves={['media_cn', 'media_ch', 'media_lc', 'media_mt', 'media_red']}
          categoriasX={[
            'Ciências da Natureza',
            'Ciências Humanas',
            'Linguagens',
            'Matemática',
            'Redação',
          ]}
        />
      </div>

      {/* SAEB - Município vs Paraíba */}
      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">
          SAEB - Média do Município vs Média da Paraíba
        </h3>
        <ComparativoMediaChart
          mediasMunicipio={calcularMedias(
            selectedMunicipio
              ? filter.indicadores.filter((indicador) => {
                  // Lógica de adequar o ano SAEB
                  let idebAno = selectedAno;
                  if (['2019', '2020'].includes(selectedAno || '')) idebAno = '2019';
                  else if (['2021', '2022'].includes(selectedAno || '')) idebAno = '2021';

                  return (
                    indicador.nome_municipio === selectedMunicipio.nome &&
                    indicador.ano === idebAno
                  );
                })
              : []
          )}
          mediasParaiba={calcularMedias(filter.indicadores)}
          chaves={['nota_mt', 'nota_lp', 'ideb']}
          categoriasX={['Matemática', 'Língua Portuguesa', 'IDEB']}
        />
      </div>

      {/* Taxa de Aprovação */}
      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">Taxa de Aprovação</h3>
        <TaxaAprovacaoChart
          data={
            selectedMunicipio
              ? filter.indicadores.filter(
                  (indicador) => indicador.nome_municipio === selectedMunicipio.nome
                )
              : []
          }
        />
      </div>
    </div>
  );

  //
  // Render final
  //
  return (
    <>
      {renderMunicipioInfo()}
      {renderSummaryCards()}
      {renderCharts()}
      <FaqSection faqs={faqs} />
    </>
  );
};
