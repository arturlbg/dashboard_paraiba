import React, { useEffect } from 'react';
import { getEstadoData } from '../hooks/getEstadoData';
import '../style.css';
import { EvolucaoIdebChart } from '../components/charts/EvolucaoIdebChart';
import { MediaEnemPorAreaChart } from '../components/charts/MediaEnemPorAreaChart';
import { ComparacaoIdebMunicipiosChart } from '../components/charts/ComparacaoIdebMunicipiosChart';
import { FaqSection } from '../components/FaqSection';

// Interfaces
interface EstadoData {
  populacao: number;
  idhm: number;
  area_territorial: number;
  faqs: any[];
  // Adicione aqui outros campos necessários
  [key: string]: any;
}

interface DashboardParaibaProps {
  setLoadingState: (isLoading: boolean) => void;
}

export const DashboardParaiba: React.FC<DashboardParaibaProps> = ({ setLoadingState }) => {
  // Obter dados do estado usando hook personalizado
  const { estadoData, isLoadingEstado, estadoError } = [];//getEstadoData<EstadoData>();

  // Atualizar o estado de loading no componente pai
  useEffect(() => {
    setLoadingState(isLoadingEstado);
  }, [isLoadingEstado, setLoadingState]);

  if (estadoError) {
    return <p className="text-red-500">Erro: {estadoError}</p>;
  }
  
  if (!estadoData) {
    return <p>Nenhum dado disponível.</p>;
  }

  const renderEstadoInfo = (): JSX.Element => (
    <div className="mt-4 mb-6 bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Informações da Paraíba</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="material-symbols-outlined text-blue-500">
            location_city
          </span>
          <p className="text-sm mt-2">População</p>
          <p className="text-lg font-semibold">
            {estadoData.populacao.toLocaleString()} habitantes
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="material-symbols-outlined text-green-500">
            trending_up
          </span>
          <p className="text-sm mt-2">IDH</p>
          <p className="text-lg font-semibold">{estadoData.idhm}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="material-symbols-outlined text-purple-500">
            straighten
          </span>
          <p className="text-sm mt-2">Área Total</p>
          <p className="text-lg font-semibold">{estadoData.area_territorial} km²</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="material-symbols-outlined text-orange-500">public</span>
          <p className="text-sm mt-2">Região</p>
          <p className="text-lg font-semibold">Nordeste</p>
        </div>
      </div>
    </div>
  );

  const renderSummaryCards = (): JSX.Element => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
      {/* Cards de resumo específicos para o estado */}
      <div>Resumo estado</div>
    </div>
  );

  const renderCharts = (): JSX.Element => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* Gráficos específicos para o estado */}
      <div>Gráficos estado</div>
    </div>
  );

  return (
    <>
      {renderEstadoInfo()}
      {renderSummaryCards()}
      {renderCharts()}
      <FaqSection faqs={estadoData.faqs} />
    </>
  );
};