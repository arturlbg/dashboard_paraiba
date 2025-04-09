import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { MediaEnemMunicipio } from '../../../../types'; // Assuming type defined, using more specific type

interface TopMunicipiosMediaEnemChartProps {
  dados: MediaEnemMunicipio[]; // Expecting array of ENEM averages across municipalities/years
  titulo?: string;
}

export const TopMunicipiosMediaEnemChart: React.FC<TopMunicipiosMediaEnemChartProps> = ({
    dados,
    titulo = "Top 10 Municípios por Média Geral do ENEM (Média Histórica)"
}) => {
  // 1. Calculate average ENEM score per municipality across all available years
  const municipioMedias: Record<string, { soma: number; contagem: number }> = {};

  dados.forEach(item => {
    // Use 'nome' instead of 'nome_municipio' based on MediaEnemMunicipio type
    if (item.nome && typeof item.media_geral === 'number' && !isNaN(item.media_geral)) {
      if (!municipioMedias[item.nome]) {
        municipioMedias[item.nome] = { soma: 0, contagem: 0 };
      }
      municipioMedias[item.nome].soma += item.media_geral;
      municipioMedias[item.nome].contagem += 1;
    }
  });

  // 2. Calculate the final average for each municipality
  const municipioMediaFinal: Record<string, number> = {};
  for (const municipio in municipioMedias) {
    if (municipioMedias[municipio].contagem > 0) {
      municipioMediaFinal[municipio] = parseFloat(
        (municipioMedias[municipio].soma / municipioMedias[municipio].contagem).toFixed(2)
      );
    }
  }

  // 3. Sort municipalities by average score (descending) and take top 10
  const topMunicipios = Object.entries(municipioMediaFinal)
    .sort(([, a], [, b]) => b - a) // Sort descending
    .slice(0, 10); // Get top 10

  const municipiosNomes = topMunicipios.map(([municipio]) => municipio);
  const mediasEnemValores = topMunicipios.map(([, media]) => media);

  const series = [
    {
      name: 'Média Geral ENEM',
      data: mediasEnemValores,
    },
  ];

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
        columnWidth: '60%',
        dataLabels: {
            position: 'top',
        }
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(1), // Format labels
      offsetY: -20,
      style: {
          fontSize: '11px',
          colors: ["#304758"]
      }
    },
    xaxis: {
      categories: municipiosNomes,
      labels: {
          style: {
              fontSize: '12px',
              colors: '#555',
          }
      }
    },
    yaxis: {
      title: {
        text: 'Média ENEM',
        style: { color: '#555', fontSize: '12px', fontWeight: 500 }
      },
      labels: {
        formatter: (value: number) => value.toFixed(1), // Format Y-axis
         style: {
             fontSize: '12px',
             colors: '#555',
         }
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => value.toFixed(2), // Format tooltip
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
    // colors: ['#00E396'] // Example color
  };

   // Render chart only if there's data
   return municipiosNomes.length > 0 ? (
      <Chart options={options} series={series} type="bar" height={400} width="100%" />
   ) : (
        <div className="flex items-center justify-center h-[400px] text-gray-500">
            Dados de média ENEM municipal indisponíveis.
        </div>
   );
};