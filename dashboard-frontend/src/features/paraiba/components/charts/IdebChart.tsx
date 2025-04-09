import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { IndicadorEducacional } from '../../../../types'; // Import type

interface IdebChartProps {
  dados: IndicadorEducacional[]; // Expecting array of state-level IDEB indicators
  titulo?: string;
}

export const IdebChart: React.FC<IdebChartProps> = ({
    dados,
    titulo = "Evolução do IDEB na Paraíba"
}) => {

   // Sort data by year and filter out invalid entries
   const sortedDados = [...dados]
     .filter(item => typeof item.ideb === 'number' && !isNaN(item.ideb)) // Filter invalid IDEB
     .sort((a, b) => a.ano - b.ano);

  const anos = sortedDados.map(item => String(item.ano)); // Ensure categories are strings
  const idebValues = sortedDados.map(item => parseFloat(item.ideb.toFixed(2))); // Ensure 2 decimal places

  const series = [
    {
      name: 'IDEB',
      data: idebValues,
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
      formatter: (value: number) => value.toFixed(2), // Format data labels
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
        text: 'IDEB',
        style: { color: '#555', fontSize: '12px', fontWeight: 500 }
      },
      labels: {
         formatter: (value: number) => value.toFixed(1), // Format Y-axis labels
          style: {
             fontSize: '12px',
             colors: '#555',
         }
      }
    },
    tooltip: {
      y: {
        formatter: (value: number) => value.toFixed(2), // Format tooltip values
      },
      x: {
          format: 'yyyy'
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
          Dados de evolução do IDEB indisponíveis.
      </div>
  );
};