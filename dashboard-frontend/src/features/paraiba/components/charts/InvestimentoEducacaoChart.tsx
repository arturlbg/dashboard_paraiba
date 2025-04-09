import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Despesa } from '../../../../types'; // Import type

interface InvestimentoEducacaoChartProps {
  dados: Despesa[]; // Expecting array of state-level expenses
  titulo?: string;
}

export const InvestimentoEducacaoChart: React.FC<InvestimentoEducacaoChartProps> = ({
    dados,
    titulo = "Evolução do Investimento em Educação na Paraíba"
}) => {
   // Sort data by year and filter out invalid entries
   const sortedDados = [...dados]
     .filter(item => typeof item.despesa_total === 'number' && !isNaN(item.despesa_total))
     .sort((a, b) => parseInt(a.ano) - parseInt(b.ano));

  const anos = sortedDados.map((item) => item.ano);
  const despesas = sortedDados.map((item) => item.despesa_total);

  const series = [
    {
      name: 'Investimento em Educação',
      data: despesas,
    },
  ];

   // Helper to format currency for axis/tooltip
   const formatCurrencyAxis = (value: number): string => {
      if (value >= 1e9) return `R$ ${(value / 1e9).toFixed(1)} Bi`;
      if (value >= 1e6) return `R$ ${(value / 1e6).toFixed(1)} Mi`;
      if (value >= 1e3) return `R$ ${(value / 1e3).toFixed(0)} k`; // Use k for thousands
      return `R$ ${value.toFixed(0)}`;
   };

  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false },
      fontFamily: 'Open Sans, sans-serif',
    },
    dataLabels: {
      enabled: true, // Enable labels on points
      formatter: formatCurrencyAxis, // Use formatter
      offsetY: -7, // Adjust position
       style: {
           fontSize: '10px', // Smaller font for labels
           colors: ["#304758"]
       },
       background: { // Add slight background for better contrast if needed
           enabled: true,
           foreColor: '#fff',
           padding: 3,
           borderRadius: 2,
           borderWidth: 1,
           borderColor: '#ddd',
           opacity: 0.9,
       }
    },
    stroke: {
      curve: 'smooth', // Changed to smooth
      width: 3,
    },
     markers: {
        size: 5,
        hover: { sizeOffset: 2 }
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f8f8f8', 'transparent'],
        opacity: 0.5,
      },
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
        text: 'Despesa Total (R$)',
        style: { color: '#555', fontSize: '12px', fontWeight: 500 }
      },
      labels: {
        formatter: formatCurrencyAxis, // Use currency formatter
         style: {
             fontSize: '12px',
             colors: '#555',
         }
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => {
          return 'R$ ' + value.toLocaleString('pt-BR', {minimumFractionDigits: 0});
        },
      },
      x: { format: 'yyyy' }
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
          Dados de evolução de investimento indisponíveis.
      </div>
  );
};