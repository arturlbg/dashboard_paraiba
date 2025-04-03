import React from 'react';
import Chart from 'react-apexcharts';

interface EnemMediaAnoData {
  nome: string;
  media_geral: number;
  media_cn?: number;
  media_ch?: number;
  media_lc?: number;
  media_mt?: number;
  media_red?: number;
  ano: string;
}

interface EvolucaoMediaGeralEnemChartProps {
  dados: EnemMediaAnoData[];
}

export const EvolucaoMediaGeralEnemChart: React.FC<EvolucaoMediaGeralEnemChartProps> = ({ dados }) => {
  const anos = dados.map(item => item.ano);
  const mediasGerais = dados.map(item => parseFloat(item.media_geral.toFixed(2)));

  const series = [
    {
      name: 'Média Geral ENEM',
      data: mediasGerais,
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: true,
      formatter: (value) => {
        return value.toFixed(2);
      },
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: anos,
      title: {
        text: 'Ano',
      },
    },
    yaxis: {
      title: {
        text: 'Média Geral ENEM',
      },
    },
    tooltip: {
      y: {
        formatter: (value) => {
          return value.toFixed(2);
        },
      },
    },
  };

  return <Chart options={options} series={series} type="line" height={350} />;
};