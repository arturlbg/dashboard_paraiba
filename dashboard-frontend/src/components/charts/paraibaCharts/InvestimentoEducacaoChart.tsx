import React from 'react';
import Chart from 'react-apexcharts';

interface InvestimentoEducacao {
  nome_municipio: string;
  codigo_municipio: string;
  estagio: string;
  ano: string;
  despesa_total: number;
}

interface InvestimentoEducacaoChartProps {
  dados: InvestimentoEducacao[];
}

export const InvestimentoEducacaoChart: React.FC<InvestimentoEducacaoChartProps> = ({ dados }) => {
  const anos = dados.map((item) => item.ano);
  const despesas = dados.map((item) => item.despesa_total);

  const series = [
    {
      name: 'Investimento em Educação',
      data: despesas,
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'straight',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: anos,
      title: {
        text: 'Ano',
      },
    },
    yaxis: {
      title: {
        text: 'Despesa Total (R$)',
      },
      labels: {
        formatter: (value) => {
          return value.toLocaleString('pt-BR');
        },
      },
    },
        tooltip: {
            y: {
                formatter: (value) => {
                    return 'R$ ' + value.toLocaleString('pt-BR');
                }
            }
        },

  };

  return (
    <Chart options={options} series={series} type="line" height={350} />
  );
};