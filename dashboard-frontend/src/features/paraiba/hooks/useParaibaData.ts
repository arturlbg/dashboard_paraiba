import { useEffect, useState } from "react";
import {
  fetchDespesasParaiba,
  fetchIndicadoresEducacionais,
  fetchIndicadoresEducacionaisParaiba,
  fetchMediasEnemAgrupadaMunicipio,
  fetchMediasEnemParaiba,
  fetchMunicipiosDespesas
} from "../../../services/api";
import { IndicadorEducacional, Despesa, MediaEnem, IndicadorEducacionalMunicipio, DespesaMunicipio, MediaEnemMunicipio } from "../../../types";

interface ParaibaData {
  indicadoresParaiba: IndicadorEducacional[];
  despesasParaiba: Despesa[];
  mediasEnemParaiba: MediaEnem[];
  indicadoresMunicipios: IndicadorEducacionalMunicipio[];
  despesasMunicipios: DespesaMunicipio[];
  mediasEnemMunicipios: MediaEnemMunicipio[];
}

interface UseParaibaDataReturn {
  data: ParaibaData | null;
  isLoading: boolean;
  error: string | null;
}

export function useParaibaData(): UseParaibaDataReturn {
  const [data, setData] = useState<ParaibaData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [
          indicadoresParaibaRes,
          indicadoresMunicipiosRes,
          despesasParaibaRes,
          despesasMunicipiosRes,
          mediasEnemParaibaRes,
          mediasEnemMunicipiosRes
        ] = await Promise.all([
          fetchIndicadoresEducacionaisParaiba(),
          fetchIndicadoresEducacionais(),
          fetchDespesasParaiba(),
          fetchMunicipiosDespesas(),
          fetchMediasEnemParaiba(),
          fetchMediasEnemAgrupadaMunicipio()
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
          setData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []); 

  return { data, isLoading, error };
}