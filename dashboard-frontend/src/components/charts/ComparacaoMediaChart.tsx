import React from 'react'
import Chart from 'react-apexcharts'

interface Props {
  mediasMunicipio: Record<string, number>
  mediasParaiba: Record<string, number>
  categoriasX: string[] // nomes bonitinhos tipo "Matemática", "Linguagens" etc.
  chaves: string[] // chaves reais dos dados, tipo "media_mt", "media_lc" etc.
}

export function ComparativoMediaChart({
  mediasMunicipio,
  mediasParaiba,
  categoriasX,
  chaves,
}: Props) {
  const series = [
    {
      name: 'Município',
      data: chaves.map((key) => mediasMunicipio[key]),
    },
    {
      name: 'Paraíba',
      data: chaves.map((key) => mediasParaiba[key]),
    },
  ]

  return (
    <Chart
      type="bar"
      height="350"
      series={series}
      options={{
        chart: {
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '50%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: categoriasX,
        },
        legend: {
          position: 'top',
        },
      }}
    />
  )
}
