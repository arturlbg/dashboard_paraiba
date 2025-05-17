import React, { useEffect, useMemo } from 'react';
import { FaqSection } from '../../components/ui/FaqSection'; // Corrected path
import { useMunicipiosDashboardData } from '../municipios/hooks/useMunicipiosDashboardData'; // Used for FAQs only
import { useParaibaData } from './hooks/useParaibaData'; // Corrected path
import { InvestimentoEducacaoChart } from './components/charts/InvestimentoEducacaoChart'; // Corrected path
import { TopMunicipiosInvestimentoChart } from './components/charts/TopMunicipiosInvestimentoChart'; // Corrected path
import { IdebChart } from './components/charts/IdebChart'; // Corrected path
import { TopMunicipiosMediaIdebChart } from './components/charts/TopMunicipiosMediaIdebChart'; // Corrected path
import { TopMunicipiosMediaEnemChart } from './components/charts/TopMunicipiosMediaEnemChart'; // Corrected path
import { EvolucaoMediaGeralEnemChart } from './components/charts/EvolucaoMediaGeralEnemChart'; // Corrected path
import { ParaibaMapChart } from './components/charts/ParaibaMapChart'; // Corrected path
import TopMunicipiosIdebChart from './components/charts/TopMunicipiosIdebChart'; // Import default export
import {
  IndicadorEducacional,
  Despesa,
  MediaEnem,
  IndicadorEducacionalMunicipio,
  DespesaMunicipio,
  MediaEnemMunicipio,
  FaqItem,
} from '../../types'; // Import types

// Define the structure for the map data
interface IdebDataMap {
  [ano: string]: {
    [municipio: string]: number;
  };
}

interface DashboardParaibaProps {
  setLoadingState: (isLoading: boolean) => void;
  selectedAno: string | null;
  // setSelectedAno removed - handled by controller
}

// Renamed component
export const ParaibaDashboard: React.FC<DashboardParaibaProps> = ({
  setLoadingState,
  selectedAno,
}) => {
  // --- Fetching Data ---
  const { data, isLoading: isLoadingParaibaData, error: dataError } = useParaibaData();
  // Fetch dashboard meta‑data (like FAQs)
  const {
    dashboardData: dashboardMeta,
    isLoading: isLoadingMeta,
    error: metaError,
  } = useMunicipiosDashboardData(); // Reusing hook if FAQs are common

  // --- Combined Loading State ---
  useEffect(() => {
    setLoadingState(isLoadingParaibaData || isLoadingMeta);
  }, [isLoadingParaibaData, isLoadingMeta, setLoadingState]);

  // --- Memoized Data Processing for Map ---
  const processedIdebDataForMap = useMemo((): IdebDataMap => {
    const idebMap: IdebDataMap = {};
    data?.indicadoresMunicipios?.forEach((indicador) => {
      // Determine the correct year for the map key (biennial data)
      let mapYear = String(indicador.ano);

      // A nota de 2019 cobre 2019 e 2020; 2021 cobre 2021 e 2022
      const dataYears = [mapYear];
      if (mapYear === '2019') dataYears.push('2020');
      if (mapYear === '2021') dataYears.push('2022');

      dataYears.forEach((yearKey) => {
        if (!idebMap[yearKey]) idebMap[yearKey] = {};
        if (
          indicador.nome_municipio &&
          typeof indicador.ideb === 'number' &&
          !isNaN(indicador.ideb)
        ) {
          idebMap[yearKey][indicador.nome_municipio] = indicador.ideb;
        }
      });
    });
    return idebMap;
  }, [data?.indicadoresMunicipios]);

  // --- Filtered Data for Summary Cards ---
  const summaryData = useMemo(() => {
    if (!selectedAno || !data)
      return {
        indicador: null,
        despesa: null,
        mediaEnem: null,
        idebAnoUtilizado: selectedAno,
      };

    // Determine the actual data year for biennial indicators
    let idebDataYear = selectedAno;
    const isEvenYear = parseInt(selectedAno) % 2 === 0;
    if (isEvenYear && parseInt(selectedAno) >= 2020) {
      idebDataYear = String(parseInt(selectedAno) - 1);
    }

    const indicador =
      data.indicadoresParaiba?.find((i) => String(i.ano) === idebDataYear) || null;
    const despesa = data.despesasParaiba?.find((d) => d.ano === selectedAno) || null;
    const mediaEnem =
      data.mediasEnemParaiba?.find((e) => e.ano === selectedAno) || null;

    return { indicador, despesa, mediaEnem, idebAnoUtilizado: idebDataYear };
  }, [selectedAno, data]);

  // --- Error Handling ---
  if (dataError || metaError) {
    return (
      <p className="text-red-500 p-4 text-center">
        Erro ao carregar dados: {dataError || metaError}
      </p>
    );
  }

  // --- Initial Loading or No Data State ---
  if (
    isLoadingParaibaData ||
    isLoadingMeta ||
    (!data && !dashboardMeta)
  ) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Skeleton placeholders */}
        <div className="bg-white rounded-xl shadow p-6 h-40" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow h-[440px]" />
          <div className="bg-white rounded-xl shadow h-[440px]" />
          <div className="bg-white rounded-xl shadow h-[440px]" />
        </div>
        <div className="bg-white rounded-xl shadow h-[500px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow h-[350px]" />
          <div className="bg-white rounded-xl shadow h-[350px]" />
        </div>
      </div>
    );
  }

  // --- Helper Functions ---
  const formatCurrency = (value: number | undefined): string =>
    typeof value === 'number'
      ? value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 0,
        })
      : 'N/A';

  const formatNumber = (value: number | undefined, decimals = 0): string =>
    typeof value === 'number'
      ? value.toLocaleString('pt-BR', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : 'N/A';

  const formatPercentage = (value: number | undefined, decimals = 1): string =>
    typeof value === 'number' ? `${(value * 100).toFixed(decimals)}%` : 'N/A';

  const needsBiennialNote =
    selectedAno && ['2020', '2022'].includes(selectedAno);
  const biennialDataYear = needsBiennialNote
    ? String(parseInt(selectedAno!) - 1)
    : selectedAno;

  // --- Render Functions ---
  const renderEstadoInfo = () => (
    <div className="mt-6 mb-6 bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Informações da Paraíba
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center sm:items-start sm:text-left">
          <span className="material-symbols-outlined text-blue-500 text-3xl mb-1">
            groups
          </span>
          <p className="text-sm mt-1 font-medium text-gray-600">
            População (Estimativa)
          </p>
          <p className="text-xl font-semibold">3.974.687</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center sm:items-start sm:text-left">
          <span className="material-symbols-outlined text-green-500 text-3xl mb-1">
            trending_up
          </span>
          <p className="text-sm mt-1 font-medium text-gray-600">
            IDHM (2021)
          </p>
          <p className="text-xl font-semibold">0.718</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center sm:items-start sm:text-left">
          <span className="material-symbols-outlined text-purple-500 text-3xl mb-1">
            straighten
          </span>
          <p className="text-sm mt-1 font-medium text-gray-600">Área Total</p>
          <p className="text-xl font-semibold">56.467 km²</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center sm:items-start sm:text-left">
          <span className="material-symbols-outlined text-orange-500 text-3xl mb-1">
            public
          </span>
          <p className="text-sm mt-1 font-medium text-gray-600">Região</p>
          <p className="text-xl font-semibold">Nordeste</p>
        </div>
      </div>
    </div>
  );

  const renderSummaryCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
      {/* Card Investimento */}
      <div className="min-h-[440px] max-h-[440px] overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow">
        <span className="material-symbols-outlined text-blue-500 text-3xl mb-3">
          payments
        </span>
        <h3 className="text-lg font-semibold mb-2 text-blue-900">
          Investimento Educação ({selectedAno || '...'})
        </h3>
        <p className="text-2xl font-bold mb-4 text-blue-700">
          {formatCurrency(summaryData.despesa?.despesa_total)}
        </p>
      </div>

      {/* Card Indicadores */}
      <div className="min-h-[440px] max-h-[440px] bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow">
        <span className="material-symbols-outlined text-green-500 text-3xl mb-3">
          school
        </span>
        <h3 className="text-lg font-semibold mb-2 text-green-900">
          Indicadores Educacionais ({selectedAno || '...'})
        </h3>
        <div className="flex flex-col gap-2 mt-4">
          {[
            {
              label: 'IDEB',
              value: formatNumber(summaryData.indicador?.ideb, 2),
              icon: 'grade',
              biennial: true,
            },
            {
              label: 'Taxa Aprovação',
              value: formatPercentage(summaryData.indicador?.fluxo),
              icon: 'check_circle',
              biennial: true,
            },
            {
              label: 'SAEB - MT',
              value: formatNumber(summaryData.indicador?.nota_mt, 2),
              icon: 'calculate',
              biennial: true,
            },
            {
              label: 'SAEB - LP',
              value: formatNumber(summaryData.indicador?.nota_lp, 2),
              icon: 'menu_book',
              biennial: true,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2 px-3 py-2 text-sm bg-green-100 rounded-lg"
            >
              <div className="flex items-center gap-2 text-green-800 font-medium">
                <span className="material-symbols-outlined text-base text-green-600">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1">
                {item.biennial && needsBiennialNote && (
                  <div className="relative group flex items-center">
                    <span className="material-symbols-outlined text-amber-500 text-base cursor-help">
                      warning
                    </span>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-2 bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10">
                      Dado referente a {biennialDataYear}
                    </div>
                  </div>
                )}
                <span className="font-semibold bg-white px-2 py-0.5 rounded text-green-700">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card ENEM */}
      <div className="min-h-[440px] max-h-[440px] bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow">
        <span className="material-symbols-outlined text-purple-500 text-3xl mb-3">
          leaderboard
        </span>
        <h3 className="text-lg font-semibold mb-2 text-purple-900">
          Média ENEM ({selectedAno || '...'})
        </h3>
        <p className="text-2xl font-bold mb-4 text-purple-700">
          {formatNumber(summaryData.mediaEnem?.media_geral, 2)}
        </p>
        <div className="flex flex-col gap-1 mt-4">
          {[
            {
              label: 'Linguagens',
              value: formatNumber(summaryData.mediaEnem?.media_lc, 2),
              icon: 'translate',
            },
            {
              label: 'Humanas',
              value: formatNumber(summaryData.mediaEnem?.media_ch, 2),
              icon: 'history_edu',
            },
            {
              label: 'Natureza',
              value: formatNumber(summaryData.mediaEnem?.media_cn, 2),
              icon: 'biotech',
            },
            {
              label: 'Matemática',
              value: formatNumber(summaryData.mediaEnem?.media_mt, 2),
              icon: 'calculate',
            },
            {
              label: 'Redação',
              value: formatNumber(summaryData.mediaEnem?.media_red, 2),
              icon: 'draw',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 px-3 py-1.5 text-sm bg-purple-100 rounded-lg"
            >
              <div className="flex items-center gap-2 text-purple-800 font-medium">
                <span className="material-symbols-outlined text-base text-purple-600">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              <span className="font-semibold bg-white px-2 py-0.5 rounded text-purple-700">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderParaibaMap = () => (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6 hover:shadow-lg transition-shadow mt-6 mb-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-gray-800">
          Mapa do IDEB Municipal ({selectedAno || '...'}){' '}
          {needsBiennialNote && (
            <span className="text-sm font-normal text-gray-500 ml-1">
              (dados ref. {biennialDataYear})
            </span>
          )}
        </h3>
        <div className="relative group">
          <span className="material-symbols-outlined text-gray-400 text-xl cursor-help">
            help_outline
          </span>
          <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20">
            O mapa colore os municípios com base na nota do IDEB do ano de
            referência. Clique para ver detalhes. Cinza = dados indisponíveis.
          </div>
        </div>
      </div>

      {selectedAno ? (
        <ParaibaMapChart
          idebData={processedIdebDataForMap}
          selectedYear={selectedAno}
        />
      ) : (
        <div className="flex items-center justify-center h-[500px] text-gray-500">
          Selecione um ano para visualizar o mapa.
        </div>
      )}
    </div>
  );

  const renderCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* Evolução Investimento (PB) */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Evolução Investimento (PB)
        </h3>
        {data?.despesasParaiba ? (
          <InvestimentoEducacaoChart dados={data.despesasParaiba} />
        ) : (
          <p className="text-gray-500">Dados não disponíveis.</p>
        )}
      </div>

      {/* Top 10 Investimento Municipal */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Top 10 Investimento Municipal
        </h3>
        {data?.despesasMunicipios ? (
          <TopMunicipiosInvestimentoChart dados={data.despesasMunicipios} />
        ) : (
          <p className="text-gray-500">Dados não disponíveis.</p>
        )}
      </div>

      {/* Evolução IDEB (PB) */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Evolução IDEB (PB)
        </h3>
        {data?.indicadoresParaiba ? (
          <IdebChart dados={data.indicadoresParaiba} />
        ) : (
          <p className="text-gray-500">Dados não disponíveis.</p>
        )}
      </div>

      {/* Top 10 IDEB Municipal */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Top 10 IDEB Municipal
        </h3>
        {data?.indicadoresMunicipios ? (
          <TopMunicipiosMediaIdebChart dados={data.indicadoresMunicipios} />
        ) : (
          <p className="text-gray-500">Dados não disponíveis.</p>
        )}
      </div>

      {/* Top Municípios por Investimento vs. Nota SAEB */}
      <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
        {data?.despesasMunicipios && data?.indicadoresMunicipios ? (
          <TopMunicipiosIdebChart
            dadosDespesa={data.despesasMunicipios}
            dadosIdeb={data.indicadoresMunicipios}
          />
        ) : (
          <div className="flex items-center justify-center h-[450px] text-gray-500">
            Dados de despesa ou indicadores municipais indisponíveis para o
            gráfico comparativo.
          </div>
        )}
      </div>

      {/* Evolução Média ENEM (PB) */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Evolução Média ENEM (PB)
        </h3>
        {data?.mediasEnemParaiba ? (
          <EvolucaoMediaGeralEnemChart dados={data.mediasEnemParaiba} />
        ) : (
          <p className="text-gray-500">Dados não disponíveis.</p>
        )}
      </div>

      {/* Top 10 Média ENEM Municipal */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Top 10 Média ENEM Municipal
        </h3>
        {data?.mediasEnemMunicipios ? (
          <TopMunicipiosMediaEnemChart dados={data.mediasEnemMunicipios} />
        ) : (
          <p className="text-gray-500">Dados não disponíveis.</p>
        )}
      </div>
    </div>
  );

  // --- Renderização Principal ---
  return (
    <div className="w-full">
      {data ? (
        <>
          {renderEstadoInfo()}
          {renderSummaryCards()}
          {renderParaibaMap()}
          {renderCharts()}
          {/*dashboardMeta?.faqs && <FaqSection faqs={dashboardMeta.faqs} />*/}
        </>
      ) : (
        !isLoadingParaibaData && (
          <p className="p-4 text-center text-gray-500">
            Não foi possível carregar os dados da Paraíba.
          </p>
        )
      )}
    </div>
  );
};
