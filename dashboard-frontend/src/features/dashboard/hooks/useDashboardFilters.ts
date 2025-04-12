import { useEffect, useState } from 'react';
import {
  fetchIndicadoresEducacionais,
  fetchMediasEnemAgrupadaMunicipio,
  fetchMunicipios,
  fetchMunicipiosDespesas
} from '../../../services/api'; // Corrected path
import { Municipio, MediaEnem, IndicadorEducacional, DespesaMunicipio, Ano, DashboardFilterData } from '../../../types'; // Assuming types are defined

interface UseDashboardFiltersReturn {
  filterData: DashboardFilterData | null;
  isLoading: boolean;
  error: string | null;
}

// Renamed hook
export function useDashboardFilters(): UseDashboardFiltersReturn {
  const [filterData, setFilterData] = useState<DashboardFilterData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Define anos consistently
  const anos: Ano[] = [
    { ano: '2019' }, { ano: '2020' }, { ano: '2021' }, { ano: '2022' }, { ano: '2023' },
  ];

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all required data concurrently
        const [
          municipiosRes,
          mediasEnemRes,
          despesasMunicipiosRes,
          indicadoresRes
        ] = await Promise.all([
          fetchMunicipios(),
          fetchMediasEnemAgrupadaMunicipio(),
          fetchMunicipiosDespesas(),
          fetchIndicadoresEducacionais()
        ]);

        // Validate responses (basic check for array)
        if (!Array.isArray(municipiosRes) || !Array.isArray(mediasEnemRes) || !Array.isArray(despesasMunicipiosRes) || !Array.isArray(indicadoresRes)) {
             throw new Error("Formato de dados inválido recebido da API.");
        }

        setFilterData({
          municipios: municipiosRes,
          anos: anos, // Use the defined Ano array
          mediasEnem: mediasEnemRes,
          indicadores: indicadoresRes,
          despesasMunicipios: despesasMunicipiosRes,
        });
      } catch (err) {
        console.error("Erro ao buscar dados para filtros:", err);
        setError('Erro ao buscar dados dos filtros. Verifique a API.');
        setFilterData(null); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []); // Empty dependency array means this runs once on mount

  return { filterData, isLoading, error };
}