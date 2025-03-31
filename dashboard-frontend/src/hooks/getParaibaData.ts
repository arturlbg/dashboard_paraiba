import { useEffect, useState } from "react"
import { fetchDespesasParaiba, fetchIndicadoresEducacionaisParaiba } from "../services/api"

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
                const medias_enem = [];
                setdata({
                    indicadores: indicadores,
                    despesas: despesas
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