import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { MediaEnem } from '../../../../types'; // Assuming type defined

interface EvolucaoMediaGeralEnemChartProps {
  dados: MediaEnem[]; // Expecting array of state-level ENEM averages
  titulo?: string;
}

export const EvolucaoMediaGeralEnemChart: React.FC<EvolucaoMediaGeralEnemChartProps> = ({
    dados,
    titulo = "Evolução da Média Geral do ENEM na Paraíba"
}) => {

  // Sort data by year ensure correct order
  const sortedDados = [...dados].sort((a, b) => parseInt(a.ano) - parseInt(b.ano));

  const anos = sortedDados.map(item => item.ano);
  // Ensure media_geral is treated as a number and handle potential null/undefined
  const mediasGerais = sortedDados.map(item => typeof item.media_geral === 'number' ? parseFloat(item.media_geral.toFixed(2)) : 0);

  const series = [
    {
      name: 'Média Geral ENEM',
      data: mediasGerais,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'Open Sans, sans-serif',
    },
    dataLabels: {
      enabled: true,
      formatter: (value: number) => value.toFixed(2), // Format labels on points
      offsetY: -5,
       style: {
           fontSize: '11px',
           colors: ["#304758"]
       }
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
        size: 5,
        hover: { sizeOffset: 2 }
    },
    xaxis: {
      categories: anos,
      title: {
        text: 'Ano',
        style: { color: '#555', fontSize: '12px', fontWeight: 500 }
      },
       labels: {
         style: {
             fontSize: '12px',
             colors: '#555',
         }
       }
    },
    yaxis: {
      title: {
        text: 'Média Geral ENEM',
        style: { color: '#555', fontSize: '12px', fontWeight: 500 }
      },
      labels: {
         formatter: (value: number) => value.toFixed(1), // Format Y-axis
          style: {
             fontSize: '12px',
             colors: '#555',
         }
      }
    },
    tooltip: {
      y: {
        formatter: (value: number) => value.toFixed(2), // Format tooltip
      },
      x: {
          format: 'yyyy' // Treat x-axis as years
      }
    },
    grid: {
        borderColor: '#e7e7e7',
        row: {
            colors: ['#f8f8f8', 'transparent'],
            opacity: 0.5
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

  // Render chart only if there's valid data
  return anos.length > 0 ? (
      <Chart options={options} series={series} type="line" height={350} width="100%" />
  ) : (
     <div className="flex items-center justify-center h-[350px] text-gray-500">
         Dados de evolução da média do ENEM indisponíveis.
     </div>
  );
};