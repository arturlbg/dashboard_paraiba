import { React, useState, useEffect } from 'react';
import { getDashboardData } from '../hooks/getDashboardData';
import { getFilterData } from '../hooks/getFilterData';
import '../style.css';
import { EvolucaoIdebChart } from '../components/charts/EvolucaoIdebChart';
import { InvestimentoDesempenhoChart } from '../components/charts/InvestimentoDesempenhoChart';
import { DistribuicaoRecursosChart } from '../components/charts/DistribuicaoRecursosChart';
import { DesempenhoDisciplinaChart } from '../components/charts/DesempenhoDisciplinaChart';
import { EvasaoChart } from '../components/charts/EvasaoChart';
import { ComparacaoIdebMunicipiosChart } from '../components/charts/ComparacaoIdebMunicipiosChart';
import { MediaEnemPorAreaChart } from '../components/charts/MediaEnemPorAreaChart';
import { GastosVsPopulacaoChart } from '../components/charts/GastosVsPopulacaoChart';
import { FaqSection } from '../components/FaqSection';
import Select from '../components/Select';

export const DashboardPage = () => {
  const { filter, isLoadingFilter, filterError } = getFilterData();
  const { dashboard, isLoadingDashboard, dashboardError } = getDashboardData();
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [selectedAno, setSelectedAno] = useState(null);
  const [mediaEnem, setMediaEnem] = useState(null);
  const [indicadorIdeb, setIndicadorIdeb] = useState(null);

  useEffect(() => {
    if (selectedMunicipio && selectedAno && filter?.medias_enem && filter?.indicadores) {
      setMediaEnem(
        filter.medias_enem.filter(
          (media) => media.nome === selectedMunicipio.nome && media.ano === selectedAno
        )
      );
      
      let idebAno = null;
      switch (selectedAno) {
        case "2019":
        case "2020":
          idebAno = "2019";
          break;
        case "2021":
        case "2022":
          idebAno = "2021";
          break;
        case "2023":
          idebAno = "2023";
          break;
        default:
          idebAno = selectedAno;
      }

      setIndicadorIdeb(
        filter.indicadores.filter(
          (indicador) => 
            indicador.nome_municipio === selectedMunicipio.nome && 
            indicador.ano === idebAno
        )
      );
    }
  }, [selectedMunicipio, selectedAno, filter]);

  if (isLoadingDashboard || isLoadingFilter) return <p>Carregando dados...</p>;
  if (dashboardError || filterError) return <p>Erro: {dashboardError || filterError}</p>;
  if (!dashboard || !filter) return <p>Nenhum dado disponível.</p>;

  const {
    investimentoEducacao,
    idebMedio,
    mediaEnemGeral,
    evolucaoIdeb,
    investimentoDesempenho,
    distribuicaoRecursos,
    desempenhoDisciplina,
    evasao,
    comparacaoIdeb,
    mediaEnemPorArea,
    gastosPopulacao,
    faqs,
  } = dashboard;
  
  const {
    municipios,
    anos,
  } = filter;

  const renderMunicipioInfo = () => (
    <div className="mt-24 mb-6 bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Informações do Município</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="material-symbols-outlined text-blue-500">
            location_city
          </span>
          <p className="text-sm mt-2">População</p>
          <p className="text-lg font-semibold">
            {selectedMunicipio?.populacao} habitantes
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="material-symbols-outlined text-green-500">
            trending_up
          </span>
          <p className="text-sm mt-2">IDH</p>
          <p className="text-lg font-semibold">{selectedMunicipio?.idhm}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="material-symbols-outlined text-purple-500">
            straighten
          </span>
          <p className="text-sm mt-2">Área Total</p>
          <p className="text-lg font-semibold">{selectedMunicipio?.area_territorial} km²</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="material-symbols-outlined text-orange-500">public</span>
          <p className="text-sm mt-2">Região</p>
          <p className="text-lg font-semibold">Nordeste</p>
        </div>
      </div>
    </div>
  );

  const renderHeader = () => (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Bandeira_da_Para%C3%ADba.svg"
            alt="Bandeira da Paraíba"
            className="w-10 h-7 sm:w-12 sm:h-8"
          />
          <div className="flex items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold">
              Dashboard Educacional - Paraíba
            </h1>
            <div className="flex items-center bg-neutral-100 rounded-full p-1">
              <button 
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all bg-primary-500 text-white"
              >
                Região
              </button>
              <button 
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all bg-gray-300 text-black"
              >
                Município
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <Select 
            data={municipios} 
            value={selectedMunicipio} 
            onChange={setSelectedMunicipio} 
            labelKey="nome" 
          />
          <Select
            data={anos}
            value={selectedAno}
            onChange={setSelectedAno}
            labelKey="ano"
          />
        </div>
      </div>
    </header>
  );

  const renderSummaryCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
      {/* Investimento em Educação */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 h-full">
        <span className="material-symbols-outlined text-blue-500 text-3xl mb-3">
          payments
        </span>
        <h3 className="text-lg font-semibold mb-2">Investimento em Educação</h3>
        <p className="text-2xl font-bold mb-4">
          R$ {(investimentoEducacao / 1_000_000_000).toFixed(1)}B
        </p>
        <div className="flex items-start gap-2 p-3 bg-blue-200/50 rounded-lg">
          <span className="material-symbols-outlined text-blue-600 text-xl mt-1">
            group
          </span>
          <p className="text-sm text-gray-600">
            O investimento em educação é proveniente do governo federal, é
            proporcional ao número de habitantes
          </p>
        </div>
      </div>

      {/* IDEB Médio */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 h-full">
        <span className="material-symbols-outlined text-green-500 text-3xl mb-3">
          school
        </span>
        <h3 className="text-lg font-semibold mb-2">IDEB Médio</h3>
        <p className="text-2xl font-bold mb-4">
          {indicadorIdeb?.[0]?.ideb || "N/A"}
        </p>
        
        <div className="relative group mb-4">
          <div className="flex items-center gap-2 p-3 bg-amber-100 rounded-lg border border-amber-300 cursor-help">
            <span className="material-symbols-outlined text-amber-500 text-xl">
              warning
            </span>
            <p className="text-sm text-amber-700 font-medium">
              Passe o mouse para mais informações
            </p>
          </div>
          <div className="absolute left-0 right-0 mt-2 p-3 bg-white shadow-lg rounded-lg border border-amber-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-amber-600 text-xl mt-1">
                info
              </span>
              <p className="text-sm text-gray-700">
                Os indicadores educacionais mostram o desempenho da escola de acordo com diferentes
                métricas oficiais, permitindo compreender os resultados educacionais obtidos.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {[
            { label: 'IDEB', value: indicadorIdeb?.[0]?.ideb || "N/A", icon: 'analytics' },
            { label: 'Taxa de Aprovação', value: '95%', icon: 'analytics' },
            { label: 'Saeb Matemática', value: indicadorIdeb?.[0]?.nota_saeb_matematica || "N/A", icon: 'functions' },
            { label: 'Saeb Língua Port.', value: indicadorIdeb?.[0]?.nota_saeb_lingua_portuguesa || "N/A", icon: 'menu_book' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-2 px-3 py-2 text-sm bg-green-200 rounded-full hover:bg-green-300 transition-colors group cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              <span className="font-semibold bg-green-50 px-2 py-0.5 rounded-full group-hover:bg-green-400 group-hover:text-white transition-colors">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Média ENEM */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 h-full">
        <span className="material-symbols-outlined text-purple-500 text-3xl mb-3">
          analytics
        </span>
        <h3 className="text-lg font-semibold mb-2">Média ENEM</h3>
        <p className="text-2xl font-bold mb-4">{mediaEnem?.[0]?.media_geral || "N/A"}</p>

        <div className="flex flex-col gap-2">
          {[
            { label: 'Linguagens', value: mediaEnem?.[0]?.media_lc, icon: 'menu_book' },
            { label: 'Ciências Humanas', value: mediaEnem?.[0]?.media_ch, icon: 'history_edu' },
            { label: 'Ciências da Natureza', value: mediaEnem?.[0]?.media_cn, icon: 'science' },
            { label: 'Matemática', value: mediaEnem?.[0]?.media_mt, icon: 'functions' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-2 px-3 py-2 text-sm bg-purple-200 rounded-full hover:bg-purple-300 transition-colors group cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              <span className="font-semibold bg-purple-50 px-2 py-0.5 rounded-full group-hover:bg-purple-400 group-hover:text-white transition-colors">
                {item.value?.toFixed(2) || "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">Evolução do IDEB</h3>
        <EvolucaoIdebChart
          series={evolucaoIdeb.series}
          categories={evolucaoIdeb.categories}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">Investimento vs Desempenho</h3>
        <InvestimentoDesempenhoChart series={investimentoDesempenho.series} />
      </div>

      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">Distribuição de Recursos por Área</h3>
        <DistribuicaoRecursosChart
          series={distribuicaoRecursos.series}
          labels={distribuicaoRecursos.labels}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">Desempenho por Disciplina</h3>
        <DesempenhoDisciplinaChart
          series={desempenhoDisciplina.series}
          categories={desempenhoDisciplina.categories}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">Evolução da Taxa de Evasão</h3>
        <EvasaoChart
          series={evasao.series}
          categories={evasao.categories}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">
          Comparação de IDEB entre Municípios
        </h3>
        <ComparacaoIdebMunicipiosChart
          series={comparacaoIdeb.series}
          categories={comparacaoIdeb.categories}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">Média ENEM por Área</h3>
        <MediaEnemPorAreaChart
          series={mediaEnemPorArea.series}
          categories={mediaEnemPorArea.categories}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">
          Tendência de Gastos vs População Estudantil
        </h3>
        <GastosVsPopulacaoChart
          series={gastosPopulacao.series}
          categories={gastosPopulacao.categories}
        />
      </div>
    </div>
  );

  return (
    <div id="webcrumbs">
      <div className="w-full min-h-screen bg-neutral-50">
        <div className="w-full min-h-screen p-4 lg:p-6">
          {isLoadingDashboard || isLoadingFilter ? (
            <div className="p-4">Carregando dados...</div>
          ) : dashboardError || filterError ? (
            <div className="p-4 text-red-500">{filterError || "Erro ao carregar filtros."}</div>
          ) : !filter || !dashboard ? (
            <div className="p-4">Nenhum dado disponível.</div>
          ) : (
            <>
              {renderHeader()}
              {renderMunicipioInfo()}
              {renderSummaryCards()}
              {renderCharts()}
              <FaqSection faqs={faqs} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};