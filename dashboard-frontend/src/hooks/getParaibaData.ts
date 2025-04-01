import { useEffect, useState } from "react"
import { fetchDespesasParaiba, fetchIndicadoresEducacionaisParaiba, fetchMediasEnemParaiba } from "../services/api"

export function getParaibaData() {
    const [data, setdata] = useState<data | null>(null)
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [dataError, setDataError] = useState<string | null>(null)
    
    useEffect(() => {
        async function loadData() {
            try{
                setIsLoadingData(true)
                const indicadores = await fetchIndicadoresEducacionaisParaiba()
                const despesas = await fetchDespesasParaiba()
                const medias_enem = await fetchMediasEnemParaiba();
                setdata({
                    indicadores: indicadores,
                    despesas: despesas,
                    medias_enem: medias_enem
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