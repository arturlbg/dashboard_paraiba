// src/components/PeriodoFilter.tsx
import React from 'react';
import Select from './ui/Select'; // Ajuste o caminho para o componente Select se necessário

// Interfaces necessárias para o PeriodoFilter
interface Filter {
    // Defina as propriedades se necessário
}

interface Ano {
  ano: string;
}

interface PeriodoFilterProps {
  filter: Filter | null;
  selectedAno: string | null;
  setSelectedAno: (ano: string) => void;
}

// Componente PeriodoFilter
export const PeriodoFilter: React.FC<PeriodoFilterProps> = ({
  filter, // pode não ser usado se os anos são fixos
  selectedAno,
  setSelectedAno,
}) => {
  const anosParaSelecao: Ano[] = [
    { ano: '2019' }, { ano: '2020' }, { ano: '2021' }, { ano: '2022' }, { ano: '2023' },
    // Adicione mais anos se necessário
  ];

  const selectedAnoObjeto = anosParaSelecao.find(a => a.ano === selectedAno) || null;

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto items-center">
       <label htmlFor="ano-select-controller" className="text-sm font-medium text-gray-700 sr-only sm:not-sr-only">
         Ano: {/* Label mais curto talvez? */}
       </label>
       <Select
         id="ano-select-controller" // ID único
         data={anosParaSelecao}
         value={selectedAnoObjeto}
         onChange={(value: Ano | null) => {
            if (value) { setSelectedAno(value.ano); }
         }}
         labelKey="ano"
         valueKey="ano" // Ajuda o Select a identificar o valor único
         placeholder="Selecione..."
         className="w-full sm:w-32 md:w-40" // Ajuste a largura conforme necessário
       />
    </div>
  );
};

// Exporte o componente como default ou nomeado
// export default PeriodoFilter; // Se preferir exportação default