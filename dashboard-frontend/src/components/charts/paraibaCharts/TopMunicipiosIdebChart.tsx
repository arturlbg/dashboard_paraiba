import React, { useState, useEffect, useCallback } from 'react';
import Chart from 'react-apexcharts';

interface Despesa {
  nome_municipio: string;
  ano: string;
  despesa_total: number;
}

interface IdebEscolas {
  nome_municipio: string;
  ano: number;
  nota_mt: number;
  nota_lp: number;
}

interface MunicipioComDespesaESaeb {
  nome_municipio: string;
  ano: number;
  despesa_total: number;
  nota_mt: number;
  nota_lp: number;
}

interface TopMunicipiosProps {
  dadosDespesa: Despesa[];
  dadosIdeb: IdebEscolas[];
}

// Implementação simplificada do componente Button
const Button = ({ variant, onClick, children, ...props }: any) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      borderRadius: '4px',
      backgroundColor: variant === 'default' ? '#007bff' : 'transparent',
      color: variant === 'default' ? '#fff' : '#007bff',
      border: variant === 'outline' ? '1px solid #007bff' : 'none',
      cursor: 'pointer',
      fontSize: '14px',
      ...props,
    }}
  >
    {children}
  </button>
);

// Implementação simplificada do componente Slider
const Slider = ({ defaultValue, max, min, step, onValueChange, className, ...props }: any) => {
  const [value, setValue] = useState(defaultValue[0]);

  const handleChange = (e: any) => {
    const newValue = parseInt(e.target.value, 10);
    setValue(newValue);
    onValueChange([newValue]);
  };

  useEffect(() => {
    setValue(defaultValue[0]);
  }, [defaultValue]);

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={handleChange}
      className={className}
      {...props}
      style={{ width: '200px' }}
    />
  );
};

// Implementação simplificada do componente Select
const Select = ({ onValueChange, value, children, ...props }: any) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (e: any) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    onValueChange(newValue);
  };

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div {...props} style={{ position: 'relative' }}>
      <select
        value={selectedValue}
        onChange={handleChange}
        style={{
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '14px',
          appearance: 'none', // Remove a aparência padrão do select
          width: '100%',
          cursor: 'pointer',
          paddingRight: '24px', // Espaço para a seta
          backgroundColor: 'white',
        }}
      >
        {children}
      </select>
      {/* Seta personalizada */}
      <div
        style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none', // Evita que a seta interfira nos cliques
          fontSize: '16px',
        }}
      >
        ▼
      </div>
    </div>
  );
};

const SelectTrigger = ({ className, children, ...props }: any) => (
  <div
    className={className}
    {...props}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '14px',
      width: '180px',
      justifyContent: 'space-between',
      backgroundColor: 'white',
    }}
  >
    {children}
  </div>
);
const SelectValue = ({ placeholder, ...props }: any) => (
  <span {...props} style={{ marginRight: '8px', fontSize: '14px' }}>{placeholder}</span>
);
const SelectContent = ({ children, ...props }: any) => (
  <div
    {...props}
    style={{
      border: '1px solid #ccc',
      borderRadius: '4px',
      position: 'absolute',
      zIndex: 10,
      backgroundColor: 'white',
      minWidth: '180px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}
  >
    {children}
  </div>
);
const SelectItem = ({ value, children, ...props }: any) => (
  <div
    value={value}
    {...props}
    style={{
      padding: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      ':hover': {
        backgroundColor: '#f0f0f0',
      },
    }}
  >
    {children}
  </div>
);
const cn = (...args: any[]) => args.filter(Boolean).join(' ');


interface Despesa {
  nome_municipio: string;
  ano: string;
  despesa_total: number;
}

interface IdebEscolas {
  nome_municipio: string;
  ano: number;
  nota_mt: number;
  nota_lp: number;
}

interface MunicipioComDespesaESaeb {
  nome_municipio: string;
  ano: number;
  despesa_total: number;
  nota_mt: number;
  nota_lp: number;
}

interface TopMunicipiosProps {
  dadosDespesa: Despesa[];
  dadosIdeb: IdebEscolas[];
}

const TopMunicipiosChart: React.FC<TopMunicipiosProps> = ({ dadosDespesa, dadosIdeb }) => {
  const [anoSelecionado, setAnoSelecionado] = useState<number | null>(null);
  const [tipoSaeb, setTipoSaeb] = useState<'matematica' | 'portugues'>('matematica');
  const [topInvestimento, setTopInvestimento] = useState<boolean>(true);
  const [numMunicipios, setNumMunicipios] = useState<number>(10);
  const [anosDisponiveis, setAnosDisponiveis] = useState<number[]>([]);
  const [dadosCombinados, setDadosCombinados] = useState<MunicipioComDespesaESaeb[]>([]); // Novo estado para os dados combinados


  // Combinar os dados de despesa e IdebEscolas por município e ano
  const combinarDadosFunction = useCallback((despesas: Despesa[], ideb: IdebEscolas[]): MunicipioComDespesaESaeb[] => {
    const dadosCombinados: MunicipioComDespesaESaeb[] = [];

    despesas.forEach(despesa => {
      const idebCorrespondente = ideb.find(i =>
        i.nome_municipio === despesa.nome_municipio && i.ano === Number(despesa.ano)
      );
      if (idebCorrespondente) {
        dadosCombinados.push({
          nome_municipio: despesa.nome_municipio,
          ano: Number(despesa.ano),
          despesa_total: despesa.despesa_total,
          nota_mt: idebCorrespondente.nota_mt,
          nota_lp: idebCorrespondente.nota_lp,
        });
      }
    });
    return dadosCombinados;
  }, []);



  useEffect(() => {
    const dadosCombinadosResult = combinarDadosFunction(dadosDespesa, dadosIdeb);
    setDadosCombinados(dadosCombinadosResult);
    // Extrair todos os anos únicos dos dados combinados
    const anos = [...new Set(dadosCombinadosResult.map(item => item.ano))].sort((a, b) => a - b);
    setAnosDisponiveis(anos);
    // Inicializar o ano selecionado com o menor ano disponível
    if (anos.length > 0) {
      setAnoSelecionado(anos[0]);
    }
  }, [dadosDespesa, dadosIdeb, combinarDadosFunction]); // Adicionado combinarDadosFunction como dependência



  const getTopMunicipios = useCallback((ano: number | null, top: boolean, n: number, tipo: 'matematica' | 'portugues', data: MunicipioComDespesaESaeb[]): { nome_municipio: string; despesa_total: number; nota: number }[] => {
    if (!ano) return [];

    const dadosAno = data.filter(item => item.ano === ano);

    // Calcular a média da despesa para cada município
    const despesaMedia: Record<string, number> = {};
    dadosAno.forEach(item => {
      despesaMedia[item.nome_municipio] = (despesaMedia[item.nome_municipio] || 0) + item.despesa_total;
    });

    const municipiosComMedias = Object.entries(despesaMedia).map(([nome_municipio, despesa_total]) => ({
      nome_municipio,
      despesa_total,
      nota: tipo === 'matematica'
        ? dadosAno.find(d => d.nome_municipio === nome_municipio)?.nota_mt || 0
        : dadosAno.find(d => d.nome_municipio === nome_municipio)?.nota_lp || 0,
    }));

    // Filtrar municípios com notas válidas (maiores que zero)
    const municipiosFiltrados = municipiosComMedias.filter(m => m.nota > 0);

    const sortedMunicipios = [...municipiosFiltrados].sort((a, b) => {
      if (top) {
        return b.despesa_total - a.despesa_total;
      } else {
        return a.despesa_total - b.despesa_total;
      }
    }).slice(0, n);

    return sortedMunicipios;
  }, []);

  const municipiosFiltrados = anoSelecionado ? getTopMunicipios(anoSelecionado, topInvestimento, numMunicipios, tipoSaeb, dadosCombinados) : [];


  const series = [
    {
      name: topInvestimento ? `Top ${numMunicipios} Investimento` : `Menor ${numMunicipios} Investimento`,
      data: municipiosFiltrados.map(m => ({
        x: m.nome_municipio,
        y: m.nota,
        despesa: m.despesa_total
      })),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 450,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      title: {
        text: tipoSaeb === 'matematica' ? 'Nota SAEB Matemática' : 'Nota SAEB Língua Portuguesa',
      },
    },
    yaxis: {
      title: {
        text: 'Município',
      },
    },
    tooltip: {
      custom: ({ seriesIndex, dataPointIndex, w }: any) => {
        const data = w.config.series[seriesIndex].data[dataPointIndex];
        return `<div style="padding: 8px; border-radius: 4px; background-color: #fff; color: #333; border: 1px solid #ddd;">
                  <p><strong>Município:</strong> ${data.x}</p>
                  <p><strong>Nota:</strong> ${data.y?.toFixed(2) || 'N/A'}</p>
                  <p><strong>Despesa:</strong> ${data.despesa?.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }) || 'N/A'}</p>
                </div>`;
      },
    },
    title: {
      text: `${topInvestimento ? `Top ${numMunicipios}` : `Menor ${numMunicipios}`} Municípios por Investimento em Educação (${anoSelecionado}) - ${tipoSaeb === 'matematica' ? 'Matemática' : 'Português'}`,
      align: 'left',
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex flex-wrap gap-4 items-center" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <span className="text-sm font-medium" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Ano:</span>
          <Select onValueChange={(value) => setAnoSelecionado(Number(value))} value={anoSelecionado?.toString()}>
            <SelectTrigger className="w-[180px]" style={{ width: '180px' }}>
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {anosDisponiveis.map(ano => (
                <SelectItem key={ano} value={ano.toString()}>
                  {ano}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm font-medium" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Tipo SAEB:</span>
          <Select onValueChange={(value) => setTipoSaeb(value as 'matematica' | 'portugues')} value={tipoSaeb}>
            <SelectTrigger className="w-[200px]" style={{ width: '200px' }}>
              <SelectValue placeholder="Selecione a matéria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="matematica">Matemática</SelectItem>
              <SelectItem value="portugues">Língua Portuguesa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-4 items-center" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <span className="text-sm font-medium" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Municípios:</span>
          <Slider
            defaultValue={[numMunicipios]}
            max={20}
            min={5}
            step={1}
            onValueChange={(value) => setNumMunicipios(value[0])}
            className="w-[200px]"
          />
          <span className="text-sm" style={{ fontSize: '0.875rem' }}>{numMunicipios}</span>
        </div>

        <div className="flex gap-4" style={{ display: 'flex', gap: '16px' }}>
          <Button
            variant={topInvestimento ? 'default' : 'outline'}
            onClick={() => setTopInvestimento(true)}
          >
            Maior Investimento
          </Button>
          <Button
            variant={!topInvestimento ? 'default' : 'outline'}
            onClick={() => setTopInvestimento(false)}
          >
            Menor Investimento
          </Button>
        </div>
      </div>
      {anoSelecionado && municipiosFiltrados.length > 0 ? ( // Verificação adicionada
        <Chart options={options} series={series} type="bar" />
      ) : (
        <div className="text-gray-500 text-center" style={{ color: '#6b7280', textAlign: 'center' }}>
          {anoSelecionado
            ? "Não há dados disponíveis para os critérios selecionados."
            : "Selecione um ano para visualizar o gráfico."
          }
        </div>
      )}
    </div>
  );
};

export default TopMunicipiosChart;

