// src/components/MunicipioFilters.tsx
import React from 'react';
import Select from './Select'; // Ajuste o caminho para o Select se necessário

// Interfaces necessárias APENAS para este componente de filtro
// Você pode precisar ajustar ou importar de um arquivo de tipos central
interface Municipio {
  nome: string;
  // Adicione outras propriedades se o Select precisar (ex: um ID único)
}

interface Ano {
  ano: string;
}

// Interface Filter simplificada para o que este componente USA
interface FilterDataForSelect {
  municipios: Municipio[];
  anos: Ano[]; // Se você decidir usar filter.anos no Select de Ano
}

interface MunicipioFiltersProps {
  filter: FilterDataForSelect | null; // Recebe os dados para os selects
  selectedMunicipio: Municipio | null;
  setSelectedMunicipio: (municipio: Municipio | null) => void;
  selectedAno: string | null;
  setSelectedAno: (ano: string | null) => void;
}

export const MunicipioFilters: React.FC<MunicipioFiltersProps> = ({
  filter,
  selectedMunicipio,
  setSelectedMunicipio,
  selectedAno,
  setSelectedAno,
}) => {

  // Anos - usando fixo como no código original, mas poderia usar filter?.anos
  const anosParaSelecao: Ano[] = [
    { ano: '2019' }, { ano: '2020' }, { ano: '2021' }, { ano: '2022' }, { ano: '2023' },
  ];
  const selectedAnoObject = anosParaSelecao.find(a => a.ano === selectedAno) || null;

  const isDisabled = !filter;

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
      {/* Select Município */}
      <Select
        data={filter?.municipios || []}
        value={selectedMunicipio}
        onChange={(value: Municipio | null) => setSelectedMunicipio(value)}
        labelKey="nome"
        valueKey="nome"
        placeholder="Município..."
        className="w-full sm:w-48 md:w-56"
        isClearable={true}
        isDisabled={isDisabled || !filter?.municipios || filter.municipios.length === 0} // Desabilita se não houver filter ou municípios
        noOptionsMessage={() => isDisabled ? 'Carregando...' : 'Nenhum município'} // Mensagem customizada
      />
      {/* Select Ano */}
      <Select
        data={anosParaSelecao}
        value={selectedAnoObject}
        onChange={(value: Ano | null) => setSelectedAno(value ? value.ano : null)}
        labelKey="ano"
        valueKey="ano"
        placeholder="Ano..."
        className="w-full sm:w-32 md:w-36"
        isClearable={true}
        isDisabled={isDisabled}
      />
    </div>
  );
};