import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { IndicadorEducacional } from '../../../../types'; // Import type

interface TaxaAprovacaoChartProps {
  // Expect the raw indicator data for the selected municipality across years
  data: IndicadorEducacional[];
  title?: string;
}

export function TaxaAprovacaoChart({
    data,
    title = "Taxa de Aprovação (Fluxo Escolar)"
}: TaxaAprovacaoChartProps): JSX.Element {

  // Filter out entries without a valid 'fluxo' and sort by year
  const validData = data
    .filter(item => typeof item.fluxo === 'number' && !isNaN(item.fluxo))
    .sort((a, b) => a.ano - b.ano); // Ensure data is sorted chronologically

  // Use a limited color palette that repeats
  const baseColors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];

  if (validData.length === 0) {
     return <div className="flex items-center justify-center h-[300px] text-gray-500">Dados de fluxo escolar indisponíveis.</div>;
  }

  // Create individual radial bar charts for each year
  const charts = validData.map((item, index) => {
    const valorPercentual = parseFloat((item.fluxo * 100).toFixed(1)); // Format as percentage
    const cor = baseColors[index % baseColors.length]; // Cycle through colors

    const options: ApexOptions = {
      chart: {
        type: 'radialBar',
        height: 200, // Smaller height for individual charts
        sparkline: { // Make it more compact
           enabled: true
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          hollow: {
            size: '60%', // Adjust hollow size
            margin: 5, // Margin inside
          },
          track: { // Background track
              background: "#e0e0e0",
              strokeWidth: '97%',
              margin: 5, // margin is in pixels
          },
          dataLabels: {
            name: { // Year label
              show: true,
              offsetY: 20, // Position below the bar
              fontSize: '13px',
              fontWeight: 600,
              color: '#555'
            },
            value: { // Percentage value
              formatter: (val: number) => `${val.toFixed(1)}%`,
              fontSize: '18px', // Larger font for value
              fontWeight: 'bold',
              offsetY: -15, // Position inside the bar
              color: '#333'
            },
          },
        },
      },
      labels: [`${item.ano}`], // Year as the label
      colors: [cor], // Assign color
      stroke: {
          lineCap: "round" // Rounded ends for the bar
      },
       // Remove unnecessary options for sparkline/small charts
       grid: { padding: { top: -10, bottom: -10 } },
       fill: { type: 'solid' },
    };

    return (
      <div key={item.ano} className="flex flex-col items-center p-2" style={{ minWidth: '160px' }}> {/* Ensure some min-width */}
        <Chart
          options={options}
          series={[valorPercentual]}
          type="radialBar"
          height={180} // Consistent height
        />
      </div>
    );
  });

  return (
    <div className="w-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">{title}</h3>
        <div
          className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2 p-4" // Use Tailwind for flex layout
          style={{ width: '100%' }}
        >
          {charts}
        </div>
    </div>
  );
}