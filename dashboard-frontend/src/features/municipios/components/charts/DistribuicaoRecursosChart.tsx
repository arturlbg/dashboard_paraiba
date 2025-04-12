import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface DistribuicaoRecursosChartProps {
  series: number[];
  labels: string[];
  title?: string;
}

export function DistribuicaoRecursosChart({
    series,
    labels,
    title = "Distribuição de Recursos"
}: DistribuicaoRecursosChartProps): JSX.Element {

  const options: ApexOptions = {
    chart: {
      type: 'pie',
      height: 300,
      toolbar: { show: false },
      fontFamily: 'Open Sans, sans-serif',
    },
    labels: labels,
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts) => {
        // Display percentage on the slice
        const percentage = typeof val === 'number' ? val.toFixed(1) + '%' : val;
        // Optionally display label too if space allows, or only percentage
        // return `${opts.w.globals.labels[opts.seriesIndex]}: ${percentage}`;
        return percentage;
      },
       style: {
         fontSize: '12px',
         fontWeight: 'bold',
         colors: ['#fff'], // White text for contrast
       },
       dropShadow: { // Add shadow for better readability on slices
         enabled: true,
         top: 1,
         left: 1,
         blur: 1,
         opacity: 0.45
       }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '13px',
      offsetY: 5,
      markers: {
        size: 12, // Use 'size' para definir a largura e altura do marcador
        radius: 12, // Rounded legend markers
      },
       itemMargin: {
           horizontal: 5,
           vertical: 3
       }
    },
    responsive: [{ // Ensure responsiveness
      breakpoint: 480,
      options: {
        chart: {
          width: '100%'
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
     title: {
        text: title,
        align: 'center',
        style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#444'
        }
    },
    tooltip: {
        y: {
             formatter: (val: number) => `${val.toFixed(1)}%`
        }
    }
    // Add custom colors if needed: colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0']
  };

  return (
    <Chart
      options={options}
      series={series}
      type="pie"
      width="100%"
      height={300}
    />
  );
}