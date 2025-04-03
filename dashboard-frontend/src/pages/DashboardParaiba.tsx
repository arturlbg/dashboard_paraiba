import React, { useEffect, useState, useMemo } from 'react';
// Removido import do Select se não for mais usado diretamente aqui
// import Select from '../components/Select';
import { FaqSection } from '../components/FaqSection'; // Ajuste o caminho se necessário
import { getDashboardMunicipiosData } from '../hooks/getDashboardMunicipiosData'; // Ajuste o caminho se necessário
import { getParaibaData } from '../hooks/getParaibaData'; // Ajuste o caminho se necessário
import { InvestimentoEducacaoChart } from '../components/charts/paraibaCharts/InvestimentoEducacaoChart'; // Ajuste o caminho se necessário
import { TopMunicipiosInvestimentoChart } from '../components/charts/paraibaCharts/TopMunicipiosInvestimentoChart'; // Ajuste o caminho se necessário
import { IdebChart } from '../components/charts/paraibaCharts/IdebChart'; // Ajuste o caminho se necessário
import { TopMunicipiosMediaIdebChart } from '../components/charts/paraibaCharts/TopMunicipiosMediaIdebChart'; // Ajuste o caminho se necessário
import { TopMunicipiosMediaEnemChart } from '../components/charts/paraibaCharts/TopMunicipiosMediaEnemChart'; // Ajuste o caminho se necessário
import { EvolucaoMediaGeralEnemChart } from '../components/charts/paraibaCharts/EvolucaoMediaGeralEnemChart'; // Ajuste o caminho se necessário
import { ParaibaMapChart } from '../components/charts/paraibaCharts/ParaibaMapChart'; // Ajuste o caminho se necessário
import '../style.css'; // Ajuste o caminho se necessário

//
// ──────────────────────────────────────────────────────────────────────────────
//   >>> Tipos <<<
// ──────────────────────────────────────────────────────────────────────────────
//

interface IdebDataMap {
  [ano: string]: {
    [municipio: string]: number; // A chave 'municipio' DEVE corresponder ao GeoJSON['properties']['NOME']
  };
}

// Mantendo outras interfaces como estavam...
interface MediaEnem { ano: string; media_geral: number; /* ... */ }
interface Indicador { ano: string; ideb: number; fluxo: number; nota_mt: number; nota_lp: number; }
interface IndicadorMunicipio { ano: string; municipio: string; ideb: number; /* ... */ }
interface DespesaMunicipio { ano: string; municipio: string; despesa_total: number; /* ... */ }
interface MediaEnemMunicipio { ano: string; municipio: string; media_geral: number; /* ... */ }
interface Despesa { ano: string; despesa_total: number; }
// Interface Ano não é mais necessária aqui se Select/PeriodoFilter foram removidos
// interface Ano { ano: string; }
interface Data {
  indicadores_paraiba: Indicador[];
  despesas_paraiba: Despesa[];
  medias_enem_paraiba: MediaEnem[];
  indicadores_municipios?: IndicadorMunicipio[];
  despesas_municipios?: DespesaMunicipio[];
  medias_enem_municipios?: MediaEnemMunicipio[];
}
interface Dashboard { faqs: any[]; }

// Removidas interfaces Filter e PeriodoFilterProps

//
// ──────────────────────────────────────────────────────────────────────────────
//   >>> Dashboard Paraíba (Componente Principal) <<<
// ──────────────────────────────────────────────────────────────────────────────
//

interface DashboardParaibaProps {
  setLoadingState: (isLoading: boolean) => void;
  selectedAno: string | null; // Recebe o ano selecionado do Controller
  setSelectedAno: (ano: string) => void; // Recebe a função, embora não a use diretamente para definir (o Controller faz isso)
}

export const DashboardParaiba: React.FC<DashboardParaibaProps> = ({
  setLoadingState,
  selectedAno,
  setSelectedAno, // Recebe, mas não renderiza o filtro aqui
}) => {
  // --- Estados locais para dados filtrados dos cards ---
  const [indicadorIdeb, setIndicadorIdeb] = useState<Indicador[] | null>(null);
  const [despesa, setDespesa] = useState<Despesa[] | null>(null);
  const [mediaEnem, setMediaEnem] = useState<MediaEnem[] | null>(null);

  // --- Busca de Dados ---
  const { data, isLoadingData, dataError } = getParaibaData<Data>();
  const { dashboard, isLoadingDashboard, dashboardError } = getDashboardMunicipiosData<Dashboard>();

  // --- Efeito para gerenciar estado de loading global ---
  useEffect(() => {
    // Considera o loading dos dois hooks
    setLoadingState(isLoadingData || isLoadingDashboard);
  }, [isLoadingData, isLoadingDashboard, setLoadingState]);

  // --- Efeito para filtrar dados GERAIS da PB para os cards de resumo ---
  useEffect(() => {
    // Lógica de filtragem (mantida como antes)
    if (!selectedAno || !data?.indicadores_paraiba || !data?.despesas_paraiba || !data?.medias_enem_paraiba) {
        setIndicadorIdeb(null); setDespesa(null); setMediaEnem(null); return;
    }
    let idebAno = selectedAno;
    if (selectedAno === '2020') idebAno = '2019'; if (selectedAno === '2022') idebAno = '2021'; if (selectedAno === '2024') idebAno = '2023';

    const indicadorFiltrados = data.indicadores_paraiba.filter(i => i.ano == idebAno);
    const despesaFiltrada = data.despesas_paraiba.filter(d => d.ano == selectedAno);
    const mediaEnemFiltrada = data.medias_enem_paraiba.filter(e => e.ano == selectedAno);

    setIndicadorIdeb(indicadorFiltrados.length > 0 ? indicadorFiltrados : null);
    setDespesa(despesaFiltrada.length > 0 ? despesaFiltrada : null);
    setMediaEnem(mediaEnemFiltrada.length > 0 ? mediaEnemFiltrada : null);
  }, [selectedAno, data]);

  const processedIdebDataForMap = useMemo((): IdebDataMap => {
    let realDataMap: IdebDataMap = {}; // Inicia mapa vazio

    if (data?.indicadores_municipios && Array.isArray(data.indicadores_municipios)) {
      data.indicadores_municipios.forEach(indicador => {
        const { ano, nome_municipio, ideb } = indicador;

        const yearString = String(ano);

        if (yearString && nome_municipio && typeof ideb === 'number' && !isNaN(ideb)) {
          if (!realDataMap[yearString]) {
            realDataMap[yearString] = {};
          }
          realDataMap[yearString][nome_municipio] = ideb;
        }
      });
    }
    return realDataMap;

  }, [data?.indicadores_municipios]);


  if (dashboardError || dataError) {
    return <p className="text-red-500 p-4 text-center">Erro ao carregar dados: {dashboardError || dataError}</p>;
  }

  if (!isLoadingData && !isLoadingDashboard && (!dashboard || !data)) {
      return <p className="p-4 text-center text-gray-500">Nenhum dado disponível para exibição.</p>;
  }

   const formatCurrency = (value: number): string =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const renderEstadoInfo = () => (
    <div className="mt-6 mb-6 bg-white rounded-xl shadow p-6">
       <h2 className="text-lg font-semibold mb-4">Informações da Paraíba</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Cards de Info: População, IDH, Área, Região */}
             <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center sm:items-start sm:text-left">
                <span className="material-symbols-outlined text-blue-500 text-3xl">groups</span>
                <p className="text-sm mt-2 font-medium text-gray-600">População (Estimativa)</p>
                <p className="text-xl font-semibold">{"3.974.687"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center sm:items-start sm:text-left">
                <span className="material-symbols-outlined text-green-500 text-3xl">trending_up</span>
                <p className="text-sm mt-2 font-medium text-gray-600">IDHM (2021)</p>
                <p className="text-xl font-semibold">{"0.718"}</p> {/* Valor atualizado */}
            </div>
            <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center sm:items-start sm:text-left">
                <span className="material-symbols-outlined text-purple-500 text-3xl">straighten</span>
                <p className="text-sm mt-2 font-medium text-gray-600">Área Total</p>
                <p className="text-xl font-semibold">{"56.467"} km²</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center sm:items-start sm:text-left">
                <span className="material-symbols-outlined text-orange-500 text-3xl">public</span>
                <p className="text-sm mt-2 font-medium text-gray-600">Região</p>
                <p className="text-xl font-semibold">Nordeste</p>
            </div>
       </div>
    </div>
  );

  const renderSummaryCards = () => {
       // Placeholders se não houver ano selecionado ou dados carregando
      const showPlaceholders = !selectedAno || (isLoadingData && (!indicadorIdeb || !despesa || !mediaEnem));

      if (showPlaceholders) {
          return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 animate-pulse">
                  {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="min-h-[440px] bg-gray-200 p-6 rounded-xl">
                          <div className="h-8 w-1/2 bg-gray-300 rounded mb-4"></div>
                          <div className="h-10 w-3/4 bg-gray-300 rounded mb-6"></div>
                          <div className="h-16 bg-gray-300 rounded"></div>
                      </div>
                  ))}
              </div>
          );
      }

      // Renderiza os cards normalmente
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {/* Card Investimento */}
            <div className="min-h-[440px] max-h-[440px] overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow hover:shadow-md transition-shadow">
                 <span className="material-symbols-outlined text-blue-500 text-3xl mb-3">payments</span>
                 <h3 className="text-lg font-semibold mb-2 text-blue-900">Investimento Educação ({selectedAno})</h3>
                 <p className="text-2xl font-bold mb-4 text-blue-700">
                    {despesa?.[0]?.despesa_total ? formatCurrency(despesa[0].despesa_total) : 'N/A'}
                 </p>
                 <div className="flex items-start gap-2 p-3 bg-blue-100 border border-blue-200 rounded-lg">
                    <span className="material-symbols-outlined text-blue-600 text-xl mt-1 flex-shrink-0">info</span>
                    <p className="text-sm text-blue-800">Investimento total em educação na Paraíba para o ano selecionado.</p>
                 </div>
            </div>

            {/* Card Indicadores */}
            <div className="min-h-[440px] max-h-[440px] bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-green-500 text-3xl mb-3">school</span>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-green-900">Indicadores Educacionais ({indicadorIdeb?.[0]?.ano ?? selectedAno})</h3>
                   {/* Tooltip */}
                   <div className="relative group">
                       <span className="material-symbols-outlined text-gray-400 text-lg cursor-help mt-1">help_outline</span>
                       <div className="absolute left-3 bottom-full mb-2 p-2 bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 w-64">
                          IDEB/SAEB são bienais (anos ímpares). Valores de anos pares referem-se ao ano ímpar anterior.
                       </div>
                   </div>
                </div>
                {/* Lista de indicadores */}
                <div className="flex flex-col gap-2">
                     {[
                       { label: 'IDEB', value: indicadorIdeb?.[0]?.ideb?.toFixed(2), icon: 'grade' },
                       { label: 'Taxa Aprovação', value: indicadorIdeb?.[0]?.fluxo !== undefined ? `${(indicadorIdeb[0].fluxo * 100).toFixed(1)}%` : undefined, icon: 'check_circle' },
                       { label: 'SAEB - MT', value: indicadorIdeb?.[0]?.nota_mt?.toFixed(2), icon: 'calculate' },
                       { label: 'SAEB - LP', value: indicadorIdeb?.[0]?.nota_lp?.toFixed(2), icon: 'menu_book' },
                     ].map((item, index) => (
                       <div key={index} className="flex items-center justify-between gap-2 px-3 py-2 text-sm bg-green-100 rounded-lg">
                          <div className="flex items-center gap-2 text-green-800 font-medium">
                              <span className="material-symbols-outlined text-base text-green-600">{item.icon}</span>
                              <span>{item.label}</span>
                          </div>
                          <div className="flex items-center gap-1">
                              {/* Aviso bienal */}
                              {['2020', '2022', '2024'].includes(selectedAno || '') && ['IDEB', 'SAEB'].some(prefix => item.label.startsWith(prefix)) && (
                                 <div className="relative group flex items-center">
                                     <span className="material-symbols-outlined text-amber-500 text-base cursor-help" title={`Dado referente a ${parseInt(selectedAno || '0') - 1}`}>warning</span>
                                 </div>
                              )}
                              <span className="font-semibold bg-white px-2 py-0.5 rounded text-green-700">
                                  {item.value ?? 'N/A'}
                              </span>
                          </div>
                       </div>
                    ))}
                 </div>
            </div>

            {/* Card ENEM */}
            <div className="min-h-[440px] max-h-[440px] bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-purple-500 text-3xl mb-3">leaderboard</span>
                <h3 className="text-lg font-semibold mb-2 text-purple-900">Média ENEM ({selectedAno})</h3>
                <p className="text-2xl font-bold mb-4 text-purple-700">
                  {mediaEnem?.[0]?.media_geral?.toFixed(2) ?? 'N/A'}
                </p>
                {/* Lista de médias por área */}
                <div className="flex flex-col gap-1">
                    {[
                       { label: 'Linguagens', value: mediaEnem?.[0]?.media_lc, icon: 'translate' },
                       { label: 'Humanas', value: mediaEnem?.[0]?.media_ch, icon: 'history_edu' },
                       { label: 'Natureza', value: mediaEnem?.[0]?.media_cn, icon: 'biotech' },
                       { label: 'Matemática', value: mediaEnem?.[0]?.media_mt, icon: 'calculate' },
                       { label: 'Redação', value: mediaEnem?.[0]?.media_red, icon: 'draw' },
                    ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between gap-2 px-3 py-1.5 text-sm bg-purple-100 rounded-lg">
                           <div className="flex items-center gap-2 text-purple-800 font-medium">
                               <span className="material-symbols-outlined text-base text-purple-600">{item.icon}</span>
                               <span>{item.label}</span>
                           </div>
                           <span className="font-semibold bg-white px-2 py-0.5 rounded text-purple-700">
                               {item.value !== undefined ? item.value.toFixed(2) : 'N/A'}
                           </span>
                       </div>
                    ))}
                </div>
            </div>
        </div>
      );
  };

 const renderParaibaMap = () => {
    if (!selectedAno && !(isLoadingData || isLoadingDashboard)) { // Se não tem ano e não está carregando, pede pra selecionar
      return (
        <div className="bg-white rounded-xl shadow p-6 mt-6 mb-6 text-center flex flex-col items-center justify-center min-h-[400px]">
          <span className="material-symbols-outlined text-5xl text-gray-400 mb-4">map</span>
          <p className="text-gray-500">Selecione um ano no filtro acima para visualizar o mapa do IDEB.</p>
        </div>
      );
    }

    // Verifica se há dados (reais ou mock) para o ano selecionado no mapa
    const mapDataForSelectedYear = processedIdebDataForMap[selectedAno || ''] || {};
    const hasMapDataForYear = Object.keys(mapDataForSelectedYear).length > 0;

    return (
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 hover:shadow-lg transition-shadow mt-6 mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-semibold text-gray-800">
                Mapa do IDEB Municipal ({selectedAno || '...'}) {/* Mostra '...' se o ano ainda n foi selecionado */}
            </h3>
            {/* Tooltip do Mapa */}
            <div className="relative group">
                <span className="material-symbols-outlined text-gray-400 text-xl cursor-help">help_outline</span>
                <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20">
                     O mapa colore os municípios com base na nota do IDEB ({selectedAno ? (['2020', '2022', '2024'].includes(selectedAno) ? `ref. ${parseInt(selectedAno)-1}` : selectedAno) : 'ano selecionado'}). Clique para ver detalhes. Cinza = dados indisponíveis.
                </div>
            </div>
        </div>

        {/* --- Renderização do Mapa ou Placeholders --- */}
        {/* Se o ano foi selecionado E (está carregando OU não tem dados), mostra estado intermediário */}
        {selectedAno && (isLoadingData || !hasMapDataForYear) && (
             <div className="text-center py-10 text-gray-500 min-h-[400px] flex flex-col items-center justify-center">
               {isLoadingData ? (
                   <>
                       <span className="material-symbols-outlined text-4xl mb-2 animate-spin">sync</span>
                       <p>Carregando dados do mapa...</p>
                   </>
               ) : (
                   <>
                       <span className="material-symbols-outlined text-4xl mb-2">location_off</span>
                       <p>Não há dados de IDEB municipal disponíveis para {selectedAno}.</p>
                       <p className="text-xs mt-1">(Exibindo dados mockados ou nenhum dado)</p>
                   </>
               )}
           </div>
        )}

        {/* Renderiza o mapa somente se tiver ano selecionado E (não estiver carregando E tiver dados) */}
        {/* O mapa em si usará o fallback interno para mock se necessário */}
        {selectedAno && !isLoadingData && hasMapDataForYear && (
          <ParaibaMapChart
            idebData={processedIdebDataForMap} // Passa dados (reais ou mock como fallback)
            selectedYear={selectedAno}         // Passa o ano selecionado
          />
        )}
      </div>
    );
  };


  const renderCharts = () => {
       const showChartPlaceholders = !selectedAno || isLoadingData; // Mostra placeholders se sem ano ou carregando

       if (showChartPlaceholders) {
           return (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-pulse">
                   {Array.from({ length: 6 }).map((_, index) => (
                       <div key={index} className="bg-gray-200 rounded-xl shadow p-6 min-h-[300px]">
                          <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>
                          <div className="h-48 bg-gray-300 rounded"></div>
                       </div>
                   ))}
               </div>
           );
       }

       // Renderiza gráficos normalmente
       return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Usar operador ternário ou && para renderização condicional dos gráficos */}
                {data?.despesas_paraiba ? (
                    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Evolução Investimento (PB)</h3>
                        <InvestimentoEducacaoChart dados={data.despesas_paraiba} />
                    </div>
                ) : <div className="bg-gray-100 rounded-xl p-6 min-h-[300px] flex items-center justify-center"><p className="text-gray-400">Dados indisponíveis</p></div>}

                {data?.despesas_municipios ? (
                    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Top 10 Investimento Mun. ({selectedAno})</h3>
                        <TopMunicipiosInvestimentoChart dados={data.despesas_municipios} selectedYear={selectedAno} />
                    </div>
                 ) : <div className="bg-gray-100 rounded-xl p-6 min-h-[300px] flex items-center justify-center"><p className="text-gray-400">Dados indisponíveis</p></div>}

                {data?.indicadores_paraiba ? (
                    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Evolução IDEB (PB)</h3>
                        <IdebChart dados={data.indicadores_paraiba} />
                    </div>
                 ) : <div className="bg-gray-100 rounded-xl p-6 min-h-[300px] flex items-center justify-center"><p className="text-gray-400">Dados indisponíveis</p></div>}

                 {data?.indicadores_municipios ? (
                    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                         {/* Ajuste no título para refletir o ano do IDEB */}
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Top 10 IDEB Mun. ({['2020', '2022', '2024'].includes(selectedAno || '') ? parseInt(selectedAno || '0') - 1 : selectedAno})</h3>
                        <TopMunicipiosMediaIdebChart dados={data.indicadores_municipios} selectedYear={selectedAno} />
                    </div>
                 ) : <div className="bg-gray-100 rounded-xl p-6 min-h-[300px] flex items-center justify-center"><p className="text-gray-400">Dados indisponíveis</p></div>}

                 {data?.medias_enem_paraiba ? (
                    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Evolução Média ENEM (PB)</h3>
                        <EvolucaoMediaGeralEnemChart dados={data.medias_enem_paraiba} />
                    </div>
                 ) : <div className="bg-gray-100 rounded-xl p-6 min-h-[300px] flex items-center justify-center"><p className="text-gray-400">Dados indisponíveis</p></div>}

                 {data?.medias_enem_municipios ? (
                    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Top 10 Média ENEM Mun. ({selectedAno})</h3>
                        <TopMunicipiosMediaEnemChart dados={data.medias_enem_municipios} selectedYear={selectedAno}/>
                    </div>
                  ) : <div className="bg-gray-100 rounded-xl p-6 min-h-[300px] flex items-center justify-center"><p className="text-gray-400">Dados indisponíveis</p></div>}
            </div>
       );
  };

  return (
    <div className="w-full">
      {/* Renderiza o conteúdo SE os dados base (data/dashboard) já foram carregados */}
      {!(isLoadingData || isLoadingDashboard) && (data || dashboard) ? (
         <>
            {renderEstadoInfo()}
            {renderSummaryCards()}
            {renderParaibaMap()}
            {renderCharts()}
            {dashboard?.faqs && <FaqSection faqs={dashboard.faqs} />}
         </>
      ) : (
         <div className="space-y-6 animate-pulse">
              {/* Skeleton para EstadoInfo */}
              <div className="bg-white rounded-xl shadow p-6 h-40">
                 <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
                 <div className="grid grid-cols-4 gap-4">
                     <div className="h-20 bg-gray-200 rounded"></div>
                     <div className="h-20 bg-gray-200 rounded"></div>
                     <div className="h-20 bg-gray-200 rounded"></div>
                     <div className="h-20 bg-gray-200 rounded"></div>
                 </div>
              </div>
              {/* Skeleton para SummaryCards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow h-[440px]"></div>
                  <div className="bg-white rounded-xl shadow h-[440px]"></div>
                  <div className="bg-white rounded-xl shadow h-[440px]"></div>
              </div>
               {/* Skeleton para Mapa */}
               <div className="bg-white rounded-xl shadow h-[500px]"></div>
               {/* Skeleton para Charts */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white rounded-xl shadow h-[350px]"></div>
                   <div className="bg-white rounded-xl shadow h-[350px]"></div>
                   <div className="bg-white rounded-xl shadow h-[350px]"></div>
                   <div className="bg-white rounded-xl shadow h-[350px]"></div>
               </div>
         </div>
      )}
    </div>
  );
};