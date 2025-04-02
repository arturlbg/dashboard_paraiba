import { useEffect, useState } from "react"
import { fetchDespesasParaiba, fetchIndicadoresEducacionais, fetchIndicadoresEducacionaisParaiba, fetchMediasEnemParaiba, fetchMunicipiosDespesas } from "../services/api"

export function getParaibaData() {
    const [data, setdata] = useState<data | null>(null)
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [dataError, setDataError] = useState<string | null>(null)
    
    useEffect(() => {
        async function loadData() {
            try{
                setIsLoadingData(true)
                const indicadores = await fetchIndicadoresEducacionaisParaiba();
                const despesas_paraiba = await fetchDespesasParaiba();
                const medias_enem = await fetchMediasEnemParaiba();
                const despesas_municipios = await fetchMunicipiosDespesas();
                const indicadores_municipios = await fetchIndicadoresEducacionais();
                setdata({
                    indicadores: indicadores,
                    despesas_paraiba: despesas_paraiba,
                    despesas_municipios: despesas_municipios,
                    medias_enem: medias_enem,
                    indicadores_municipios: indicadores_municipios
                })
            } catch (err) {
                setDataError('Erro ao buscar dados do dashboard da Paraíba.')
            } finally {
                setIsLoadingData(false)
            }
        }
        loadData()
    }, [])

    return { data, isLoadingData, dataError}
}