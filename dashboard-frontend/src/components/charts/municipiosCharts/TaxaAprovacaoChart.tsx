import React from 'react'
import Chart from 'react-apexcharts'

interface Dado {
  ano: number
  fluxo: number // valor de 0 a 1
}

interface Props {
  data: Dado[]
}

export function TaxaAprovacaoChart({ data }: Props) {
  const charts = data.map((item, index) => {
    const valor = parseFloat((item.fluxo * 100).toFixed(2))

    const cores = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0']
    const cor = cores[index % cores.length]

    return (
      <div key={item.ano} style={{ width: '220px', margin: '1rem', textAlign: 'center' }}>
        <Chart
          type="radialBar"
          series={[valor]}
          options={{
            chart: { toolbar: { show: false } },
            plotOptions: {
              radialBar: {
                startAngle: -90,
                endAngle: 90,
                hollow: { size: '60%' },
                dataLabels: {
                  name: {
                    show: true,
                    offsetY: 20,
                    fontSize: '14px',
                  },
                  value: {
                    formatter: (val) => `${val}%`,
                    fontSize: '20px',
                    offsetY: -10,
                  },
                },
              },
            },
            labels: [`${item.ano}`],
            colors: [cor],
          }}
        />
      </div>
    )
  })

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        width: '100%',
        padding: '1rem',
      }}
    >
      {charts}
    </div>
  )
}
