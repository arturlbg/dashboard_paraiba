import React, { useState, useEffect } from 'react';
import { getDashboardMunicipiosData } from '../hooks/getDashboardMunicipiosData';
import { getMunicipiosFilterData } from '../hooks/getMunicipiosFilterData';
import '../style.css'; // Ajuste o caminho se necessário
import { MediaEnemPorAreaChart } from '../components/charts/municipiosCharts/MediaEnemPorAreaChart'; // Ajuste o caminho
import { DesempenhoDisciplinaChart } from '../components/charts/municipiosCharts/DesempenhoDisciplinaChart'; // Ajuste o caminho
import { InvestimentoEnemChart } from '../components/charts/municipiosCharts/InvestimentoEnemChart'; // Ajuste o caminho
import { ComparativoMediaChart } from '../components/charts/municipiosCharts/ComparacaoMediaChart'; // Ajuste o caminho
import { TaxaAprovacaoChart } from '../components/charts/municipiosCharts/TaxaAprovacaoChart'; // Ajuste o caminho
import { FaqSection } from '../components/FaqSection'; // Ajuste o caminho
import Select from '../components/Select'; // Ajuste o caminho
import { calcularMedias } from '../components/tools/Tools'; // Ajuste o caminho

//
// ──────────────────────────────────────────────────────────────────────────────
//   >>> Interfaces <<< (Mantidas como antes)
// ──────────────────────────────────────────────────────────────────────────────
//
interface Municipio { nome: string; populacao: number; idhm: number; area_territorial: number; }
interface MediaEnem { nome: string; ano: string; media_geral: number; media_lc: number; media_ch: number; media_cn: number; media_mt: number; media_red: number; }
interface Indicador { nome_municipio: string; ano: string; ideb: number; fluxo: number; nota_mt: number; nota_lp: number; }
interface MunicipioDespesa { nome_municipio: string; ano: string; despesa_total: number; }
interface Ano { ano: string; }
interface Filter { municipios: Municipio[]; anos: Ano[]; medias_enem: MediaEnem[]; indicadores: Indicador[]; municipios_despesas: MunicipioDespesa[]; }
interface Dashboard { faqs: any[]; }

//
// ──────────────────────────────────────────────────────────────────────────────
//   >>> Componente de Filtro (MunicipioFilters - Mantido aqui, mas usado no Controller) <<<
// ──────────────────────────────────────────────────────────────────────────────
// (Embora definido aqui, ele é importado e usado pelo DashboardController)
interface MunicipioFiltersProps { /* ... */ }
export const MunicipioFilters: React.FC<MunicipioFiltersProps> = ({ /* ... */ }) => {
   // Lógica do filtro como estava antes
   if (!filter) return null;
   return (
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <Select // Select Município
              data={filter.municipios}
              value={selectedMunicipio}
              onChange={(value: Municipio | null) => { if (value) setSelectedMunicipio(value); }} // Adicionado | null
              labelKey="nome"
              valueKey="nome" // Usar nome como chave única
              placeholder="Selecione Município"
              className="w-full sm:w-48 md:w-56" // Ajuste de largura
              isClearable={true} // Permite limpar seleção?
           />
           {/* Select Ano (mantido com anos fixos, mas poderia usar filter.anos) */}
           <Select
              data={[{ ano: '2019' }, { ano: '2020' }, { ano: '2021' }, { ano: '2022' }, { ano: '2023' }]}
              value={filter?.anos?.find(a => a.ano === selectedAno) || null} // Encontra objeto Ano
              onChange={(value: Ano | null) => { if (value) setSelectedAno(value.ano); }} // Adicionado | null
              labelKey="ano"
              valueKey="ano"
              placeholder="Selecione Ano"
              className="w-full sm:w-32 md:w-40"
              isClearable={true}
           />
      </div>
   );
};


//
// ──────────────────────────────────────────────────────────────────────────────
//   >>> Dashboard para Municípios <<<
// ──────────────────────────────────────────────────────────────────────────────
//

interface DashboardMunicipiosProps {
  setLoadingState: (isLoading: boolean) => void;
  selectedMunicipio: Municipio | null;
  setSelectedMunicipio: (municipio: Municipio | null) => void; // Permite null
  selectedAno: string | null;
  setSelectedAno: (ano: string | null) => void; // Permite null
}

export const DashboardMunicipios: React.FC<DashboardMunicipiosProps> = ({
  setLoadingState,
  selectedMunicipio,
  setSelectedMunicipio, // Recebe, mas não usa diretamente para definir
  selectedAno,
  setSelectedAno, // Recebe, mas não usa diretamente para definir
}) => {
  // --- Estados para dados filtrados ---
  const [mediaEnem, setMediaEnem] = useState<MediaEnem[] | null>(null);
  const [indicadorIdeb, setIndicadorIdeb] = useState<Indicador[] | null>(null);
  const [municipioDespesa, setMunicipioDespesa] = useState<MunicipioDespesa[] | null>(null);

  // --- Hooks de busca de dados ---
  const { filter, isLoadingFilter, filterError } = getMunicipiosFilterData<Filter>();
  const { dashboard, isLoadingDashboard, dashboardError } = getDashboardMunicipiosData<Dashboard>();

  // --- Efeito para Loading Global ---
  useEffect(() => {
    setLoadingState(isLoadingFilter || isLoadingDashboard);
  }, [isLoadingFilter, isLoadingDashboard, setLoadingState]);

  // --- Efeito para Filtrar Dados Locais ---
  useEffect(() => {
    // Se não houver município, ano ou dados base, limpa os estados locais
    if (!selectedMunicipio || !selectedAno || !filter) {
      setMediaEnem(null);
      setIndicadorIdeb(null);
      setMunicipioDespesa(null);
      return;
    }

    // Filtra médias do ENEM para o município e ano selecionados
    const filteredEnem = filter.medias_enem?.filter(
      (media) => media.nome === selectedMunicipio.nome && media.ano === selectedAno
    ) || []; // Retorna array vazio se filter.medias_enem for undefined
    setMediaEnem(filteredEnem.length > 0 ? filteredEnem : null);

    // Ajusta o ano para buscar IDEB/SAEB (dados bienais)
    let idebAno = selectedAno;
    if (['2019', '2020'].includes(selectedAno)) idebAno = '2019';
    else if (['2021', '2022'].includes(selectedAno)) idebAno = '2021';
    else if (['2023', '2024'].includes(selectedAno)) idebAno = '2023'; // Exemplo futuro

    // Filtra indicadores IDEB para o município e ano (ajustado) selecionados
    const filteredIdeb = filter.indicadores?.filter(
      (indicador) =>
        indicador.nome_municipio === selectedMunicipio.nome && indicador.ano == idebAno
    ) || [];
    setIndicadorIdeb(filteredIdeb.length > 0 ? filteredIdeb : null);

    // Filtra despesas para o município e ano selecionados
    const filteredDespesas = filter.municipios_despesas?.filter(
      (despesa) =>
        despesa.nome_municipio === selectedMunicipio.nome && despesa.ano == selectedAno
    ) || [];
    setMunicipioDespesa(filteredDespesas.length > 0 ? filteredDespesas : null);

  }, [selectedMunicipio, selectedAno, filter]); // Depende das seleções e dos dados do filtro

  //
  // --- Tratamento de Erros e Loading Inicial ---
  //
  if (dashboardError || filterError) {
    return <p className="text-red-500 p-4 text-center">Erro ao carregar dados: {dashboardError || filterError}</p>;
  }

  // Mostra skeleton GERAL enquanto os dados iniciais (filter/dashboard) carregam
  if (isLoadingFilter || isLoadingDashboard) {
     return (
          <div className="w-full space-y-6 animate-pulse">
              {/* Skeleton para MunicipioInfo */}
              <div className="bg-white rounded-xl shadow p-6 h-40 mt-6"></div>
              {/* Skeleton para SummaryCards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow h-[440px]"></div>
                  <div className="bg-white rounded-xl shadow h-[440px]"></div>
                  <div className="bg-white rounded-xl shadow h-[440px]"></div>
              </div>
               {/* Skeleton para Charts */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white rounded-xl shadow h-[350px]"></div>
                   <div className="bg-white rounded-xl shadow h-[350px]"></div>
                   {/* Adicione mais se houver mais gráficos */}
               </div>
         </div>
     );
  }

  // Se, após carregar, ainda não tiver filter ou dashboard, mostra erro
  if (!filter || !dashboard) {
     return <p className="p-4 text-center text-gray-500">Dados essenciais não encontrados.</p>;
  }

  // --- Mensagem para selecionar filtros ---
  // Mostra SE os dados já carregaram MAS o usuário ainda não selecionou município OU ano
  if (!selectedMunicipio || !selectedAno) {
    return (
        <div className="mt-12 mb-6 bg-white rounded-xl shadow p-10 text-center border border-blue-100">
            <span className="material-symbols-outlined text-5xl text-blue-400 mb-4">manage_search</span> {/* Ícone diferente */}
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Selecione Município e Ano</h2>
            <p className="text-gray-500">Utilize os filtros no cabeçalho da página para carregar os dados educacionais específicos.</p>
        </div>
    );
  }

  // --- Funções Auxiliares ---
  const formatCurrency = (value: number): string =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // --- Funções de Renderização com Estilo Padronizado ---

  // Renderiza informações gerais do município selecionado
  const renderMunicipioInfo = () => (
    // Aplica estilo padrão ao container
    <div className="mt-6 mb-6 bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Informações: {selectedMunicipio?.nome || 'Município'} {/* Exibe nome se selecionado */}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Padroniza estilo dos cards de informação */}
          <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center sm:items-start sm:text-left">
              <span className="material-symbols-outlined text-blue-500 text-3xl">groups</span>
              <p className="text-sm mt-2 font-medium text-gray-600">População</p>
              <p className="text-xl font-semibold">{selectedMunicipio?.populacao?.toLocaleString('pt-BR') ?? 'N/A'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center sm:items-start sm:text-left">
              <span className="material-symbols-outlined text-green-500 text-3xl">trending_up</span>
              <p className="text-sm mt-2 font-medium text-gray-600">IDHM</p>
              <p className="text-xl font-semibold">{selectedMunicipio?.idhm?.toFixed(3) ?? 'N/A'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center sm:items-start sm:text-left">
              <span className="material-symbols-outlined text-purple-500 text-3xl">straighten</span>
              <p className="text-sm mt-2 font-medium text-gray-600">Área Total</p>
              <p className="text-xl font-semibold">{selectedMunicipio?.area_territorial?.toLocaleString('pt-BR')} km²</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center sm:items-start sm:text-left">
              <span className="material-symbols-outlined text-orange-500 text-3xl">public</span>
              <p className="text-sm mt-2 font-medium text-gray-600">Região</p>
              <p className="text-xl font-semibold">Nordeste</p> {/* Assumindo sempre Nordeste */}
          </div>
      </div>
    </div>
  );

  // Renderiza cards com investimento, IDEB e ENEM para o município/ano selecionados
  const renderSummaryCards = () => (
    // Aplica estilo padrão ao grid
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Card Investimento */}
        <div className="min-h-[440px] max-h-[440px] overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-blue-500 text-3xl mb-3">payments</span>
            <h3 className="text-lg font-semibold mb-2 text-blue-900">Investimento Educação ({selectedAno})</h3>
            <p className="text-2xl font-bold mb-4 text-blue-700">
                {municipioDespesa?.[0]?.despesa_total ? formatCurrency(municipioDespesa[0].despesa_total) : 'N/A'}
            </p>
            <div className="flex items-start gap-2 p-3 bg-blue-100 border border-blue-200 rounded-lg">
                <span className="material-symbols-outlined text-blue-600 text-xl mt-1 flex-shrink-0">info</span>
                <p className="text-sm text-blue-800">Investimento total em educação no município para o ano selecionado.</p>
            </div>
        </div>

        {/* Card Indicadores (IDEB/SAEB) */}
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

  // Renderiza os gráficos para o município/ano selecionados
  const renderCharts = () => {
      // Verifica se temos os dados filtrados necessários para os gráficos
      const hasEnemData = mediaEnem && mediaEnem.length > 0;
      const hasIdebData = indicadorIdeb && indicadorIdeb.length > 0;
      const hasDespesaData = municipioDespesa && municipioDespesa.length > 0;

      // Dados para gráficos de comparação (precisam dos dados gerais do filter)
      const allEnemData = filter?.medias_enem || [];
      const allIdebData = filter?.indicadores || [];
      const allDespesaData = filter?.municipios_despesas || [];

      const mediasEnemMunicipio = calcularMedias(mediaEnem || []); // Calcula média SÓ do município selecionado
      const mediasEnemParaiba = calcularMedias(allEnemData); // Calcula média GERAL

       // Calcula média SAEB/IDEB do município (considerando o ano ajustado)
       const mediasSaebMunicipio = calcularMedias(indicadorIdeb || []);
       // Calcula média SAEB/IDEB GERAL
       const mediasSaebParaiba = calcularMedias(allIdebData);


      return (
        // Aplica estilo padrão ao grid
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Gráfico Enem - Média por Área */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Enem - Média por Área</h3>
              {hasEnemData ? (
                <MediaEnemPorAreaChart
                  series={[{
                    name: `Média ${selectedMunicipio?.nome}`,
                    data: [
                      mediaEnem[0]?.media_cn, mediaEnem[0]?.media_ch, mediaEnem[0]?.media_lc,
                      mediaEnem[0]?.media_mt, mediaEnem[0]?.media_red
                    ].map(v => v?.toFixed(2) ?? 0) // Garante que seja número ou 0
                  }]}
                  categories={['Natureza', 'Humanas', 'Linguagens', 'Matemática', 'Redação']}
                />
              ) : <p className="text-center text-gray-500 py-10">Dados do ENEM indisponíveis.</p>}
            </div>

            {/* Gráfico Enem - Desempenho Disciplina (Exemplo, pode ser igual ao anterior ou diferente) */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Enem - Desempenho por Disciplina</h3>
              {hasEnemData ? (
                  <DesempenhoDisciplinaChart // Supondo que este gráfico use a mesma estrutura de dados
                      series={[{
                          name: `Média ${selectedMunicipio?.nome}`,
                          data: [
                            mediaEnem[0]?.media_cn, mediaEnem[0]?.media_ch, mediaEnem[0]?.media_lc,
                            mediaEnem[0]?.media_mt, mediaEnem[0]?.media_red
                          ].map(v => v?.toFixed(2) ?? 0)
                      }]}
                      categories={['Natureza', 'Humanas', 'Linguagens', 'Matemática', 'Redação']}
                   />
               ) : <p className="text-center text-gray-500 py-10">Dados do ENEM indisponíveis.</p>}
            </div>

            {/* Gráfico Enem - Investimento e Média */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Enem - Investimento e Média (Evolução)</h3>
               {/* Este gráfico precisa de dados de VÁRIOS anos */}
               {(allEnemData.length > 0 && allDespesaData.length > 0 && selectedMunicipio) ? (
                 <InvestimentoEnemChart
                   mediasEnem={allEnemData.filter(m => m.nome === selectedMunicipio?.nome)}
                   despesas={allDespesaData.filter(d => d.nome_municipio === selectedMunicipio?.nome)}
                 />
               ) : <p className="text-center text-gray-500 py-10">Dados históricos indisponíveis para este gráfico.</p>}
            </div>

             {/* Gráfico Enem - Município vs Paraíba */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Enem - Média Município vs Paraíba ({selectedAno})</h3>
              {(hasEnemData) ? ( // Precisa ter dados do município para comparar
                 <ComparativoMediaChart
                   mediasMunicipio={mediasEnemMunicipio}
                   mediasParaiba={mediasEnemParaiba}
                   chaves={['media_cn', 'media_ch', 'media_lc', 'media_mt', 'media_red']}
                   categoriasX={['CN', 'CH', 'LC', 'MT', 'Red.']} // Categorias curtas
                 />
               ) : <p className="text-center text-gray-500 py-10">Dados do ENEM indisponíveis para comparação.</p>}
            </div>

             {/* Gráfico SAEB - Município vs Paraíba */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">SAEB/IDEB - Município vs Paraíba ({indicadorIdeb?.[0]?.ano ?? selectedAno})</h3>
               {(hasIdebData) ? ( // Precisa ter dados do município para comparar
                 <ComparativoMediaChart
                   mediasMunicipio={mediasSaebMunicipio}
                   mediasParaiba={mediasSaebParaiba}
                   chaves={['nota_mt', 'nota_lp', 'ideb']} // Chaves corretas
                   categoriasX={['SAEB MT', 'SAEB LP', 'IDEB']}
                 />
                ) : <p className="text-center text-gray-500 py-10">Dados SAEB/IDEB indisponíveis para comparação.</p>}
            </div>

             {/* Gráfico Taxa de Aprovação */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Taxa de Aprovação (Evolução)</h3>
              {/* Este gráfico precisa de dados de VÁRIOS anos */}
              {(allIdebData.length > 0 && selectedMunicipio) ? (
                <TaxaAprovacaoChart
                  data={allIdebData.filter(i => i.nome_municipio === selectedMunicipio?.nome)}
                />
              ) : <p className="text-center text-gray-500 py-10">Dados históricos indisponíveis para este gráfico.</p>}
            </div>
        </div>
     );
  };

  //
  // --- Renderização Principal do Componente ---
  //
  return (
    <div className="w-full"> {/* Container principal */}
        {/* Renderiza o conteúdo APENAS se as seleções foram feitas */}
        {selectedMunicipio && selectedAno && (
            <>
                {renderMunicipioInfo()}
                {renderSummaryCards()}
                {renderCharts()}
                {/* Renderiza FAQs se existirem */}
                {dashboard?.faqs && <FaqSection faqs={dashboard.faqs} />}
            </>
        )}
        {/* A mensagem para selecionar filtros já é tratada acima */}
    </div>
  );
};