import { useEffect, useState } from 'react'
import { fetchDashboardData } from '../services/api'

interface DashboardData {
  investimentoEducacao: number
  idebMedio: number
  mediaEnemGeral: number
  evolucaoIdeb: any
  investimentoDesempenho: any
  distribuicaoRecursos: any
  desempenhoDisciplina: any
  evasao: any
  comparacaoIdeb: any
  mediaEnemPorArea: any
  gastosPopulacao: any
  faqs: Array<{
    question: string
    answer: string
  }>
}

export function getDashboardMunicipiosData() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true)
  const [dashboardError, setDashboardError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
        try {
            setIsLoadingDashboard(true)
            const data = await fetchDashboardData() // Faz a requisição dos dados
        setDashboard(data)
      } catch (err) {
        setDashboardError('Erro ao buscar dados do dashboard.')
      } finally {
        setIsLoadingDashboard(false)
      }
    }
    loadData()
  }, [])

  return { dashboard, isLoadingDashboard, dashboardError }
}
