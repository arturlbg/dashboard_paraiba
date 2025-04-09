import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ComparativoMediaChartProps {
  mediasMunicipio: Record<string, number | undefined>; // Allow undefined if data might be missing
  mediasParaiba: Record<string, number | undefined>; // Allow undefined
  categoriasX: string[]; // Display names (e.g., "Matemática")
  chaves: string[]; // Actual data keys (e.g., "media_mt")
  titulo?: string; // Optional title for the chart
}

export function ComparativoMediaChart({
  mediasMunicipio,
  mediasParaiba,
  categoriasX,
  chaves,
  titulo = "Comparativo de Médias" // Default title
}: ComparativoMediaChartProps): JSX.Element {

  // Helper function to safely get data, returning 0 if undefined or null
  const getDataPoint = (data: Record<string, number | undefined>, key: string): number => {
      const value = data[key];
      return typeof value === 'number' && !isNaN(value) ? parseFloat(value.toFixed(2)) : 0;
  };

  const series = [
    {
      name: 'Município',
      data: chaves.map(key => getDataPoint(mediasMunicipio, key)),
    },
    {
      name: 'Paraíba',
      data: chaves.map(key => getDataPoint(mediasParaiba, key)),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      fontFamily: 'Open Sans, sans-serif',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        // endingShape: 'rounded', // Optional rounded bars
        dataLabels: {
          position: 'top', // Display labels on top if enabled
        },
      },
    },
    dataLabels: {
      enabled: true, // Enable data labels
      formatter: (val: number) => val.toFixed(1), // Format labels
       offsetY: -20, // Adjust vertical position
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
      categories: categoriasX,
      labels: {
          style: {
              fontSize: '12px',
              colors: '#555',
          }
      }
    },
    yaxis: {
      title: {
        text: 'Média', // Add Y-axis title
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
         formatter: (value: number) => value.toFixed(1)
      }
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
       offsetY: 0,
       fontSize: '13px',
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toFixed(2), // Format tooltip values
      },
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f8f8f8', 'transparent'], // Light alternating row colors
        opacity: 0.5,
      },
    },
    title: {
        text: titulo,
        align: 'center',
        style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#444'
        }
    }
  };

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      height={350}
      width="100%"
    />
  );
}