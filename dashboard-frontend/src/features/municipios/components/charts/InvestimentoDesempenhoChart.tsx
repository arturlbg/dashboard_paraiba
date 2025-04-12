import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface InvestimentoDesempenhoChartProps {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries; // Expects scatter data format: [{ name: '...', data: [[x1, y1], [x2, y2], ...] }]
  title?: string;
}

export function InvestimentoDesempenhoChart({
    series,
    title = "Investimento vs. Desempenho (IDEB)"
}: InvestimentoDesempenhoChartProps): JSX.Element {

  const options: ApexOptions = {
    chart: {
      type: 'scatter',
      height: 300,
      zoom: {
        enabled: true,
        type: 'xy' // Allow zooming on both axes
      },
      toolbar: {
        show: true, // Show toolbar for zooming/panning
        tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
        }
      },
      fontFamily: 'Open Sans, sans-serif',
    },
    xaxis: {
      tickAmount: 10, // Adjust number of ticks
      title: {
        text: 'Investimento (R$)',
         style: {
             color: '#555',
             fontSize: '12px',
             fontWeight: 500,
         }
      },
      labels: {
        formatter: (value: string | number, timestamp?: number, opts?: any) => { // Ajuste a assinatura
          const numericValue = typeof value === 'number' ? value : parseFloat(value);
          if (numericValue >= 1e6) return (numericValue / 1e6).toFixed(1) + ' Mi';
          if (numericValue >= 1e3) return (numericValue / 1e3).toFixed(0) + ' Mil';
          return numericValue.toFixed(0);
        },
         style: {
             fontSize: '11px',
             colors: '#555',
         }
      }
    },
    yaxis: {
      tickAmount: 6,
      title: {
        text: 'IDEB',
         style: {
             color: '#555',
             fontSize: '12px',
             fontWeight: 500,
         }
      },
       labels: {
         formatter: (value: number) => value.toFixed(1), // Format IDEB score
          style: {
             fontSize: '11px',
             colors: '#555',
         }
       }
    },
    markers: {
      size: 6, // Adjust marker size
      hover: {
        size: 8
      }
    },
    tooltip: {
      intersect: false, // Show tooltip on hover near point
      shared: false, // Show tooltip for individual points
      x: {
        formatter: (value: number) => `Invest.: R$ ${value.toLocaleString('pt-BR')}`
      },
      y: {
        formatter: (value: number) => `IDEB: ${value.toFixed(2)}`
      },
      marker: {
          show: true,
      },
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f8f8f8', 'transparent'], // Light alternating row colors
        opacity: 0.5
      },
    },
     title: {
        text: title,
        align: 'center',
        style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#444'
        }
    },
     legend: {
         show: series.length > 1, // Show legend only if multiple series
         position: 'top',
         horizontalAlign: 'center'
     }
  };

  return (
    <Chart
      options={options}
      series={series}
      type="scatter"
      width="100%"
      height={300}
    />
  );
}