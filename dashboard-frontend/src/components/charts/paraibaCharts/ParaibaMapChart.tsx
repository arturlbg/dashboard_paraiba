import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import paraibaGeoJson from '../../../data/PB.json';

interface IdebData {
  [ano: string]: {
    [municipio: string]: number;
  };
}

interface ParaibaMapChartProps {
  idebData: IdebData;
  selectedYear: string;
}

export const ParaibaMapChart: React.FC<ParaibaMapChartProps> = ({ idebData, selectedYear }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('paraiba-map').setView([-7.2666, -36.5833], 7);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    const getColor = (ideb: number | undefined): string => {
      if (ideb === undefined) {
        return '#ccc';
      }
      if (ideb >= 8) return '#7a0177';
      if (ideb >= 7) return '#ae017e';
      if (ideb >= 6) return '#dd3497';
      if (ideb >= 5) return '#f768a1';
      if (ideb >= 4) return '#fa9fb5';
      return '#fde0dd';
    };

    const style = (feature: any) => {
      const municipioNome = feature.properties.NOME;
      // Acesse os dados do IDEB para o ano selecionado primeiro
      const idebDataForYear = idebData[selectedYear];
      // Verifique se os dados para o ano existem e, em seguida, obtenha o valor do IDEB
      const idebValue = idebDataForYear? idebDataForYear[municipioNome] : undefined;
      return {
        fillColor: getColor(idebValue),
        weight: 1,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.7,
      };
    };

    const onEachFeature = (feature: any, layer: L.Layer) => {
      const municipioNome = feature.properties.NOME;
      // Acesse os dados do IDEB para o ano selecionado primeiro
      const idebDataForYear = idebData[selectedYear];
      // Verifique se os dados para o ano existem e, em seguida, obtenha o valor do IDEB
      const idebValue = idebDataForYear? idebDataForYear[municipioNome] : undefined;
      layer.bindPopup(`Município: ${municipioNome}<br>IDEB (${selectedYear}): ${idebValue!== undefined? idebValue : 'Não disponível'}`);
    };

    map.eachLayer((layer) => {
      if (layer instanceof L.GeoJSON) {
        map.removeLayer(layer);
      }
    });

    L.geoJSON(paraibaGeoJson, { style: style, onEachFeature: onEachFeature }).addTo(map);

    if (paraibaGeoJson && map.getBounds().isValid()) {
      map.fitBounds(L.geoJSON(paraibaGeoJson).getBounds());
    } else if (paraibaGeoJson &&!map.getBounds().isValid()) {
      setTimeout(() => {
        map.fitBounds(L.geoJSON(paraibaGeoJson).getBounds());
      }, 500);
    }

  }, [idebData, selectedYear]);

  return <div id="paraiba-map" style={{ height: '500px', width: '100%' }} />;
};