import React from 'react';
import Select from '../../../components/ui/Select'; // Corrected path
import { Ano } from '../../../types'; // Assuming Ano type is defined

interface PeriodoFilterProps {
  selectedAno: string | null;
  setSelectedAno: (ano: string | null) => void; // Allow setting null
  // filter prop removed if not strictly needed for anos
}

export const PeriodoFilter: React.FC<PeriodoFilterProps> = ({
  selectedAno,
  setSelectedAno,
}) => {
  // Using fixed years as before
  const anosParaSelecao: Ano[] = [
    { ano: '2019' }, { ano: '2020' }, { ano: '2021' }, { ano: '2022' }, { ano: '2023' },
  ];

  // Find the corresponding Ano object for the selected string value
  const selectedAnoObject = anosParaSelecao.find(a => a.ano === selectedAno) || null;

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto items-center">
      <label htmlFor="ano-select-controller" className="text-sm font-medium text-gray-700 sr-only sm:not-sr-only">
        Ano:
      </label>
      <Select
        id="ano-select-controller"
        data={anosParaSelecao}
        value={selectedAnoObject}
        onChange={(value: Ano | null) => setSelectedAno(value ? value.ano : null)} // Set string value or null
        labelKey="ano"
        valueKey="ano"
        placeholder="Selecione..."
        className="w-full sm:w-32 md:w-40"
        isClearable={true} // Allow clearing the selection
      />
    </div>
  );
};