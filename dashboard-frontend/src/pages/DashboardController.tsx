import React, { useState } from 'react';
import { DashboardMunicipios, MunicipioFilters } from './DashboardMunicipios';
import { DashboardParaiba, PeriodoFilter } from './DashboardParaiba';
import LoadingOverlay from '../components/LoadingOverlay';
import { getFilterData } from '../hooks/getFilterData';

type ViewType = 'municipio' | 'paraiba';

export const DashboardController: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('municipio');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Estados para os filtros de município
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [selectedAno, setSelectedAno] = useState(null);
  
  // Obter dados do filtro
  const { filter, isLoadingFilter } = getFilterData();
  
  // Função para lidar com a mudança de visão
  const handleViewChange = (view: ViewType): void => {
    setIsLoading(true); // Ativar o loading
    setActiveView(view);
    // O loading será desativado pelo componente de dashboard quando os dados estiverem prontos
  };
  
  // Função para ser passada aos dashboards para que possam atualizar o estado de loading
  const setLoadingState = (loadingState: boolean): void => {
    setIsLoading(loadingState || isLoadingFilter);
  };
  
  const renderHeader = (): JSX.Element => (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Bandeira_da_Para%C3%ADba.svg"
            alt="Bandeira da Paraíba"
            className="w-10 h-7 sm:w-12 sm:h-8"
          />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold">
              Dashboard Educacional - Paraíba
            </h1>
            <div className="flex items-center bg-neutral-100 rounded-full p-1">
              <button 
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeView === 'paraiba' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-300 text-black'
                }`}
                onClick={() => handleViewChange('paraiba')}
              >
                Paraíba
              </button>
              <button 
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeView === 'municipio' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-300 text-black'
                }`}
                onClick={() => handleViewChange('municipio')}
              >
                Município
              </button>
            </div>
          </div>
        </div>
        
        {/* Adicione os filtros aqui quando a visão for município */}
        {activeView === 'municipio' && filter ? (
          <div className="mt-4 sm:mt-0">
            <MunicipioFilters
              filter={filter}
              selectedMunicipio={selectedMunicipio}
              setSelectedMunicipio={setSelectedMunicipio}
              selectedAno={selectedAno}
              setSelectedAno={setSelectedAno}
            />
          </div>
        ) : <div className="mt-4 sm:mt-0">
                <PeriodoFilter
                  filter={filter}
                  selectedAno={selectedAno}
                  setSelectedAno={setSelectedAno}
                />
            </div>}
      </div>
    </header>
  );
  
  return (
    <div className="w-full min-h-screen bg-neutral-50">
      {renderHeader()}
      
      {/* Overlay de Loading */}
      {isLoading && <LoadingOverlay />}
      
      {/* Renderização condicional do dashboard ativo */}
      <div className="w-full min-h-screen p-4 lg:p-6 pt-24">
        {activeView === 'municipio' ? (
          <DashboardMunicipios 
            setLoadingState={setLoadingState} 
            // Passe os estados de filtro para o DashboardMunicipios
            selectedMunicipio={selectedMunicipio}
            setSelectedMunicipio={setSelectedMunicipio}
            selectedAno={selectedAno}
            setSelectedAno={setSelectedAno}
          />
        ) : (
          <DashboardParaiba setLoadingState={setLoadingState} />
        )}
      </div>
    </div>
  );
};