import { useEffect, useState } from 'react'
import { fetchMunicipios } from '../services/api'

interface Filter{
    municipios: {
        id: number
        nome: string
        area_territorial: number
        populacao: number
        densidade_demografica: number
        idhm: number
        receitas_brutas: number
        despesas_brutas: number
        pib_per_capita: number
    }
    anos: string
}

export function getFilterData() {
    const [filter, setFilter] = useState<Filter | null>(null)
    const [isLoadingFilter, setIsLoadingFilter] = useState(true)
    const [filterError, setFilterError] = useState<string | null>(null)
    const anos = ['2019', '2020', '2021', '2022', '2023']
    
    useEffect(() => {
        async function loadData() {
            try{
                setIsLoadingFilter(true)
                const municipios = await fetchMunicipios()
                setFilter({
                    municipios: municipios,
                    anos: anos
                })
            } catch (err) {
                setFilterError('Erro ao buscar dados do dashboard.')
            } finally {
                setIsLoadingFilter(false)
            }
        }
        loadData()
    }, [])

    return { filter, isLoadingFilter, filterError}
}