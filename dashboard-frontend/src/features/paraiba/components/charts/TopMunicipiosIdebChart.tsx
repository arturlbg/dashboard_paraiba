import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import Select from '../../../../components/ui/Select'; // Use the central Select component
import { DespesaMunicipio, IndicadorEducacional } from '../../../../types'; // Import types

// Define combined data structure
interface MunicipioDespesaIndicador {
  nome_municipio: string;
  ano: number;
  despesa_total: number;
  nota_mt: number;
  nota_lp: number;
}

// Props for the component
interface TopMunicipiosChartProps {
  dadosDespesa: DespesaMunicipio[];
  dadosIdeb: IndicadorEducacional[]; // Renamed prop
}

// Define types for Select options
interface AnoOption { ano: number; }
interface TipoSaebOption { value: 'matematica' | 'portugues'; label: string; }

const tipoSaebOptions: TipoSaebOption[] = [
    { value: 'matematica', label: 'Matemática' },
    { value: 'portugues', label: 'Língua Portuguesa' }
];

const TopMunicipiosIdebChart: React.FC<TopMunicipiosChartProps> = ({ dadosDespesa, dadosIdeb }) => { // Renamed prop used
  const [anoSelecionado, setAnoSelecionado] = useState<number | null>(null);
  const [tipoSaeb, setTipoSaeb] = useState<TipoSaebOption>(tipoSaebOptions[0]); // Default to Matemática object
  const [topInvestimento, setTopInvestimento] = useState<boolean>(true);
  const [numMunicipios, setNumMunicipios] = useState<number>(10);
  const [anosDisponiveis, setAnosDisponiveis] = useState<AnoOption[]>([]);
  const [dadosCombinados, setDadosCombinados] = useState<MunicipioDespesaIndicador[]>([]);

  // Function to combine expense and indicator data
  const combinarDadosFunction = useCallback((despesas: DespesaMunicipio[], indicadores: IndicadorEducacional[]): MunicipioDespesaIndicador[] => {
    const dadosMap = new Map<string, Partial<MunicipioDespesaIndicador>>();

    despesas.forEach(despesa => {
      const key = `${despesa.nome_municipio}-${despesa.ano}`;
      if (!dadosMap.has(key)) {
        dadosMap.set(key, { nome_municipio: despesa.nome_municipio, ano: Number(despesa.ano) });
      }
      dadosMap.get(key)!.despesa_total = despesa.despesa_total;
    });

    indicadores.forEach(indicador => {
       const key = `${indicador.nome_municipio}-${indicador.ano}`;
       if (!dadosMap.has(key)) {
          // If only indicator exists, still include (despesa might be 0 or missing)
           dadosMap.set(key, { nome_municipio: indicador.nome_municipio, ano: Number(indicador.ano) });
       }
        const entry = dadosMap.get(key)!;
       entry.nota_mt = typeof indicador.nota_mt === 'number' ? indicador.nota_mt : 0; // Handle potential null/undefined
       entry.nota_lp = typeof indicador.nota_lp === 'number' ? indicador.nota_lp : 0;
    });

    // Convert map back to array, ensuring all required fields exist (defaulting if necessary)
    return Array.from(dadosMap.values()).map(item => ({
        nome_municipio: item.nome_municipio!,
        ano: item.ano!,
        despesa_total: item.despesa_total ?? 0,
        nota_mt: item.nota_mt ?? 0,
        nota_lp: item.nota_lp ?? 0,
    }));
  }, []);

  // Effect to process data when input props change
  useEffect(() => {
    const combined = combinarDadosFunction(dadosDespesa, dadosIdeb); // Use renamed prop
    setDadosCombinados(combined);

    const uniqueAnos = [...new Set(combined.map(item => item.ano))]
      .sort((a, b) => a - b)
      .map(ano => ({ ano })); // Format for Select component
    setAnosDisponiveis(uniqueAnos);

    // Set default selected year if available and not already set
    if (uniqueAnos.length > 0 && anoSelecionado === null) {
      setAnoSelecionado(uniqueAnos[0].ano);
    } else if (uniqueAnos.length === 0) {
        // Handle case with no common years
        setAnoSelecionado(null);
    }

  }, [dadosDespesa, dadosIdeb, combinarDadosFunction, anoSelecionado]); // Re-run if base data changes, use renamed prop

 // Function to get top/bottom municipalities based on criteria
 const getTopMunicipios = useCallback((ano: number | null, top: boolean, n: number, tipo: 'matematica' | 'portugues', data: MunicipioDespesaIndicador[]): { nome_municipio: string; despesa_total: number; nota: number }[] => {
    if (!ano) return [];

    const dadosAno = data.filter(item => item.ano === ano);

    // Filter out municipalities with zero notes for the selected subject
    const municipiosFiltrados = dadosAno.filter(m => (tipo === 'matematica' ? m.nota_mt : m.nota_lp) > 0);

     // Sort based on investment (despesa_total)
    const sortedByInvestment = [...municipiosFiltrados].sort((a, b) => {
      return top ? b.despesa_total - a.despesa_total : a.despesa_total - b.despesa_total;
    });

     // Take the top/bottom 'n' and format for the chart
    return sortedByInvestment.slice(0, n).map(m => ({
        nome_municipio: m.nome_municipio,
        despesa_total: m.despesa_total,
        nota: tipo === 'matematica' ? m.nota_mt : m.nota_lp,
    })).sort((a, b) => b.nota - a.nota); // Sort final list by note for better bar chart readability

  }, []); // No external dependencies needed for the logic itself

  // Calculate filtered municipalities for the chart
  const municipiosParaGrafico = useMemo(() => {
      return anoSelecionado ? getTopMunicipios(anoSelecionado, topInvestimento, numMunicipios, tipoSaeb.value, dadosCombinados) : [];
  }, [anoSelecionado, topInvestimento, numMunicipios, tipoSaeb.value, dadosCombinados, getTopMunicipios]);


  // Chart Series and Options
  const series = [
    {
      name: topInvestimento ? `Top ${numMunicipios} Investimento` : `Menor ${numMunicipios} Investimento`,
      data: municipiosParaGrafico.map(m => ({
        x: m.nome_municipio,
        y: m.nota,
        despesa: m.despesa_total // Include expense for tooltip
      })),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 450, // Adjust height as needed
      toolbar: { show: true, tools: { download: true, selection: false, zoom: false, zoomin: false, zoomout: false, pan: false, reset: false } }, // Show only download
      fontFamily: 'Open Sans, sans-serif',
    },
    plotOptions: {
      bar: {
        horizontal: true, // Horizontal bars often better for long labels
        barHeight: '70%', // Adjust bar height/spacing
      },
    },
    dataLabels: {
      enabled: false, // Keep labels off bars for clarity
    },
    xaxis: {
      title: {
        text: tipoSaeb.value === 'matematica' ? 'Nota SAEB Matemática' : 'Nota SAEB Língua Portuguesa',
        style: { color: '#555', fontSize: '12px', fontWeight: 500 }
      },
      labels: {
        formatter: (value: string | number, timestamp?: number, opts?: any) => { // Ajuste a assinatura
          const numericValue = typeof value === 'number' ? value : parseFloat(value);
          return numericValue.toFixed(1);
        },
        style: { colors: '#555', fontSize: '11px' }
      }
    },,
    yaxis: {
      title: {
        // text: 'Município', // Often redundant with labels
      },
       labels: {
         style: { colors: '#555', fontSize: '12px' }
       }
    },
    tooltip: {
        // Custom tooltip for better formatting
        custom: ({ seriesIndex, dataPointIndex, w }: any) => {
            if (!w.config.series[seriesIndex]?.data[dataPointIndex]) return ''; // Safety check
            const data = w.config.series[seriesIndex].data[dataPointIndex];
            const despesaFormatted = data.despesa?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }) ?? 'N/A';
            const notaFormatted = data.y?.toFixed(2) ?? 'N/A';

            return `<div class="p-2 bg-white border border-gray-200 rounded shadow-md text-xs">
                      <p><strong>Município:</strong> ${data.x}</p>
                      <p><strong>Nota:</strong> ${notaFormatted}</p>
                      <p><strong>Despesa Total (${anoSelecionado}):</strong> ${despesaFormatted}</p>
                    </div>`;
      },
    },
    title: {
       text: `${topInvestimento ? `Top ${numMunicipios}` : `${numMunicipios} Menor`} Investimento vs Nota SAEB (${tipoSaeb.label} - ${anoSelecionado || ''})`,
       align: 'left',
       style: { fontSize: '16px', fontWeight: 'bold', color: '#444' }
    },
     grid: {
         borderColor: '#e7e7e7',
         xaxis: { lines: { show: true } },
         yaxis: { lines: { show: false } } // Hide horizontal grid lines if using horizontal bars
     }
  };

  // Handler for slider change
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumMunicipios(parseInt(event.target.value, 10));
  };

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">

          {/* Ano e Tipo SAEB */}
          <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                 <label htmlFor="ano-select-top" className="text-sm font-medium text-gray-700">Ano:</label>
                  <Select
                      id="ano-select-top"
                      data={anosDisponiveis}
                      value={anosDisponiveis.find(a => a.ano === anoSelecionado) || null}
                      onChange={(value: AnoOption | null) => setAnoSelecionado(value ? value.ano : null)}
                      labelKey="ano"
                      valueKey="ano"
                      placeholder="Ano..."
                      className="w-28" // Smaller width
                  />
              </div>
              <div className="flex items-center gap-2">
                 <label htmlFor="saeb-select-top" className="text-sm font-medium text-gray-700">Matéria:</label>
                  <Select
                      id="saeb-select-top"
                      data={tipoSaebOptions}
                      value={tipoSaeb}
                      onChange={(value: TipoSaebOption | null) => setTipoSaeb(value || tipoSaebOptions[0])} // Ensure value is not null
                      labelKey="label"
                      valueKey="value"
                      className="w-40"
                  />
              </div>
          </div>

           {/* Slider Nº Municípios */}
           <div className="flex items-center gap-2">
               <label htmlFor="num-municipios-slider" className="text-sm font-medium text-gray-700">Nº Municípios:</label>
               <input
                   id="num-municipios-slider"
                   type="range"
                   min="5"
                   max="20"
                   step="1"
                   value={numMunicipios}
                   onChange={handleSliderChange}
                   className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" // Tailwind styling for range
               />
               <span className="text-sm text-gray-600 w-6 text-right">{numMunicipios}</span>
           </div>

           {/* Botões Maior/Menor Investimento */}
           <div className="flex gap-2">
               <button
                   onClick={() => setTopInvestimento(true)}
                   className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${topInvestimento ? 'bg-blue-500 text-white shadow' : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'}`}
               >
                   Maior Invest.
               </button>
               <button
                   onClick={() => setTopInvestimento(false)}
                   className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${!topInvestimento ? 'bg-blue-500 text-white shadow' : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'}`}
               >
                   Menor Invest.
               </button>
           </div>
      </div>

      {/* Gráfico ou Mensagem */}
      {anoSelecionado && municipiosParaGrafico.length > 0 ? (
        <Chart options={options} series={series} type="bar" height={450}/>
      ) : (
        <div className="text-center text-gray-500 py-10 min-h-[450px] flex items-center justify-center">
          {anoSelecionado
            ? "Não há dados suficientes para exibir o gráfico com os critérios selecionados."
            : "Selecione um ano para visualizar o gráfico."
          }
        </div>
      )}
    </div>
  );
};

export default TopMunicipiosIdebChart; // Export as default or named