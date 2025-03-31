import React, { useEffect, useState } from 'react';
import '../style.css';
import Select from '../components/Select';
import { FaqSection } from '../components/FaqSection';
import { getMunicipiosFilterData } from '../hooks/getMunicipiosFilterData';
import { getDashboardMunicipiosData } from '../hooks/getDashboardMunicipiosData';

//
// ──────────────────────────────────────────────────────────────────────────────
//   >>> Tipos <<<
// ──────────────────────────────────────────────────────────────────────────────
//

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
  ano: string;
  ideb: number;
  fluxo: number;
  nota_mt: number;
  nota_lp: number;
}

interface MunicipioDespesa {
  ano: string;
  despesa_total: number;
}

interface Ano {
  ano: string;
}

interface Filter {
  medias_enem: MediaEnem[];
  indicadores: Indicador[];
  municipios_despesas: MunicipioDespesa[];
}

interface Dashboard {
  faqs: any[]; // tipa conforme a estrutura real de FAQ, se quiser
}

//
// ──────────────────────────────────────────────────────────────────────────────
//   >>> Filtro de Período (Componente) <<<
// ──────────────────────────────────────────────────────────────────────────────
//

interface PeriodoFilterProps {
  filter: Filter | null;
  selectedAno: string | null;
  setSelectedAno: (ano: string) => void;
}

export const PeriodoFilter: React.FC<PeriodoFilterProps> = ({
  filter,
  selectedAno,
  setSelectedAno,
}) => {
  if (!filter) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
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

interface DashboardParaibaProps {
  setLoadingState: (isLoading: boolean) => void;
  selectedAno: string | null;
  setSelectedAno: (ano: string) => void;
}

export const DashboardParaiba: React.FC<DashboardParaibaProps> = ({
  setLoadingState,
  selectedAno,
  setSelectedAno,
}) => {
  const [mediaEnem, setMediaEnem] = useState<MediaEnem[] | null>(null);
  const [indicadorIdeb, setIndicadorIdeb] = useState<Indicador[] | null>(null);
  const [municipioDespesa, setMunicipioDespesa] = useState<MunicipioDespesa[] | null>(null);

  const { filter, isLoadingFilter, filterError } = getMunicipiosFilterData<Filter>();
  const { dashboard, isLoadingDashboard, dashboardError } = getDashboardMunicipiosData<Dashboard>();

  useEffect(() => {
    setLoadingState(isLoadingFilter || isLoadingDashboard);
  }, [isLoadingFilter, isLoadingDashboard, setLoadingState]);

  useEffect(() => {
    if (!selectedAno || !filter) return;

    setMediaEnem(filter.medias_enem.filter((m) => m.ano == selectedAno));

    let idebAno: string = selectedAno;
    if (selectedAno === '2020') idebAno = '2019';
    if (selectedAno === '2022') idebAno = '2021';

    setIndicadorIdeb(filter.indicadores.filter((i) => i.ano == idebAno));

    setMunicipioDespesa(filter.municipios_despesas.filter((d) => d.ano == selectedAno));
  }, [selectedAno, filter]);

  if (dashboardError || filterError) {
    return <p className="text-red-500">Erro: {dashboardError || filterError}</p>;
  }

  if (!dashboard || !filter) {
    return <p>Nenhum dado disponível.</p>;
  }

  //
  // ──────────────────────────────────────────────────────────────────────────────
  //   >>> Funções e helpers específicos desta tela <<<
  // ──────────────────────────────────────────────────────────────────────────────
  //

  const formatCurrency = (value: number): string =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const renderEstadoInfo = () => (
    <div className="mt-24 mb-6 bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Informações da Paraíba</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="material-symbols-outlined text-blue-500">location_city</span>
          <p className="text-sm mt-2">População</p>
          <p className="text-lg font-semibold">{"3.974.687"} habitantes</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="material-symbols-outlined text-green-500">trending_up</span>
          <p className="text-sm mt-2">IDH</p>
          <p className="text-lg font-semibold">{"0.698"}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="material-symbols-outlined text-purple-500">straighten</span>
          <p className="text-sm mt-2">Área Total</p>
          <p className="text-lg font-semibold">{"56.467,242"} km²</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="material-symbols-outlined text-orange-500">public</span>
          <p className="text-sm mt-2">Região</p>
          <p className="text-lg font-semibold">Nordeste</p>
        </div>
      </div>
    </div>
  );

  const renderSummaryCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
      {/* Investimento em Educação */}
      <div className="min-h-[440px] max-h-[440px] overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
        <span className="material-symbols-outlined text-blue-500 text-3xl mb-3">
          payments
        </span>
        <h3 className="text-lg font-semibold mb-2">Investimento em Educação</h3>
        <p className="text-2xl font-bold mb-4">
          {municipioDespesa?.[0]?.despesa_total
            ? formatCurrency(municipioDespesa[0].despesa_total)
            : 'N/A'}
        </p>
        <div className="flex items-start gap-2 p-3 bg-blue-200/50 rounded-lg">
          <span className="material-symbols-outlined text-blue-600 text-xl mt-1">group</span>
          <p className="text-sm text-gray-600">
            O investimento em educação é proveniente do governo federal, é
            proporcional ao número de habitantes
          </p>
        </div>
      </div>

      {/* IDEB Médio */}
      <div className="min-h-[440px] max-h-[440px] bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
        <span className="material-symbols-outlined text-green-500 text-3xl mb-3">
          school
        </span>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Indicadores Educacionais</h3>
          <div className="relative group">
            <span className="material-symbols-outlined text-gray-400 text-lg cursor-help mt-2">
              help
            </span>
            <div className="absolute left-3 p-3 bg-white shadow-lg rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 w-64">
              <p className="text-sm text-gray-700">
                Indicadores que mostram o desempenho educacional (IDEB, SAEB, etc.).
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
          ].map((item, index) => (
            <div
              key={index}
              className="mt-3 flex items-center justify-between gap-2 px-3 py-3 text-sm bg-green-200 rounded-full transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Exemplo de warning para anos específicos */}
                {['2020', '2022'].includes(selectedAno || '') && (
                  <div className="relative group">
                    <span className="material-symbols-outlined text-amber-500 text-sm cursor-help">
                      warning
                    </span>
                    <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-white shadow-lg rounded-lg border border-amber-200
                                    opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                      <p className="text-sm text-gray-700">
                        Essa informação é replicada do ano anterior, pois só é realizada a cada dois anos.
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
          ].map((item, index) => (
            <div
              key={index}
              className="mt-1 flex items-center justify-between gap-2 px-2 py-2 text-sm bg-purple-200 rounded-full transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform duration-300">
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
  // Render final do componente
  //
  return (
    <>
      {renderEstadoInfo()}
      {renderSummaryCards()}
      <FaqSection faqs={dashboard.faqs} />
    </>
  );
};
