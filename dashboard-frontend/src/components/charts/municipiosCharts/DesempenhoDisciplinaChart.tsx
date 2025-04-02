import React from 'react'
import Chart from 'react-apexcharts'

interface Props {
  series: any
  categories: string[]
}

export function DesempenhoDisciplinaChart({ series, categories }: Props) {
  return (
    <Chart
      type="radar"
      width="100%"
      height="300"
      series={series}
      options={{
        chart: { toolbar: { show: false } },
        xaxis: { categories },
      }}
    />
  )
}
