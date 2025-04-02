import React from 'react'
import Chart from 'react-apexcharts'

interface MediaEnem {
  nome: string
  media_geral: number
  ano: string
}

interface Despesa {
  nome_municipio: string
  ano: string
  despesa_total: number
}

interface DadosEnemDespesa {
  ano: string
  despesa: number
  mediaEnem: number
}

interface Props {
  mediasEnem: MediaEnem[]
  despesas: Despesa[]
}

export function InvestimentoEnemChart({ mediasEnem, despesas }: Props) {
  const processarDados = (): DadosEnemDespesa[] => {
    const mediasPorAno = mediasEnem.reduce((acc, media) => {
      acc[media.ano] = media.media_geral
      return acc
    }, {} as Record<string, number>)

    const despesasPorAno = despesas.reduce((acc, despesa) => {
      acc[despesa.ano] = despesa.despesa_total
      return acc
    }, {} as Record<string, number>)

    const anosDisponiveis = Array.from(
      new Set([...Object.keys(mediasPorAno), ...Object.keys(despesasPorAno)])
    ).sort()

    return anosDisponiveis.map(ano => ({
      ano,
      despesa: despesasPorAno[ano] || 0,
      mediaEnem: mediasPorAno[ano] || 0
    }))
  }

  const dadosProcessados = processarDados()

  const series = [
    {
      name: 'Despesa em Educação',
      type: 'column',
      data: dadosProcessados.map(item => item.despesa)
    },
    {
      name: 'Média ENEM',
      type: 'line',
      data: dadosProcessados.map(item => item.mediaEnem)
    }
  ]

  const options = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      height: 350
    },
    stroke: {
      width: [0, 4]
    },
    xaxis: {
      categories: dadosProcessados.map(item => item.ano)
    },
    yaxis: [
      {
        seriesName: 'Despesa em Educação',
        title: {
          text: 'Despesa (R$)',
        },
      },
      {
        seriesName: 'Média ENEM',
        opposite: true,
        title: {
          text: 'Média ENEM',
        },
      }
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (value, { series, seriesIndex }) {
          if (seriesIndex === 0) {
            return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          }
          return value.toFixed(2)
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    }
  }

  return (
    <Chart
      type="line"
      height={350}
      series={series}
      options={options}
      width="100%"
    />
  )
}