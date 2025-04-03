import { useEffect, useState } from "react"
import { fetchDespesasParaiba, fetchIndicadoresEducacionais, fetchIndicadoresEducacionaisParaiba, fetchMediasEnemAgrupadaMunicipio, fetchMediasEnemParaiba, fetchMunicipiosDespesas } from "../services/api"

export function getParaibaData() {
    const [data, setdata] = useState<data | null>(null)
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [dataError, setDataError] = useState<string | null>(null)
    
    useEffect(() => {
        async function loadData() {
            try{
                setIsLoadingData(true)
                const indicadores_paraiba = await fetchIndicadoresEducacionaisParaiba();
                const indicadores_municipios = await fetchIndicadoresEducacionais();
                const despesas_paraiba = await fetchDespesasParaiba();
                const despesas_municipios = await fetchMunicipiosDespesas();
                const medias_enem_paraiba = await fetchMediasEnemParaiba();
                const medias_enem_municipios = await fetchMediasEnemAgrupadaMunicipio();
                setdata({
                    indicadores_paraiba: indicadores_paraiba,
                    indicadores_municipios: indicadores_municipios,
                    despesas_paraiba: despesas_paraiba,
                    despesas_municipios: despesas_municipios,
                    medias_enem_paraiba: medias_enem_paraiba,
                    medias_enem_municipios: medias_enem_municipios
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