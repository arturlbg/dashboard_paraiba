import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts'; // Import ApexOptions

// Define explicit types for props
interface ComparacaoIdebMunicipiosChartProps {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries; // Use ApexCharts types
  categories: string[];
}

export function ComparacaoIdebMunicipiosChart({ series, categories }: ComparacaoIdebMunicipiosChartProps): JSX.Element {
  const options: ApexOptions = { // Use ApexOptions type
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false },
      fontFamily: 'Open Sans, sans-serif',
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: '12px',
          colors: '#555',
        },
      },
    },
    yaxis: {
        labels: {
            style: {
                fontSize: '12px',
                colors: '#555',
            },
            formatter: (value: number) => value.toFixed(1) // Example: Format Y-axis labels
        },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        // endingShape: 'rounded' // Optional: rounded bars
      },
    },
    dataLabels: {
      enabled: false, // Usually better to disable for bar charts unless specific need
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    grid: {
        borderColor: '#e7e7e7',
        row: {
            colors: ['#f3f3f3', 'transparent'], // alternating row colors
            opacity: 0.5
        },
    },
    tooltip: {
        y: {
            formatter: (value: number) => `${value.toFixed(1)}` // Format tooltip value
        }
    }
    // Add other standard ApexCharts options as needed (colors, legend, etc.)
  };

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      width="100%"
      height={300} // Height can also be set in options.chart.height
    />
  );
}