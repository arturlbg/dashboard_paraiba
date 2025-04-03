import React, { useState, useEffect } from 'react';
import { DashboardMunicipios } from './DashboardMunicipios';                     // <<< MANTENHA essa linha
import { MunicipioFilters } from '../components/MunicipioFilter';               // <<< ADICIONE essa linha (ajuste o caminho)
import { DashboardParaiba } from './DashboardParaiba';
import { PeriodoFilter } from '../components/PeriodoFilter';
import LoadingOverlay from '../components/LoadingOverlay';
import { getMunicipiosFilterData } from '../hooks/getMunicipiosFilterData';

type ViewType = 'municipio' | 'paraiba';

export const DashboardController: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('municipio'); // Estado definido DENTRO do componente
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMunicipio, setSelectedMunicipio] = useState<any>(null); // Use um tipo mais específico se possível
  const [selectedAno, setSelectedAno] = useState<string | null>('2023'); // Ano inicial

  const { filter, isLoadingFilter } = getMunicipiosFilterData();

  const handleViewChange = (view: ViewType): void => {
    if (view === activeView) return;
    setIsLoading(true); // Ativar o loading ao trocar
    setActiveView(view);
  };

  const setLoadingState = (loadingState: boolean): void => {
    setIsLoading(loadingState || isLoadingFilter);
  };

  const renderHeader = (): JSX.Element => (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-4 sm:px-6 py-3">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        {/* Logo e Título */}
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Bandeira_da_Para%C3%ADba.svg"
            alt="Bandeira da Paraíba"
            className="w-10 h-7 sm:w-12 sm:h-8 object-contain"
          />
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Dashboard Educacional PB</h1>
        </div>

        {/* Container para Botões de Visão e Filtro */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Botões de Visão */}
          <div className="flex items-center bg-gray-100 rounded-full p-1">
            <button
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                activeView === 'paraiba'
                  ? 'bg-white shadow text-blue-600'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleViewChange('paraiba')}
            >
              Visão Geral (PB)
            </button>
            <button
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                activeView === 'municipio'
                  ? 'bg-white shadow text-blue-600'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleViewChange('municipio')}
            >
              Por Município
            </button>
          </div>

          {/* Filtros Condicionais */}
          <div className="flex items-center w-full sm:w-auto">
            {activeView === 'municipio' && filter ? ( // Uso de activeView AQUI DENTRO
              <MunicipioFilters
                filter={filter}
                selectedMunicipio={selectedMunicipio}
                setSelectedMunicipio={setSelectedMunicipio}
                selectedAno={selectedAno}
                setSelectedAno={setSelectedAno}
              />
            ) : (
              // Renderiza PeriodoFilter para a visão 'paraiba'
              <PeriodoFilter
                filter={filter} // Passa o filter (pode ser null)
                selectedAno={selectedAno}
                setSelectedAno={setSelectedAno}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
  // --- Fim da definição de renderHeader ---

  // --- JSX Retornado pelo Componente ---
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {renderHeader()} {/* Chamada da função interna */}
      {isLoading && <LoadingOverlay text="Carregando dados..." />}

      {/* Conteúdo Principal com Padding para Header Fixo */}
      <main className="w-full p-4 lg:p-6 pt-[120px] sm:pt-[90px]"> {/* Ajuste pt se a altura do header mudar */}
        {activeView === 'municipio' ? (
          <DashboardMunicipios
            setLoadingState={setLoadingState}
            selectedMunicipio={selectedMunicipio}
            setSelectedMunicipio={setSelectedMunicipio}
            selectedAno={selectedAno}
            setSelectedAno={setSelectedAno}
          />
        ) : (
          <DashboardParaiba
            setLoadingState={setLoadingState}
            selectedAno={selectedAno}
            setSelectedAno={setSelectedAno}
          />
        )}
      </main>
    </div>
  );
}; // --- Fim do componente DashboardController ---