import { useEffect, useState } from "react";
import {
  fetchDespesasParaiba,
  fetchIndicadoresEducacionais,
  fetchIndicadoresEducacionaisParaiba,
  fetchMediasEnemAgrupadaMunicipio,
  fetchMediasEnemParaiba,
  fetchMunicipiosDespesas
} from "../../../services/api"; // Corrected path
import { IndicadorEducacional, Despesa, MediaEnem, IndicadorEducacionalMunicipio, DespesaMunicipio, MediaEnemMunicipio } from "../../../types"; // Import shared types

// Define a specific type for the hook's return value
interface ParaibaData {
  indicadoresParaiba: IndicadorEducacional[];
  despesasParaiba: Despesa[];
  mediasEnemParaiba: MediaEnem[];
  indicadoresMunicipios: IndicadorEducacionalMunicipio[]; // Use more specific type if possible
  despesasMunicipios: DespesaMunicipio[]; // Use more specific type if possible
  mediasEnemMunicipios: MediaEnemMunicipio[]; // Use more specific type if possible
}

interface UseParaibaDataReturn {
  data: ParaibaData | null;
  isLoading: boolean;
  error: string | null;
}

// Renamed hook
export function useParaibaData(): UseParaibaDataReturn {
  const [data, setData] = useState<ParaibaData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state update on unmounted component

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all required data concurrently
        const [
          indicadoresParaibaRes,
          indicadoresMunicipiosRes,
          despesasParaibaRes,
          despesasMunicipiosRes,
          mediasEnemParaibaRes,
          mediasEnemMunicipiosRes
        ] = await Promise.all([
          fetchIndicadoresEducacionaisParaiba(),
          fetchIndicadoresEducacionais(), // Assuming this fetches municipio level for Paraiba dashboard
          fetchDespesasParaiba(),
          fetchMunicipiosDespesas(), // Assuming this fetches municipio level for Paraiba dashboard
          fetchMediasEnemParaiba(),
          fetchMediasEnemAgrupadaMunicipio() // Assuming this fetches municipio level for Paraiba dashboard
        ]);

        // Basic validation
        if (!Array.isArray(indicadoresParaibaRes) || !Array.isArray(indicadoresMunicipiosRes) ||
            !Array.isArray(despesasParaibaRes) || !Array.isArray(despesasMunicipiosRes) ||
            !Array.isArray(mediasEnemParaibaRes) || !Array.isArray(mediasEnemMunicipiosRes)) {
             throw new Error("Formato de dados inválido recebido da API.");
        }


        if (isMounted) {
          setData({
            indicadoresParaiba: indicadoresParaibaRes,
            indicadoresMunicipios: indicadoresMunicipiosRes,
            despesasParaiba: despesasParaibaRes,
            despesasMunicipios: despesasMunicipiosRes,
            mediasEnemParaiba: mediasEnemParaibaRes,
            mediasEnemMunicipios: mediasEnemMunicipiosRes,
          });
        }
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard da Paraíba:", err);
        if (isMounted) {
          setError('Erro ao buscar dados do dashboard da Paraíba.');
          setData(null); // Clear data on error
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return { data, isLoading, error };
}