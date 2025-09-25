import React, { useState, useEffect, useMemo } from 'react';
import { useMunicipiosDashboardData } from './hooks/useMunicipiosDashboardData'; // Corrected path
import '../../styles/fonts.css'; // Assuming global font import is needed here or in main.tsx
import { MediaEnemPorAreaChart } from './components/charts/MediaEnemPorAreaChart'; // Corrected path
import { DesempenhoDisciplinaChart } from './components/charts/DesempenhoDisciplinaChart'; // Corrected path
import { InvestimentoEnemChart } from './components/charts/InvestimentoEnemChart'; // Corrected path
import { ComparativoMediaChart } from './components/charts/ComparacaoMediaChart'; // Corrected path
import { TaxaAprovacaoChart } from './components/charts/TaxaAprovacaoChart'; // Corrected path
import { FaqSection } from '../../components/ui/FaqSection'; // Corrected path
import { calcularMedias } from '../../utils/tools'; // Corrected path
import { Municipio, MediaEnem, IndicadorEducacional, DespesaMunicipio, DashboardFilterData } from '../../types'; // Assuming types are defined

// Renamed component
interface MunicipiosDashboardProps {
  filterData: DashboardFilterData | null; // Receive pre-fetched filter data
  setLoadingState: (isLoading: boolean) => void; // To communicate loading status upwards
  selectedMunicipio: Municipio | null;
  selectedAno: string | null;
  // Removed setters as they are managed by DashboardController
}

export const MunicipiosDashboard: React.FC<MunicipiosDashboardProps> = ({
  filterData,
  setLoadingState,
  selectedMunicipio,
  selectedAno,
}) => {
  // --- Estados para dados especificamente filtrados para o município/ano selecionado ---
  const [municipioData, setMunicipioData] = useState<{
    mediaEnem: MediaEnem[] | null;
    indicadorIdeb: IndicadorEducacional[] | null;
    municipioDespesa: DespesaMunicipio[] | null;
    idebAnoUtilizado: string | null; // Store the year used for IDEB/SAEB data
  } | null>(null);

  // --- Hook para buscar dados agregados/mock (FAQs, etc.) ---
  // Renamed for clarity
  const { dashboardData, isLoading: isLoadingDashboardSpecific, error: dashboardError } = useMunicipiosDashboardData();

  // --- Efeito para Loading Global ---
  // Signal loading based on the dashboard-specific data fetch
  useEffect(() => {
    setLoadingState(isLoadingDashboardSpecific);
  }, [isLoadingDashboardSpecific, setLoadingState]);

  // --- Efeito para Filtrar Dados Locais quando seleções ou filterData mudam ---
  useEffect(() => {
    // Reset local data if prerequisites are missing
    if (!selectedMunicipio || !selectedAno || !filterData) {
      setMunicipioData(null);
      return;
    }

    // Filter médias do ENEM
    const filteredEnem = filterData.mediasEnem?.filter(
      (media) => media.nome === selectedMunicipio.nome && media.ano === selectedAno
    ) || [];

    // Ajusta o ano para buscar IDEB/SAEB (dados bienais)
    let idebDataYear = selectedAno;
    const isEvenYear = parseInt(selectedAno) % 2 === 0;
     if (isEvenYear && parseInt(selectedAno) >= 2020) {
        idebDataYear = String(parseInt(selectedAno) - 1);
    }
    // Add future logic if needed

    // Filter indicadores IDEB/SAEB using the adjusted year
    const filteredIdeb = filterData.indicadores?.filter(
      (indicador) =>
        indicador.nome_municipio === selectedMunicipio.nome && String(indicador.ano) === idebDataYear
    ) || [];

    // Filter despesas using the original selected year
    const filteredDespesas = filterData.despesasMunicipios?.filter(
      (despesa) =>
        despesa.nome_municipio === selectedMunicipio.nome && despesa.ano == selectedAno
    ) || [];

    setMunicipioData({
        mediaEnem: filteredEnem.length > 0 ? filteredEnem : null,
        indicadorIdeb: filteredIdeb.length > 0 ? filteredIdeb : null,
        municipioDespesa: filteredDespesas.length > 0 ? filteredDespesas : null,
        idebAnoUtilizado: filteredIdeb.length > 0 ? idebDataYear : null // Store the data source year
    });

  }, [selectedMunicipio, selectedAno, filterData]);

  // --- Cálculos Memoizados --- // Moved outside conditional blocks
  const calculatedMedias = useMemo(() => {
      if (!filterData || !municipioData) return null;

      const mediasEnemMunicipio = calcularMedias(municipioData.mediaEnem || []);
      const mediasEnemParaiba = calcularMedias(filterData.mediasEnem || []);
      const mediasSaebMunicipio = calcularMedias(municipioData.indicadorIdeb || []); // Use already filtered IDEB data
      const mediasSaebParaiba = calcularMedias(filterData.indicadores || []); // Use all indicators for state average

      return {
          mediasEnemMunicipio, mediasEnemParaiba, mediasSaebMunicipio, mediasSaebParaiba
      };
  }, [municipioData, filterData]);

  // Hooks for historical data (called unconditionally)
  const enemHistoricoMunicipio = useMemo(() => filterData?.mediasEnem?.filter(m => m.nome === selectedMunicipio?.nome) || [], [filterData?.mediasEnem, selectedMunicipio]);
  const despesasHistoricoMunicipio = useMemo(() => filterData?.despesasMunicipios?.filter(d => d.nome_municipio === selectedMunicipio?.nome) || [], [filterData?.despesasMunicipios, selectedMunicipio]);
  const idebHistoricoMunicipio = useMemo(() => filterData?.indicadores?.filter(i => i.nome_municipio === selectedMunicipio?.nome) || [], [filterData?.indicadores, selectedMunicipio]);

   // Determine if the selected year requires showing biennial data note
   const needsBiennialNote = selectedAno && ['2020', '2022'].includes(selectedAno); // Add future even years if needed
   const biennialDataYear = needsBiennialNote ? String(parseInt(selectedAno!) - 1) : selectedAno;

  // --- Tratamento de Erros ---
  if (dashboardError) {
    return <p className="text-red-500 p-4 text-center">Erro ao carregar dados do dashboard: {dashboardError}</p>;
  }

  // --- Mensagem para selecionar filtros ---
  if (!selectedMunicipio || !selectedAno) {
    return (
        <div className="mt-12 mb-6 bg-white rounded-xl shadow p-10 text-center border border-blue-100">
            <span className="material-symbols-outlined text-5xl text-blue-400 mb-4">manage_search</span>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Selecione Município e Ano</h2>
            <p className="text-gray-500">Utilize os filtros no cabeçalho para visualizar os dados detalhados.</p>
        </div>
    );
  }

  // --- Se filtros selecionados, mas dados filtrados ainda não chegaram --- 
   if (!municipioData && !isLoadingDashboardSpecific) {
       return <div className="p-4 text-center text-gray-500">Carregando dados para {selectedMunicipio.nome} em {selectedAno}...</div>;
   }
    // --- Se dados filtrados chegaram, mas são nulos/vazios ---
   if (municipioData && !municipioData.mediaEnem && !municipioData.indicadorIdeb && !municipioData.municipioDespesa && !isLoadingDashboardSpecific) {
       return (
            <div className="mt-12 mb-6 bg-white rounded-xl shadow p-10 text-center border border-orange-100">
                <span className="material-symbols-outlined text-5xl text-orange-400 mb-4">warning</span>
                <h2 className="text-xl font-semibold mb-2 text-gray-700">Dados Não Encontrados</h2>
                <p className="text-gray-500">Não foram encontrados dados educacionais para {selectedMunicipio.nome} no ano de {selectedAno}.</p>
                <p className="text-xs text-gray-400 mt-2">(Verifique a disponibilidade na fonte de dados ou selecione outro ano/município).</p>
            </div>
       );
   }


  // --- Funções Auxiliares ---
  const formatCurrency = (value: number | undefined): string =>
    typeof value === 'number' ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }) : 'N/A';

  const formatNumber = (value: number | undefined, decimals: number = 0): string =>
      typeof value === 'number' ? value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : 'N/A';

   const formatPercentage = (value: number | undefined, decimals: number = 1): string =>
      typeof value === 'number' ? `${(value * 100).toFixed(decimals)}%` : 'N/A';

  // --- Componentes de Renderização ---
  const renderMunicipioInfo = () => (
    <div className="mt-6 mb-6 bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Informações: {selectedMunicipio?.nome}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center sm:items-start sm:text-left">
              <span className="material-symbols-outlined text-blue-500 text-3xl mb-1">groups</span>
              <p className="text-sm mt-1 font-medium text-gray-600">População</p>
              <p className="text-xl font-semibold">{formatNumber(selectedMunicipio?.populacao)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center sm:items-start sm:text-left">
              <span className="material-symbols-outlined text-green-500 text-3xl mb-1">trending_up</span>
              <p className="text-sm mt-1 font-medium text-gray-600">IDHM</p>
              <p className="text-xl font-semibold">{formatNumber(selectedMunicipio?.idhm, 3)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center sm:items-start sm:text-left">
              <span className="material-symbols-outlined text-purple-500 text-3xl mb-1">straighten</span>
              <p className="text-sm mt-1 font-medium text-gray-600">Área Total</p>
              <p className="text-xl font-semibold">{formatNumber(selectedMunicipio?.area_territorial)} km²</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center sm:items-start sm:text-left">
              <span className="material-symbols-outlined text-orange-500 text-3xl mb-1">public</span>
              <p className="text-sm mt-1 font-medium text-gray-600">Região</p>
              <p className="text-xl font-semibold">Nordeste</p>
          </div>
      </div>
    </div>
  );

   const renderSummaryCards = () => (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
           <div className="min-h-[440px] max-h-[440px] overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow">
               <span className="material-symbols-outlined text-blue-500 text-3xl mb-3">payments</span>
               <h3 className="text-lg font-semibold mb-2 text-blue-900">Investimento Educação ({selectedAno})</h3>
               <p className="text-2xl font-bold mb-4 text-blue-700">
                   {formatCurrency(municipioData?.municipioDespesa?.[0]?.despesa_total)}
               </p>
           </div>
            <div className="min-h-[440px] max-h-[440px] bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow">
                <span className="material-symbols-outlined text-green-500 text-3xl mb-3">school</span>
                <h3 className="text-lg font-semibold mb-2 text-green-900">Indicadores Educacionais ({selectedAno})</h3>
                <div className="flex flex-col gap-2 mt-4">
                   {[ 
                     { label: 'IDEB', value: formatNumber(municipioData?.indicadorIdeb?.[0]?.ideb, 2), icon: 'grade', biennial: true },
                     { label: 'Taxa Aprovação', value: formatPercentage(municipioData?.indicadorIdeb?.[0]?.fluxo), icon: 'check_circle', biennial: true },
                     { label: 'SAEB - MT', value: formatNumber(municipioData?.indicadorIdeb?.[0]?.nota_mt, 2), icon: 'calculate', biennial: true },
                     { label: 'SAEB - LP', value: formatNumber(municipioData?.indicadorIdeb?.[0]?.nota_lp, 2), icon: 'menu_book', biennial: true },
                   ].map((item, index) => (
                     <div key={index} className="flex items-center justify-between gap-2 px-3 py-2 text-sm bg-green-100 rounded-lg">
                         <div className="flex items-center gap-2 text-green-800 font-medium">
                             <span className="material-symbols-outlined text-base text-green-600">{item.icon}</span>
                             <span>{item.label}</span>
                         </div>
                          <div className="flex items-center gap-1">
                             {/* Conditionally render warning icon */} 
                             {item.biennial && needsBiennialNote && (
                                 <div className="relative group flex items-center">
                                     <span className="material-symbols-outlined text-amber-500 text-base cursor-help">warning</span>
                                     <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-2 bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10">
                                         Dado referente a {biennialDataYear}
                                     </div>
                                 </div>
                             )}
                             <span className="font-semibold bg-white px-2 py-0.5 rounded text-green-700">{item.value}</span>
                          </div>
                     </div>
                   ))}
                </div>
            </div>
            <div className="min-h-[440px] max-h-[440px] bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow">
                <span className="material-symbols-outlined text-purple-500 text-3xl mb-3">leaderboard</span>
                <h3 className="text-lg font-semibold mb-2 text-purple-900">Média ENEM ({selectedAno})</h3>
                <p className="text-2xl font-bold mb-4 text-purple-700">
                    {formatNumber(municipioData?.mediaEnem?.[0]?.media_geral, 2)}
                </p>
                <div className="flex flex-col gap-1 mt-4">
                    {[ 
                       { label: 'Linguagens', value: formatNumber(municipioData?.mediaEnem?.[0]?.media_lc, 2), icon: 'translate' },
                       { label: 'Humanas', value: formatNumber(municipioData?.mediaEnem?.[0]?.media_ch, 2), icon: 'history_edu' },
                       { label: 'Natureza', value: formatNumber(municipioData?.mediaEnem?.[0]?.media_cn, 2), icon: 'biotech' },
                       { label: 'Matemática', value: formatNumber(municipioData?.mediaEnem?.[0]?.media_mt, 2), icon: 'calculate' },
                       { label: 'Redação', value: formatNumber(municipioData?.mediaEnem?.[0]?.media_red, 2), icon: 'draw' },
                    ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between gap-2 px-3 py-1.5 text-sm bg-purple-100 rounded-lg">
                           <div className="flex items-center gap-2 text-purple-800 font-medium">
                               <span className="material-symbols-outlined text-base text-purple-600">{item.icon}</span>
                               <span>{item.label}</span>
                           </div>
                           <span className="font-semibold bg-white px-2 py-0.5 rounded text-purple-700">{item.value}</span>
                       </div>
                    ))}
                </div>
            </div>
      </div>
  );


  const renderCharts = () => {
    // These conditions rely on state/props/memos defined at the top level
    const hasEnemData = municipioData?.mediaEnem && municipioData.mediaEnem.length > 0;
    const hasIdebData = municipioData?.indicadorIdeb && municipioData.indicadorIdeb.length > 0;
    // const hasDespesaData = municipioData?.municipioDespesa && municipioData.municipioDespesa.length > 0;
    // Historical data checks
    const hasEnemHistorico = enemHistoricoMunicipio.length > 0;
    const hasDespesasHistorico = despesasHistoricoMunicipio.length > 0;
    const hasIdebHistorico = idebHistoricoMunicipio.length > 0;

    const enemMunicipioAtual = municipioData?.mediaEnem?.[0];
    const idebAnoExibicao = municipioData?.idebAnoUtilizado ?? selectedAno; // Use the actual data year for title

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Gráfico Enem - Média por Área (Ano Selecionado) */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Enem - Média por Área ({selectedAno})</h3>
          {hasEnemData && enemMunicipioAtual ? (
            <MediaEnemPorAreaChart
              series={[{ 
                name: `Média ${selectedMunicipio?.nome}`,
                data: [
                  enemMunicipioAtual.media_cn, enemMunicipioAtual.media_ch, enemMunicipioAtual.media_lc,
                  enemMunicipioAtual.media_mt, enemMunicipioAtual.media_red
                ].map(v => typeof v === 'number' ? v : 0)
              }]}
              categories={['Natureza', 'Humanas', 'Linguagens', 'Matemática', 'Redação']}
            />
          ) : <p className="text-center text-gray-500 py-10 h-[300px] flex items-center justify-center">Dados do ENEM indisponíveis para {selectedAno}.</p>}
        </div>

        {/* Gráfico Enem - Desempenho por Disciplina (Ano Selecionado - Radar) */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Enem - Desempenho por Área ({selectedAno})</h3>
          {hasEnemData && enemMunicipioAtual ? (
              <DesempenhoDisciplinaChart
                  series={[{
                      name: `Média ${selectedMunicipio?.nome}`,
                      data: [
                        enemMunicipioAtual.media_cn, enemMunicipioAtual.media_ch, enemMunicipioAtual.media_lc,
                        enemMunicipioAtual.media_mt, enemMunicipioAtual.media_red
                      ].map(v => typeof v === 'number' ? v : 0)
                  }]}
                  categories={['CN', 'CH', 'LC', 'MT', 'Red.']}
               />
           ) : <p className="text-center text-gray-500 py-10 h-[300px] flex items-center justify-center">Dados do ENEM indisponíveis para {selectedAno}.</p>}
        </div>

        {/* Gráfico Enem - Investimento e Média (Evolução) */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Investimento Educacional vs. Média ENEM (Evolução)</h3>
           {(hasEnemHistorico && hasDespesasHistorico) ? (
             <InvestimentoEnemChart
               mediasEnem={enemHistoricoMunicipio}
               despesas={despesasHistoricoMunicipio}
             />
           ) : <p className="text-center text-gray-500 py-10 h-[350px] flex items-center justify-center">Dados históricos indisponíveis para este gráfico.</p>}
        </div>

         {/* Gráfico Comparativo ENEM - Município vs Paraíba (Ano Selecionado) */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Comparativo Média ENEM ({selectedAno})</h3>
          {(hasEnemData && calculatedMedias) ? (
             <ComparativoMediaChart
               mediasMunicipio={calculatedMedias.mediasEnemMunicipio}
               mediasParaiba={calculatedMedias.mediasEnemParaiba}
               chaves={['media_cn', 'media_ch', 'media_lc', 'media_mt', 'media_red']}
               categoriasX={['CN', 'CH', 'LC', 'MT', 'Red.']}
               titulo="Município vs. Paraíba"
             />
           ) : <p className="text-center text-gray-500 py-10 h-[350px] flex items-center justify-center">Dados do ENEM indisponíveis para comparação em {selectedAno}.</p>}
        </div>

         {/* Gráfico Comparativo SAEB/IDEB - Município vs Paraíba (Ano de Referência do IDEB) */}
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Comparativo SAEB/IDEB ({idebAnoExibicao})</h3>
            {(hasIdebData && calculatedMedias) ? (
                 <ComparativoMediaChart
                   mediasMunicipio={calculatedMedias.mediasSaebMunicipio}
                   mediasParaiba={calculatedMedias.mediasSaebParaiba}
                   chaves={['nota_mt', 'nota_lp', 'ideb']}
                   categoriasX={['SAEB MT', 'SAEB LP', 'IDEB']}
                   titulo="Município vs. Paraíba"
                 />
            ) : <p className="text-center text-gray-500 py-10 h-[350px] flex items-center justify-center">Dados SAEB/IDEB indisponíveis para comparação em {idebAnoExibicao}.</p>}
        </div>

         {/* Gráfico Taxa de Aprovação (Evolução) */}
        <div className="bg-white rounded-xl shadow p-6">
            {(hasIdebHistorico) ? (
                <TaxaAprovacaoChart data={idebHistoricoMunicipio} />
            ) : <p className="text-center text-gray-500 py-10 h-[350px] flex items-center justify-center">Dados históricos de fluxo escolar indisponíveis.</p>}
        </div>
      </div>
    );
  };

  // --- Renderização Principal ---
  return (
    <div className="w-full">
        {/* Renderiza conteúdo apenas se filtros selecionados E dados não estão carregando */}
        {selectedMunicipio && selectedAno && !isLoadingDashboardSpecific && (
            <>
                {renderMunicipioInfo()}
                {/* Renderiza cards e gráficos apenas se os dados filtrados existirem */}
                {municipioData ? (
                    <>
                        {renderSummaryCards()}
                        {renderCharts()}
                    </>
                ) : (
                    // Mensagem se os dados filtrados ainda não chegaram ou estão vazios
                     <div className="p-4 text-center text-gray-500">
                         { filterData ? 'Nenhum dado encontrado para os filtros selecionados.' : 'Aguardando dados...' }
                     </div>
                )}
                {/* Renderiza FAQs (se existirem nos dados do dashboard) */}
                {/*dashboardData?.faqs && <FaqSection faqs={dashboardData.faqs} />*/}
            </>
        )}
        {/* Mensagem inicial ou de erro já tratada acima */}
    </div>
  );
};
