import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface EvolucaoIdebChartProps {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  categories: string[];
  title?: string;
}

export function EvolucaoIdebChart({
    series,
    categories,
    title = "Evolução do IDEB"
}: EvolucaoIdebChartProps): JSX.Element {

  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false }, // Disable zoom for simple line charts
      fontFamily: 'Open Sans, sans-serif',
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: '12px',
          colors: '#555',
        },
      },
       title: {
           text: 'Ano',
           style: {
               color: '#555',
               fontSize: '12px',
               fontWeight: 500,
           }
       }
    },
    yaxis: {
      title: {
        text: 'Nota IDEB',
         style: {
             color: '#555',
             fontSize: '12px',
             fontWeight: 500,
         }
      },
       labels: {
         style: {
             fontSize: '12px',
             colors: '#555',
         },
          formatter: (value: number) => value.toFixed(1) // Format Y-axis labels
       }
    },
    stroke: {
      curve: 'smooth', // 'straight' or 'smooth'
      width: 3,
    },
    markers: {
      size: 5, // Show points on the line
       hover: {
           size: 7
       }
    },
    dataLabels: {
      enabled: false, // Data labels on points (optional)
    },
    tooltip: {
      y: {
        formatter: (value: number) => value.toFixed(2), // Tooltip format
      },
       x: {
           format: 'yyyy' // Assuming categories are years
       }
    },
    grid: {
        borderColor: '#e7e7e7',
        row: {
            colors: ['#f8f8f8', 'transparent'], // Alternating row colors
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
    }
    // Add specific colors if needed: colors: ['#008FFB']
  };

  return (
    <Chart
      options={options}
      series={series}
      type="line"
      width="100%"
      height={300}
    />
  );
}