import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface GastosVsPopulacaoChartProps {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  categories: string[];
  title?: string;
}

export function GastosVsPopulacaoChart({
    series,
    categories,
    title = "Evolução: Gastos Educacionais vs. População Estudantil"
}: GastosVsPopulacaoChartProps): JSX.Element {

   // Helper to format currency for axis/tooltip
   const formatCurrencyAxis = (value: number): string => {
      if (value >= 1e9) return (value / 1e9).toFixed(1) + ' Bi';
      if (value >= 1e6) return (value / 1e6).toFixed(1) + ' Mi';
      if (value >= 1e3) return (value / 1e3).toFixed(1) + ' Mil';
      return value.toFixed(0);
   };
    // Helper to format large numbers for axis/tooltip
   const formatLargeNumberAxis = (value: number): string => {
      if (value >= 1e6) return (value / 1e6).toFixed(1) + ' Mi';
      if (value >= 1e3) return (value / 1e3).toFixed(1) + ' Mil';
      return value.toFixed(0);
   };

  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'Open Sans, sans-serif',
    },
    xaxis: {
      categories: categories,
      title: {
        text: 'Ano',
         style: {
             color: '#555',
             fontSize: '12px',
             fontWeight: 500,
         }
      },
       labels: {
         style: {
             fontSize: '12px',
             colors: '#555',
         }
       }
    },
    yaxis: [ // Define multiple Y-axes
      {
        // First Y-axis (Gastos)
        seriesName: 'Gastos (Milhões R$)', // Must match series name
        axisTicks: { show: true },
        axisBorder: { show: true, color: '#008FFB' },
        labels: {
          style: { colors: '#008FFB', fontSize: '12px' },
          formatter: formatCurrencyAxis, // Use formatter
        },
        title: {
          text: "Gastos Educacionais",
          style: { color: '#008FFB', fontSize: '12px', fontWeight: 500 }
        },
        tooltip: { enabled: true }
      },
      {
        // Second Y-axis (Estudantes) - Opposite side
        seriesName: 'Estudantes (Milhares)', // Must match series name
        opposite: true,
        axisTicks: { show: true },
        axisBorder: { show: true, color: '#00E396' },
        labels: {
          style: { colors: '#00E396', fontSize: '12px' },
          formatter: formatLargeNumberAxis, // Use formatter
        },
        title: {
          text: "População Estudantil",
          style: { color: '#00E396', fontSize: '12px', fontWeight: 500 }
        }
      }
    ],
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 5,
      hover: { size: 7 }
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: true, // Show tooltip for both series on hover
      intersect: false, // Show tooltip even if not directly hovering on point
      y: {
         formatter: (value: number, { seriesIndex }) => {
            // Format based on which series it is
            if (seriesIndex === 0) return `R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 0})}`; // Gastos
            if (seriesIndex === 1) return `${value.toLocaleString('pt-BR')} Estudantes`; // Estudantes
            return value.toFixed(0);
         }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '13px',
      offsetY: 0,
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f8f8f8', 'transparent'],
        opacity: 0.5
      },
    },
    title: {
        text: title,
        align: 'center',
        style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#444'
        }
    },
    colors: ['#008FFB', '#00E396'] // Colors for the two series
  };

  return (
    <Chart
      options={options}
      series={series}
      type="line"
      width="100%"
      height={300}
    />
  );
}