import React, { useState } from 'react';
import { MunicipiosDashboard } from '../municipios/MunicipiosDashboard'; // Corrected path
import { ParaibaDashboard } from '../paraiba/ParaibaDashboard'; // Corrected path
import { MunicipioFilters } from './components/MunicipioFilter'; // Corrected path
import { PeriodoFilter } from './components/PeriodoFilter'; // Corrected path
import LoadingOverlay from '../../components/ui/LoadingOverlay'; // Corrected path
import { useDashboardFilters } from './hooks/useDashboardFilters'; // Corrected path
import { Municipio, Ano } from '../../types'; // Assuming types are defined

type ViewType = 'municipio' | 'paraiba';

export const DashboardController: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('municipio');
  const [globalIsLoading, setGlobalIsLoading] = useState<boolean>(true); // Tracks loading state from children
  const [selectedMunicipio, setSelectedMunicipio] = useState<Municipio | null>(null);
  const [selectedAno, setSelectedAno] = useState<string | null>('2023'); // Default year

  // Fetch filter data using the custom hook
  const { filterData, isLoading: isLoadingFilters, error: filterError } = useDashboardFilters();

  // Combined loading state: true if filters are loading OR if a child dashboard signals loading
  const isLoading = isLoadingFilters || globalIsLoading;

  const handleViewChange = (view: ViewType): void => {
    if (view === activeView) return;
    setGlobalIsLoading(true); // Assume loading when switching views until child confirms otherwise
    setActiveView(view);
    // Reset municipio selection when switching away from municipio view? Optional.
    // if (view === 'paraiba') {
    //   setSelectedMunicipio(null);
    // }
  };

  // Function passed to child dashboards to update the global loading state
  const handleSetLoadingState = (loadingState: boolean): void => {
    // Only update global loading if it's different from filter loading state
    // Or simply set it based on the child's state
    setGlobalIsLoading(loadingState);
  };

  const renderHeader = (): JSX.Element => (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-4 sm:px-6 py-3">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        {/* Logo e Título */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Consider replacing img with a component if used elsewhere */}
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
              disabled={isLoading} // Disable buttons while loading
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
              disabled={isLoading} // Disable buttons while loading
            >
              Por Município
            </button>
          </div>

          {/* Filtros Condicionais */}
          <div className="flex items-center w-full sm:w-auto">
            {/* Display error if filter loading failed */}
            {filterError && <span className="text-red-500 text-xs mx-2">Erro ao carregar filtros!</span>}

            {activeView === 'municipio' ? (
              <MunicipioFilters
                filterData={filterData} // Pass fetched filter data
                selectedMunicipio={selectedMunicipio}
                setSelectedMunicipio={setSelectedMunicipio}
                selectedAno={selectedAno}
                setSelectedAno={setSelectedAno}
              />
            ) : (
              <PeriodoFilter
                selectedAno={selectedAno}
                setSelectedAno={setSelectedAno}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {renderHeader()}
      {isLoading && <LoadingOverlay text={isLoadingFilters ? "Carregando filtros..." : "Carregando dados..."} />}

      <main className="w-full p-4 lg:p-6 pt-[120px] sm:pt-[90px]"> {/* Adjust padding based on final header height */}
        {/* Conditionally render dashboards based on view */}
        {activeView === 'municipio' ? (
          <MunicipiosDashboard
            filterData={filterData} // Pass filter data down
            //isLoadingFilters={isLoadingFilters} // Let the child know if filters are loading
            setLoadingState={handleSetLoadingState} // Pass the function to update global loading
            selectedMunicipio={selectedMunicipio}
            selectedAno={selectedAno}
            // No need to pass setters if they are handled here
          />
        ) : (
          <ParaibaDashboard
             // isLoadingFilters={isLoadingFilters} // Let the child know
             setLoadingState={handleSetLoadingState} // Pass the function
             selectedAno={selectedAno}
             // No need to pass setSelectedAno if handled here
          />
        )}
      </main>
    </div>
  );
};