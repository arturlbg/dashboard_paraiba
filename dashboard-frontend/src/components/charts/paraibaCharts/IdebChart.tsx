import React from 'react';
import Chart from 'react-apexcharts';

interface IdebData {
  id: number;
  ibge_id: number;
  dependencia_id: number;
  ciclo_id: string;
  ano: number;
  ideb: number;
  fluxo: number;
  aprendizado: number;
  nota_mt: number;
  nota_lp: number;
  nome_municipio: string;
  dependencia: string;
}

interface IdebChartProps {
  dados: IdebData[];
}

export const IdebChart: React.FC<IdebChartProps> = ({ dados }) => {
  // Prepare data for the chart
  const anos = dados.map(item => item.ano);
  const idebValues = dados.map(item => parseFloat(item.ideb.toFixed(2))); // Ensure 2 decimal places

  const series = [
    {
      name: 'IDEB',
      data: idebValues,
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
        return value.toFixed(2); // Format data labels to 2 decimal places
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
        text: 'IDEB',
      },
    },
    tooltip: {
      y: {
        formatter: (value) => {
          return value.toFixed(2); // Format tooltip values to 2 decimal places
        },
      },
    },
  };

  return <Chart options={options} series={series} type="line" height={350} />;
};