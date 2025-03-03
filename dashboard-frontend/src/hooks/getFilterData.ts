import { useEffect, useState } from 'react'
import { fetchIndicadoresEducacionais, fetchMediasEnemAgrupadaMunicipio, fetchMunicipios } from '../services/api'

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
                const medias_enem = await fetchMediasEnemAgrupadaMunicipio()
                const indicadores_educacionais = await fetchIndicadoresEducacionais()
                setFilter({
                    municipios: municipios,
                    anos: anos,
                    medias_enem: medias_enem,
                    indicadores: indicadores_educacionais
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