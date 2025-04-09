import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { IndicadorEducacionalMunicipio } from '../../../../types'; // Import type, using more specific type

interface TopMunicipiosMediaIdebChartProps {
  dados: IndicadorEducacionalMunicipio[]; // Expecting array of IDEB indicators across municipalities/years
  titulo?: string;
}

export const TopMunicipiosMediaIdebChart: React.FC<TopMunicipiosMediaIdebChartProps> = ({
    dados,
    titulo = "Top 10 Municípios por Média IDEB (Média Histórica)"
}) => {
  // 1. Calculate average IDEB score per municipality across all available years
  const municipioMedias: Record<string, { soma: number; contagem: number }> = {};

  dados.forEach(item => {
    // Ensure valid data before processing
    if (item.nome_municipio && typeof item.ideb === 'number' && !isNaN(item.ideb) && item.ideb > 0) {
      if (!municipioMedias[item.nome_municipio]) {
        municipioMedias[item.nome_municipio] = { soma: 0, contagem: 0 };
      }
      municipioMedias[item.nome_municipio].soma += item.ideb;
      municipioMedias[item.nome_municipio].contagem += 1;
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
  const mediasIdebValores = topMunicipios.map(([, media]) => media);

  const series = [
    {
      name: 'Média IDEB',
      data: mediasIdebValores,
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
        text: 'Média IDEB',
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
    // colors: ['#FEB019'] // Example color
  };

   // Render chart only if there's data
   return municipiosNomes.length > 0 ? (
     <Chart options={options} series={series} type="bar" height={400} width="100%" />
  ) : (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
          Dados de média IDEB municipal indisponíveis.
      </div>
  );
};