import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { MediaEnem, DespesaMunicipio } from '../../../../types'; // Assuming types defined

interface DadosEnemDespesa {
  ano: string;
  despesa: number;
  mediaEnem: number;
}

interface InvestimentoEnemChartProps {
  mediasEnem: MediaEnem[]; // Array of ENEM averages over the years for a specific municipality
  despesas: DespesaMunicipio[]; // Array of expenses over the years for the same municipality
  titulo?: string;
}

export function InvestimentoEnemChart({
    mediasEnem,
    despesas,
    titulo = "Investimento em Educação vs. Média ENEM"
}: InvestimentoEnemChartProps): JSX.Element {

  // Helper function to process and align data by year
  const processarDados = (): DadosEnemDespesa[] => {
    const mediasMap = new Map<string, number>();
    mediasEnem.forEach(media => {
      if (media.ano && media.media_geral) {
        mediasMap.set(media.ano, media.media_geral);
      }
    });

    const despesasMap = new Map<string, number>();
    despesas.forEach(despesa => {
      if (despesa.ano && despesa.despesa_total) {
        despesasMap.set(despesa.ano, despesa.despesa_total);
      }
    });

    // Get unique years from both datasets and sort them
    const anosDisponiveis = Array.from(
      new Set([...mediasMap.keys(), ...despesasMap.keys()])
    ).sort();

    // Create combined data points, defaulting to 0 if data is missing for a year
    return anosDisponiveis.map(ano => ({
      ano,
      despesa: despesasMap.get(ano) || 0,
      mediaEnem: mediasMap.get(ano) || 0,
    }));
  };

  const dadosProcessados = processarDados();

  // Filter out years where both values are 0 (might indicate missing data for that year)
  const dadosFiltrados = dadosProcessados.filter(d => d.despesa > 0 || d.mediaEnem > 0);

  const series = [
    {
      name: 'Despesa em Educação',
      type: 'column', // Bar chart for expense
      data: dadosFiltrados.map(item => item.despesa),
    },
    {
      name: 'Média ENEM',
      type: 'line', // Line chart for ENEM average
      data: dadosFiltrados.map(item => parseFloat(item.mediaEnem.toFixed(2))), // Ensure consistent precision
    },
  ];

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'line', // Base type is line, but series override
      toolbar: { show: false },
      fontFamily: 'Open Sans, sans-serif',
    },
    stroke: {
      width: [0, 3], // No stroke for bars, width 3 for line
      curve: 'smooth',
    },
    markers: {
      size: 4, // Markers for the line chart points
      hover: { sizeOffset: 2 }
    },
    xaxis: {
      categories: dadosFiltrados.map(item => item.ano),
      labels: {
          style: {
              fontSize: '12px',
              colors: '#555',
          }
      },
      title: { text: 'Ano', style: { color: '#555', fontSize: '12px', fontWeight: 500 }}
    },
    yaxis: [ // Define two Y-axes
      {
        // Y-axis for Despesa (Bars)
        seriesName: 'Despesa em Educação',
        axisTicks: { show: true },
        axisBorder: { show: true, color: '#008FFB' },
        labels: {
          style: { colors: '#008FFB', fontSize: '12px' },
          formatter: (val: number) => {
             if (val >= 1e6) return `R$ ${(val / 1e6).toFixed(1)} Mi`;
             if (val >= 1e3) return `R$ ${(val / 1e3).toFixed(0)} Mil`;
             return `R$ ${val.toFixed(0)}`;
          }
        },
        title: {
          text: 'Despesa (R$)',
          style: { color: '#008FFB', fontSize: '12px', fontWeight: 500 },
        },
      },
      {
        // Y-axis for Média ENEM (Line) - on the opposite side
        seriesName: 'Média ENEM',
        opposite: true,
        axisTicks: { show: true },
        axisBorder: { show: true, color: '#00E396' },
        labels: {
          style: { colors: '#00E396', fontSize: '12px' },
          formatter: (val: number) => val.toFixed(1), // Format average
        },
        title: {
          text: 'Média ENEM',
          style: { color: '#00E396', fontSize: '12px', fontWeight: 500 },
        },
         min: Math.min(...dadosFiltrados.map(d => d.mediaEnem)) - 20 > 0 ? Math.min(...dadosFiltrados.map(d => d.mediaEnem)) - 20 : 0, // Dynamic min/max might be useful
         max: Math.max(...dadosFiltrados.map(d => d.mediaEnem)) + 20,
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number, { seriesIndex }) => {
          if (seriesIndex === 0) { // Despesa
            return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
          }
          return value.toFixed(2); // Média ENEM
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
       offsetY: 0,
       fontSize: '13px',
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
     grid: {
        borderColor: '#e7e7e7',
    },
    colors: ['#008FFB', '#00E396'], // Assign colors to series
    plotOptions: { // Specific options for bar part
         bar: {
             columnWidth: '40%', // Adjust bar width
             // borderRadius: 4 // Optional rounded bars
         }
     }
  };

  // Conditionally render the chart only if there's data to display
  return dadosFiltrados.length > 0 ? (
    <Chart
      options={options}
      series={series}
      type="line" // Base type, series override where needed
      height={350}
      width="100%"
    />
  ) : (
    <div className="flex items-center justify-center h-[350px] text-gray-500">
        Dados insuficientes para exibir o gráfico de Investimento vs. ENEM.
    </div>
  );
}