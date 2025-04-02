import React from 'react';
import Chart from 'react-apexcharts';

interface InvestimentoEducacao {
  nome_municipio: string;
  codigo_municipio: string;
  estagio: string;
  ano: string;
  despesa_total: number;
}

interface TopMunicipiosChartProps {
  dados: InvestimentoEducacao[];
}

export const TopMunicipiosInvestimentoChart: React.FC<TopMunicipiosChartProps> = ({ dados }) => {
  // Calcular o investimento total por município
  const municipioInvestimento: Record<string, number> = dados.reduce((acc, item) => {
    acc[item.nome_municipio] = (acc[item.nome_municipio] || 0) + item.despesa_total;
    return acc;
  }, {});

  // Ordenar os municípios por investimento total (decrescente)
  const topMunicipios = Object.entries(municipioInvestimento)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const municipios = topMunicipios.map(([municipio]) => municipio);
  const investimentos = topMunicipios.map(([, investimento]) => investimento);

  const series = [
    {
      name: 'Investimento em Educação',
      data: investimentos,
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
      },
    },
    dataLabels: {
      enabled: false, // Desabilita os rótulos nas barras
    },
    xaxis: {
      categories: municipios,
      title: {
        text: 'Município',
      },
    },
    yaxis: {
      title: {
        text: 'Investimento Total',
      },
      labels: {
        formatter: (value) => {
          return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => {
          return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        },
      },
    },
  };

  return <Chart options={options} series={series} type="bar" height={400} />;
};