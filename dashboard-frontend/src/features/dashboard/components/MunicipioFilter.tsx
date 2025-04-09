import React from 'react';
import Select from '../../../components/ui/Select'; // Corrected path
import { Municipio, Ano } from '../../../types'; // Assuming types are defined

interface FilterDataForSelect {
  municipios: Municipio[];
  anos: Ano[];
}

interface MunicipioFiltersProps {
  filterData: FilterDataForSelect | null; // Renamed for clarity
  selectedMunicipio: Municipio | null;
  setSelectedMunicipio: (municipio: Municipio | null) => void;
  selectedAno: string | null;
  setSelectedAno: (ano: string | null) => void;
}

export const MunicipioFilters: React.FC<MunicipioFiltersProps> = ({
  filterData,
  selectedMunicipio,
  setSelectedMunicipio,
  selectedAno,
  setSelectedAno,
}) => {
  // Anos fixos como no original, mas poderia vir de filterData.anos
  const anosParaSelecao: Ano[] = [
    { ano: '2019' }, { ano: '2020' }, { ano: '2021' }, { ano: '2022' }, { ano: '2023' },
  ];
  // Encontrar o objeto Ano correspondente ao valor string 'selectedAno'
  const selectedAnoObject = anosParaSelecao.find(a => a.ano === selectedAno) || null;

  const isLoading = !filterData;
  const hasMunicipios = filterData?.municipios && filterData.municipios.length > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto items-center">
      {/* Label + Select Município */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label
          htmlFor="municipio-select-filter"
          className="text-sm font-medium text-gray-700 whitespace-nowrap"
        >
          Município:
        </label>
        <Select
          id="municipio-select-filter"
          data={filterData?.municipios || []}
          value={selectedMunicipio}
          onChange={setSelectedMunicipio} // Passa a função diretamente
          labelKey="nome"
          valueKey="nome" // Assume nome é único, idealmente seria um 'id'
          placeholder="Selecione..."
          className="w-full min-w-[150px] sm:w-auto flex-grow sm:flex-grow-0 sm:w-48 md:w-56"
          isClearable={true}
          isDisabled={isLoading || !hasMunicipios}
          noOptionsMessage={() => isLoading ? 'Carregando...' : 'Nenhum município'}
        />
      </div>

      {/* Label + Select Ano */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label
          htmlFor="ano-select-filter"
          className="text-sm font-medium text-gray-700"
        >
          Ano:
        </label>
        <Select
          id="ano-select-filter"
          data={anosParaSelecao}
          value={selectedAnoObject}
          onChange={(value: Ano | null) => setSelectedAno(value ? value.ano : null)}
          labelKey="ano"
          valueKey="ano"
          placeholder="Selecione..."
          className="w-full min-w-[100px] sm:w-auto flex-grow sm:flex-grow-0 sm:w-32 md:w-36"
          isClearable={true}
          isDisabled={isLoading} // Desabilita se os filtros gerais não carregaram
        />
      </div>
    </div>
  );
};