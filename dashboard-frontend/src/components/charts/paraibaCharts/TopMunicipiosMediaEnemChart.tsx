import React from 'react';
import Chart from 'react-apexcharts';

interface EnemData {
  nome: string;
  ano: number;
  media_geral: number;
  media_cn?: number;
  media_ch?: number;
  media_lc?: number;
  media_mt?: number;
  media_red?: number;
}

interface TopMunicipiosMediaEnemChartProps {
  dados: EnemData[];
}

export const TopMunicipiosMediaEnemChart: React.FC<TopMunicipiosMediaEnemChartProps> = ({ dados }) => {
  // Calcular a média anual de media_geral para cada município
  const municipioAnoMediaGeral: Record<string, Record<number, number[]>> = {};

  dados.forEach(item => {
    const municipio = item.nome;
    const ano = item.ano;
    if (!municipioAnoMediaGeral[municipio]) {
      municipioAnoMediaGeral[municipio] = {};
    }
    if (!municipioAnoMediaGeral[municipio][ano]) {
      municipioAnoMediaGeral[municipio][ano] = [];
    }
    municipioAnoMediaGeral[municipio][ano].push(item.media_geral);
  });

  const municipioMediaAnual: Record<string, Record<number, number>> = {};
  for (const municipio in municipioAnoMediaGeral) {
    municipioMediaAnual[municipio] = {};
    for (const ano in municipioAnoMediaGeral[municipio]) {
      const mediaGeralValues = municipioAnoMediaGeral[municipio][ano];
      const media = mediaGeralValues.reduce((sum, valor) => sum + valor, 0) / mediaGeralValues.length;
      municipioMediaAnual[municipio][Number(ano)] = parseFloat(media.toFixed(2));
    }
  }

  // Calcular a média das médias anuais para cada município
  const municipioMediaEnem: Record<string, number> = {};
  for (const municipio in municipioMediaAnual) {
    const mediasAnuais = Object.values(municipioMediaAnual[municipio]);
    const mediaFinal = mediasAnuais.reduce((sum, valor) => sum + valor, 0) / mediasAnuais.length;
    municipioMediaEnem[municipio] = parseFloat(mediaFinal.toFixed(2));
  }

  // Ordenar os municípios pela média geral do ENEM (decrescente)
  const topMunicipios = Object.entries(municipioMediaEnem)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const municipios = topMunicipios.map(([municipio]) => municipio);
  const mediasEnem = topMunicipios.map(([, media]) => media);

  const series = [
    {
      name: 'Média Geral ENEM',
      data: mediasEnem,
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
      enabled: false,
    },
    xaxis: {
      categories: municipios,
      title: {
        text: 'Município',
      },
    },
    yaxis: {
      title: {
        text: 'Média ENEM',
      },
      labels: {
        formatter: (value) => {
          return value.toFixed(2);
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => {
          return value.toFixed(2);
        },
      },
    },
    title: {
      text: 'Top 10 Municípios com Maior Média Geral no ENEM (Média Anual)',
      align: 'left',
    },
  };

  return <Chart options={options} series={series} type="bar" height={400} />;
};