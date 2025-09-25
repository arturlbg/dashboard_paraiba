import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { DespesaMunicipio } from '../../../../types'; // Import type

interface TopMunicipiosInvestimentoChartProps {
  dados: DespesaMunicipio[];
  titulo?: string;
}

export const TopMunicipiosInvestimentoChart: React.FC<TopMunicipiosInvestimentoChartProps> = ({
    dados,
    titulo = "Top 10 Municípios por Investimento Total em Educação (Todos os Anos)"
}) => {

  const municipioInvestimentoTotal: Record<string, number> = dados.reduce((acc, item) => {
    if (item.nome_municipio && typeof item.despesa_total === 'number') {
      acc[item.nome_municipio] = (acc[item.nome_municipio] || 0) + item.despesa_total;
    }
    return acc;
  }, {} as Record<string, number>);

  const topMunicipios = Object.entries(municipioInvestimentoTotal)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const municipiosNomes = topMunicipios.map(([municipio]) => municipio);
  const investimentosValores = topMunicipios.map(([, investimento]) => investimento);

  const series = [
    {
      name: 'Investimento Total',
      data: investimentosValores,
    },
  ];

   const formatCurrencyAxis = (value: number): string => {
      if (value >= 1e9) return `R$ ${(value / 1e9).toFixed(1)} Bi`;
      if (value >= 1e6) return `R$ ${(value / 1e6).toFixed(1)} Mi`;
      if (value >= 1e3) return `R$ ${(value / 1e3).toFixed(0)} Mil`;
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
        horizontal: false,
        columnWidth: '60%',
        dataLabels: {
            position: 'top',
        }
      },
    },
    dataLabels: {
      enabled: true,
      formatter: formatCurrencyAxis,
      offsetY: -20,
       style: {
           fontSize: '10px',
           colors: ["#304758"]
       }
    },
    xaxis: {
      categories: municipiosNomes,
      title: {
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
        formatter: formatCurrencyAxis,
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
         yaxis: { lines: { show: true } },
         xaxis: { lines: { show: false } }
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
  };

   return municipiosNomes.length > 0 ? (
     <Chart options={options} series={series} type="bar" height={400} width="100%" />
  ) : (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
          Dados de investimento municipal indisponíveis.
      </div>
  );
};