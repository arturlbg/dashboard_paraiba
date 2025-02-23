import { React, useState, useEffect} from 'react'
import { getDashboardData } from '../hooks/getDashboardData'
import { getFilterData } from '../hooks/getFilterData'
import '../style.css' // Caso queira manter seu style.css
import { EvolucaoIdebChart } from '../components/charts/EvolucaoIdebChart'
import { InvestimentoDesempenhoChart } from '../components/charts/InvestimentoDesempenhoChart'
import { DistribuicaoRecursosChart } from '../components/charts/DistribuicaoRecursosChart'
import { DesempenhoDisciplinaChart } from '../components/charts/DesempenhoDisciplinaChart'
import { EvasaoChart } from '../components/charts/EvasaoChart'
import { ComparacaoIdebMunicipiosChart } from '../components/charts/ComparacaoIdebMunicipiosChart'
import { MediaEnemPorAreaChart } from '../components/charts/MediaEnemPorAreaChart'
import { GastosVsPopulacaoChart } from '../components/charts/GastosVsPopulacaoChart'
import { FaqSection } from '../components/FaqSection'
import Select from '../components/Select'

export const DashboardPage = () => {
  const { filter, isLoadingFilter, filterError} = getFilterData();
  const { dashboard, isLoadingDashboard, dashboardError } = getDashboardData();
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [selectedAno, setSelectedAno] = useState(null);
  const [mediaEnem, setMediaEnem] = useState(null);

  useEffect(() => {
    if (selectedMunicipio && selectedAno) {
      setMediaEnem(
        medias_enem.filter(
          (media) => media.nome == selectedMunicipio.nome && media.ano == selectedAno
        )
      );
    }
  }, [selectedMunicipio, selectedAno]);

  if (isLoadingDashboard || isLoadingFilter) return <p>Carregando dados...</p>
  if (dashboardError || filterError) return <p>Erro: {dashboardError}</p>
  if (!dashboard || !filter) return <p>Nenhum dado disponível.</p>

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
  } = dashboard
  
  const {
    municipios,
    anos,
    medias_enem
  } = filter

  //console.log(medias_enem);

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
              {/* HEADER */}
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

              {/* INFO DO MUNICÍPIO */}
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
  
              {/* CARDS DE RESUMO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {/* Investimento em Educação */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <span className="material-symbols-outlined text-blue-500 text-3xl mb-2">
                    payments
                  </span>
                  <h3 className="text-lg font-semibold mb-2">Investimento em Educação</h3>
                  <p className="text-2xl font-bold">
                    R$ {(investimentoEducacao / 1_000_000_000).toFixed(1)}B
                  </p>
                  <div className="flex items-start gap-2 mt-3 p-3 bg-blue-200/50 rounded-lg">
                    <div className="flex flex-col gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-xl mt-1 hover:scale-110 transition-transform">
                        group
                      </span>
                      <p className="text-sm text-gray-600 mt-2">
                        O investimento em educação é proveniente do governo federal, é
                        proporcional ao número de habitantes
                      </p>
                    </div>
                  </div>
                </div>
  
                {/* IDEB Médio */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <span className="material-symbols-outlined text-green-500 text-3xl mb-2">
                    school
                  </span>
                  <h3 className="text-lg font-semibold mb-2">IDEB Médio</h3>
                  <p className="text-2xl font-bold">{idebMedio}</p>
                  <div className="flex items-start gap-2 mt-3 p-3 bg-green-200/50 rounded-lg">
                    <div className="flex flex-col gap-2">
                      <span className="material-symbols-outlined text-green-600 text-xl mt-1 hover:scale-110 transition-transform">
                        lightbulb
                      </span>
                      <p className="text-sm text-green-800">
                        O IDEB (Indice de Desenvolvimento da Educação Básica) é calculado
                        com base na taxa de aprovação escolar e nas médias de desempenho nos
                        exames do Saeb. O Ideb varia de 0 a 10, sendo que quanto maior o Ideb,
                        melhor o desempenho dos alunos
                      </p>
                    </div>
                  </div>
                </div>
  
                {/* Média ENEM */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <span className="material-symbols-outlined text-purple-500 text-3xl mb-2">
                    analytics
                  </span>
                  <h3 className="text-lg font-semibold mb-2">Média ENEM</h3>
                  <p className="text-2xl font-bold">{mediaEnem ? mediaEnem[0].media_geral : 0.00}</p>
                  <div className="flex flex-col gap-2 mt-2">
                    <button className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-200 rounded-full hover:bg-purple-300 transition-colors">
                      <span className="material-symbols-outlined text-sm">menu_book</span>
                      Linguagens
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-200 rounded-full hover:bg-purple-300 transition-colors">
                      <span className="material-symbols-outlined text-sm">history_edu</span>
                      Ciências Humanas
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-200 rounded-full hover:bg-purple-300 transition-colors">
                      <span className="material-symbols-outlined text-sm">science</span>
                      Ciências da Natureza
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-200 rounded-full hover:bg-purple-300 transition-colors">
                      <span className="material-symbols-outlined text-sm">functions</span>
                      Matemática
                    </button>
                  </div>
                </div>
              </div>
  
              {/* GRÁFICOS (8 ao todo) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* 1) Evolução do IDEB */}
                <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-4">Evolução do IDEB</h3>
                  <EvolucaoIdebChart
                    series={evolucaoIdeb.series}
                    categories={evolucaoIdeb.categories}
                  />
                </div>
  
                {/* 2) Investimento vs Desempenho */}
                <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-4">Investimento vs Desempenho</h3>
                  <InvestimentoDesempenhoChart series={investimentoDesempenho.series} />
                </div>
  
                {/* 3) Distribuição de Recursos */}
                <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-4">Distribuição de Recursos por Área</h3>
                  <DistribuicaoRecursosChart
                    series={distribuicaoRecursos.series}
                    labels={distribuicaoRecursos.labels}
                  />
                </div>
  
                {/* 4) Desempenho por Disciplina */}
                <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-4">Desempenho por Disciplina</h3>
                  <DesempenhoDisciplinaChart
                    series={desempenhoDisciplina.series}
                    categories={desempenhoDisciplina.categories}
                  />
                </div>
  
                {/* 5) Evolução da Taxa de Evasão */}
                <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-4">Evolução da Taxa de Evasão</h3>
                  <EvasaoChart
                    series={evasao.series}
                    categories={evasao.categories}
                  />
                </div>
  
                {/* 6) Comparação de IDEB entre Municípios */}
                <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-4">
                    Comparação de IDEB entre Municípios
                  </h3>
                  <ComparacaoIdebMunicipiosChart
                    series={comparacaoIdeb.series}
                    categories={comparacaoIdeb.categories}
                  />
                </div>
  
                {/* 7) Média ENEM por Área */}
                <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-4">Média ENEM por Área</h3>
                  <MediaEnemPorAreaChart
                    series={mediaEnemPorArea.series}
                    categories={mediaEnemPorArea.categories}
                  />
                </div>
  
                {/* 8) Tendência de Gastos vs População Estudantil */}
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
  
              {/* SEÇÃO DE PERGUNTAS (Accordion) */}
              <FaqSection faqs={faqs} />
            </>
          )}
        </div>
      </div>
    </div>
  );
  
}
