import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { DespesaMunicipio } from '../../../../types'; // Import type

interface TopMunicipiosInvestimentoChartProps {
  dados: DespesaMunicipio[]; // Expecting array of expenses potentially across multiple years/municipalities
  titulo?: string;
}

export const TopMunicipiosInvestimentoChart: React.FC<TopMunicipiosInvestimentoChartProps> = ({
    dados,
    titulo = "Top 10 Municípios por Investimento Total em Educação (Todos os Anos)"
}) => {
  // Calculate total investment per municipality across all available years
  const municipioInvestimentoTotal: Record<string, number> = dados.reduce((acc, item) => {
    if (item.nome_municipio && typeof item.despesa_total === 'number') {
      acc[item.nome_municipio] = (acc[item.nome_municipio] || 0) + item.despesa_total;
    }
    return acc;
  }, {} as Record<string, number>);

  // Sort municipalities by total investment (descending) and take top 10
  const topMunicipios = Object.entries(municipioInvestimentoTotal)
    .sort(([, a], [, b]) => b - a) // Sort descending by investment value
    .slice(0, 10); // Get only the top 10

  const municipiosNomes = topMunicipios.map(([municipio]) => municipio);
  const investimentosValores = topMunicipios.map(([, investimento]) => investimento);

  const series = [
    {
      name: 'Investimento Total', // Simplified name
      data: investimentosValores,
    },
  ];

  // Helper to format currency for axis/tooltip
   const formatCurrencyAxis = (value: number): string => {
      if (value >= 1e9) return `R$ ${(value / 1e9).toFixed(1)} Bi`;
      if (value >= 1e6) return `R$ ${(value / 1e6).toFixed(1)} Mi`;
      if (value >= 1e3) return `R$ ${(value / 1e3).toFixed(0)} Mil`; // Use k for thousands
      return `R$ ${value.toFixed(0)}`;
   };

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 400,
      toolbar: { show: false },
      fontFamily: 'Open Sans, sans-serif',
    },
    plotOptions: {
      bar: {
        horizontal: false, // Vertical bars
        columnWidth: '60%', // Adjust bar width
        // endingShape: 'rounded', // Optional rounded bars
        dataLabels: {
            position: 'top', // Position data labels if enabled
        }
      },
    },
    dataLabels: {
      enabled: true, // Enable data labels
      formatter: formatCurrencyAxis, // Format labels as currency
      offsetY: -20, // Adjust position
       style: {
           fontSize: '10px',
           colors: ["#304758"]
       }
    },
    xaxis: {
      categories: municipiosNomes,
      title: {
        // text: 'Município', // Often redundant
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
        text: 'Investimento Total (R$)',
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
          return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });
        },
      },
    },
     grid: {
        borderColor: '#e7e7e7',
        row: {
            colors: ['#f8f8f8', 'transparent'],
            opacity: 0.5
        },
         yaxis: { lines: { show: true } }, // Show horizontal grid lines
         xaxis: { lines: { show: false } } // Hide vertical grid lines
    },
     title: {
        text: titulo,
        align: 'center',
        style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#444'
        }
    },
    // colors: ['#008FFB'] // Example color
  };

   // Render chart only if there's data
   return municipiosNomes.length > 0 ? (
     <Chart options={options} series={series} type="bar" height={400} width="100%" />
  ) : (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
          Dados de investimento municipal indisponíveis.
      </div>
  );
};