import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface DesempenhoDisciplinaChartProps {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  categories: string[];
  title?: string;
}

export function DesempenhoDisciplinaChart({
    series,
    categories,
    title = "Desempenho por Área"
}: DesempenhoDisciplinaChartProps): JSX.Element {

  const options: ApexOptions = {
    chart: {
      type: 'radar',
      height: 300,
      toolbar: { show: false },
      fontFamily: 'Open Sans, sans-serif',
    },
    xaxis: {
      categories: categories,
       labels: {
         style: {
             fontSize: '13px', // Slightly larger font for categories
             colors: '#333', // Darker color for better readability
             fontWeight: 500,
         }
       }
    },
    yaxis: {
      show: true, // Show Y-axis labels (score)
      tickAmount: 4, // Adjust number of ticks based on score range
      labels: {
        formatter: (val: number) => val.toFixed(0), // Adjust decimals as needed
         style: {
             fontSize: '11px',
             colors: '#777',
         }
      }
    },
    markers: {
      size: 4, // Add markers to points
      hover: {
        size: 6
      }
    },
    stroke: {
      show: true,
      width: 2, // Line thickness
    },
    fill: {
      opacity: 0.1, // Slight fill for area under the line
    },
    plotOptions: {
        radar: {
             polygons: {
                 strokeColors: '#e8e8e8', // Lighter polygon lines
                 fill: {
                     colors: ['#f8f8f8', '#fff'] // Alternating background for readability
                 }
             }
        }
    },
    legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '12px',
        offsetY: 5,
    },
    tooltip: {
        y: {
            formatter: (val: number) => `${val.toFixed(1)}` // Tooltip format
        }
    },
     title: {
        text: title,
        align: 'center',
        style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#444'
        }
    }
    // Consider adding specific colors: colors: ['#008FFB', '#00E396', ...]
  };

  return (
    <Chart
      options={options}
      series={series}
      type="radar"
      width="100%"
      height={300}
    />
  );
}