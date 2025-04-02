import React from 'react'
import Chart from 'react-apexcharts'

interface Props {
  series: number[]
  labels: string[]
}

export function DistribuicaoRecursosChart({ series, labels }: Props) {
  return (
    <Chart
      type="pie"
      width="100%"
      height="300"
      series={series}
      options={{
        chart: { toolbar: { show: false } },
        labels,
      }}
    />
  )
}
