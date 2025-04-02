import React from 'react'
import Chart from 'react-apexcharts'

interface Props {
  series: any
}

export function InvestimentoDesempenhoChart({ series }: Props) {
  return (
    <Chart
      type="scatter"
      width="100%"
      height="300"
      series={series}
      options={{
        chart: { toolbar: { show: false } },
        xaxis: { title: { text: 'Investimento (R$)' } },
        yaxis: { title: { text: 'IDEB' } },
      }}
    />
  )
}
