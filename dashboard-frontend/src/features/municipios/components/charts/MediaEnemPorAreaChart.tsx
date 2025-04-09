import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface MediaEnemPorAreaChartProps {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  categories: string[];
  title?: string;
}

export function MediaEnemPorAreaChart({
    series,
    categories,
    title = "Média ENEM por Área de Conhecimento"
}: MediaEnemPorAreaChartProps): JSX.Element {

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false },
      fontFamily: 'Open Sans, sans-serif',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        // endingShape: 'rounded',
        dataLabels: {
          position: 'top', // Show labels above bars
        },
      },
    },
    dataLabels: {
      enabled: true,
       formatter: (val: number) => val.toFixed(1), // Format labels
       offsetY: -20, // Adjust position
       style: {
         fontSize: '11px',
         colors: ["#304758"]
       }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: categories,
       labels: {
         style: {
             fontSize: '12px',
             colors: '#555',
         }
       }
    },
    yaxis: {
      title: {
        text: 'Média',
         style: {
             color: '#555',
             fontSize: '12px',
             fontWeight: 500,
         }
      },
       labels: {
         formatter: (val: number) => val.toFixed(0), // Format Y-axis labels
          style: {
             fontSize: '12px',
             colors: '#555',
         }
       }
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toFixed(2), // Format tooltip
      },
    },
    grid: {
        borderColor: '#e7e7e7',
        row: {
            colors: ['#f8f8f8', 'transparent'],
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
    // Example colors - adjust as needed
    // colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0']
  };

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      width="100%"
      height={300}
    />
  );
}