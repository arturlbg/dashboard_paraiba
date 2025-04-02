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

interface TopMunicipiosMediaIdebChartProps {
  dados: IdebData[];
}

export const TopMunicipiosMediaIdebChart: React.FC<TopMunicipiosMediaIdebChartProps> = ({ dados }) => {
  const municipioIdeb: Record<string, number[]> = {};

  dados.forEach(item => {
    const municipio = item.nome_municipio;
    if (item.ideb > 0) { 
      if (!municipioIdeb[municipio]) {
        municipioIdeb[municipio] = [];
      }
      municipioIdeb[municipio].push(item.ideb);
    }
  });

  const municipioMediaIdeb: Record<string, number | null> = {};
  for (const municipio in municipioIdeb) {
    const idebValues = municipioIdeb[municipio];
    if (idebValues.length > 0) {
      const media = idebValues.reduce((sum, valor) => sum + valor, 0) / idebValues.length;
      municipioMediaIdeb[municipio] = parseFloat(media.toFixed(2));
    } else {
      municipioMediaIdeb[municipio] = null;
    }
  }

  const topMunicipios = Object.entries(municipioMediaIdeb)
    .filter(([, media]) => media !== null)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 10) as [string, number][]; 

  const municipios = topMunicipios.map(([municipio]) => municipio);
  const mediasIdeb = topMunicipios.map(([, media]) => media);

  const series = [
    {
      name: 'Média IDEB',
      data: mediasIdeb,
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
        text: 'Média IDEB',
      },
      labels: {
        formatter: (value) => {
          if (value !== null) {
            return value.toFixed(2);
          }
          return 'N/D'; 
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => {
          if (value !== null) {
            return value.toFixed(2);
          }
          return 'Não Disponível';
        },
      },
    },
    title: {
      text: 'Top 10 Municípios com Maior Média do IDEB',
      align: 'left',
    },
  };

  return <Chart options={options} series={series} type="bar" height={400} />;
};