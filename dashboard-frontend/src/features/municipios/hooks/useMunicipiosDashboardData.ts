import { useEffect, useState } from 'react';
import { fetchDashboardData } from '../../../services/api'; // Corrected path
import { FaqItem } from '../../../types'; // Assuming type is defined

// Define a more specific type for the dashboard data
interface MunicipiosDashboardData {
  investimentoEducacao: number;
  idebMedio: number;
  mediaEnemGeral: number;
  evolucaoIdeb?: ApexAxisChartSeries | ApexNonAxisChartSeries; // Use Apex types if possible, or keep 'any' if structure varies wildly
  investimentoDesempenho?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  distribuicaoRecursos?: { series: number[]; labels: string[] };
  desempenhoDisciplina?: { series: ApexAxisChartSeries | ApexNonAxisChartSeries; categories: string[] };
  evasao?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  comparacaoIdeb?: { series: ApexAxisChartSeries | ApexNonAxisChartSeries; categories: string[] };
  mediaEnemPorArea?: { series: ApexAxisChartSeries | ApexNonAxisChartSeries; categories: string[] };
  gastosPopulacao?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  faqs: FaqItem[];
}

interface UseMunicipiosDashboardDataReturn {
  dashboardData: MunicipiosDashboardData | null;
  isLoading: boolean;
  error: string | null;
}

// Renamed hook to follow convention 'use...'
export function useMunicipiosDashboardData(): UseMunicipiosDashboardDataReturn {
  const [dashboardData, setDashboardData] = useState<MunicipiosDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state update on unmounted component

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        // NOTE: fetchDashboardData currently returns mock data.
        // Replace with actual API call if backend provides this aggregated view.
        const data: MunicipiosDashboardData = await fetchDashboardData(); // Assume API returns data matching the interface
        if (isMounted) {
          setDashboardData(data);
        }
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard de municípios:", err);
        if (isMounted) {
          setError('Erro ao buscar dados do dashboard. Tente novamente.');
          setDashboardData(null); // Clear data on error
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array means this runs once on mount

  return { dashboardData, isLoading, error };
}