// src/components/MunicipioFilters.tsx
import React from 'react';
import Select from './Select'; // Ajuste o caminho para o Select se necessário

// --- Interfaces (mantidas como antes) ---
interface Municipio {
  nome: string;
  // Adicione outras propriedades se o Select precisar (ex: um ID único)
}
interface Ano {
  ano: string;
}
interface FilterDataForSelect {
  municipios: Municipio[];
  anos: Ano[];
}
interface MunicipioFiltersProps {
  filter: FilterDataForSelect | null;
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

  // Anos - usando fixo como no código original
  const anosParaSelecao: Ano[] = [
    { ano: '2019' }, { ano: '2020' }, { ano: '2021' }, { ano: '2022' }, { ano: '2023' },
  ];
  const selectedAnoObject = anosParaSelecao.find(a => a.ano === selectedAno) || null;

  // Verifica se o filtro principal está carregado para habilitar/desabilitar
  const isDisabled = !filter;

  return (
    // Container principal: ajustado para alinhar itens ao centro na linha
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 w-full sm:w-auto items-center">

      {/* --- Grupo Município (Label + Select) --- */}
      <div className="flex items-center gap-2 w-full sm:w-auto"> {/* Agrupa label e select */}
        <label
          htmlFor="municipio-select-filter" // Aponta para o ID do Select de Município
          className="text-sm font-medium text-gray-700 whitespace-nowrap" // Estilo do Label (whitespace-nowrap evita quebra de linha)
        >
          Município:
        </label>
        <Select
          id="municipio-select-filter" // Adiciona ID para o label
          data={filter?.municipios || []}
          value={selectedMunicipio}
          onChange={(value: Municipio | null) => setSelectedMunicipio(value)}
          labelKey="nome"
          valueKey="nome" // Idealmente use um ID se nome não for único
          placeholder="Selecione..." // Placeholder mais curto
          className="w-full min-w-[150px] sm:w-auto flex-grow sm:flex-grow-0 sm:w-48 md:w-56" // Ajusta largura e crescimento
          isClearable={true}
          isDisabled={isDisabled || !filter?.municipios || filter.municipios.length === 0}
          noOptionsMessage={() => isDisabled ? 'Carregando...' : 'Nenhum município'}
        />
      </div>

      {/* --- Grupo Ano (Label + Select) --- */}
      <div className="flex items-center gap-2 w-full sm:w-auto"> {/* Agrupa label e select */}
        <label
          htmlFor="ano-select-filter" // Aponta para o ID do Select de Ano
          className="text-sm font-medium text-gray-700" // Estilo do Label
        >
          Ano:
        </label>
        <Select
          id="ano-select-filter" // Adiciona ID para o label
          data={anosParaSelecao} // Usando lista fixa
          value={selectedAnoObject}
          onChange={(value: Ano | null) => setSelectedAno(value ? value.ano : null)}
          labelKey="ano"
          valueKey="ano"
          placeholder="Selecione..." // Placeholder mais curto
          className="w-full min-w-[100px] sm:w-auto flex-grow sm:flex-grow-0 sm:w-32 md:w-36" // Ajusta largura e crescimento
          isClearable={true}
          isDisabled={isDisabled} // Desabilita apenas se o 'filter' geral não carregou
        />
      </div>

    </div>
  );
};