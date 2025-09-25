import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import paraibaGeoJson from '../../../../assets/data/PB.json';

interface IdebDataMap {
  [ano: string]: {
    [municipio: string]: number;
  };
}

interface ParaibaMapChartProps {
  idebData: IdebDataMap;
  selectedYear: string;
}

// Define color scale for IDEB
const getColor = (ideb: number | undefined): string => {
  if (ideb === undefined || isNaN(ideb)) return '#cccccc';
  if (ideb >= 7.5) return '#084594';
  if (ideb >= 6.5) return '#2171b5';
  if (ideb >= 5.5) return '#4292c6';
  if (ideb >= 4.5) return '#6baed6';
  if (ideb >= 3.5) return '#9ecae1';
  if (ideb >= 2.5) return '#c6dbef';
  return '#eff3ff';
};

const legendGrades = [0, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5];
const legendLabels: string[] = [];
for (let i = 0; i < legendGrades.length; i++) {
  const from = legendGrades[i];
  const to = legendGrades[i + 1];
  legendLabels.push(
    `<i style="background:${getColor(from + 0.1)}"></i> ${from.toFixed(1)}${to ? '&ndash;' + to.toFixed(1) : '+'}`
  );
}
legendLabels.push(`<i style="background:#cccccc"></i> N/A`);

export const ParaibaMapChart: React.FC<ParaibaMapChartProps> = ({ idebData, selectedYear }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const legendControlRef = useRef<L.Control | null>(null);

  const styleFeature = useCallback((feature: any) => {
    const municipioNome = feature?.properties?.NOME;
    const idebValue = idebData[selectedYear]?.[municipioNome];
    return {
      fillColor: getColor(idebValue),
      weight: 1,
      opacity: 1,
      color: '#666',
      fillOpacity: 0.7,
    };
  }, [idebData, selectedYear]);

  const onEachFeature = useCallback((feature: any, layer: L.Layer) => {
    const municipioNome = feature?.properties?.NOME;
    const idebValue = idebData[selectedYear]?.[municipioNome];
    const displayIdeb = typeof idebValue === 'number' && !isNaN(idebValue) ? idebValue.toFixed(2) : 'Não disponível';
    layer.bindPopup(`<strong>Município:</strong> ${municipioNome || 'Desconhecido'}<br><strong>IDEB (${selectedYear}):</strong> ${displayIdeb}`);

     layer.on({
         mouseover: (e) => {
             const targetLayer = e.target;
             targetLayer.setStyle({
                 weight: 3,
                 color: '#333',
                 fillOpacity: 0.9
             });
             if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                 targetLayer.bringToFront();
             }
         },
         mouseout: (e) => {
             geoJsonLayerRef.current?.resetStyle(e.target);
         }
     });

  }, [idebData, selectedYear]);

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([-7.2666, -36.5833], 7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);
      mapInstanceRef.current = map;

      const legend = new L.Control({ position: 'bottomright' });
      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend'); // Use 'info legend' classes
         div.innerHTML =
             '<h4>IDEB</h4>' + legendLabels.join('<br>');
         return div;
      };
      legend.addTo(map);
      legendControlRef.current = legend;
    }

    return () => {
       if (mapInstanceRef.current) {
         mapInstanceRef.current.remove();
         mapInstanceRef.current = null;
       }
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !paraibaGeoJson) return;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
    }

    geoJsonLayerRef.current = L.geoJSON(paraibaGeoJson as any, {
      style: styleFeature,
      onEachFeature: onEachFeature,
    }).addTo(map);

    const bounds = geoJsonLayerRef.current.getBounds();
    if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [10, 10] }); 
    } else {
        console.warn("GeoJSON bounds invalid initially, retrying fitBounds.");
        setTimeout(() => {
            if (geoJsonLayerRef.current) {
                const retryBounds = geoJsonLayerRef.current.getBounds();
                if (retryBounds.isValid()) {
                    map.fitBounds(retryBounds, { padding: [10, 10] });
                } else {
                     console.error("Failed to fit map bounds after retry.");
                     map.setView([-7.2666, -36.5833], 7);
                }
            }
        }, 500);
    }

  }, [idebData, selectedYear, styleFeature, onEachFeature]);

  return (
      <div ref={mapContainerRef} style={{ height: '500px', width: '100%' }}>
          <style>{`
              .info.legend {
                  padding: 6px 8px;
                  font: 12px/14px Arial, Helvetica, sans-serif;
                  background: white;
                  background: rgba(255,255,255,0.8);
                  box-shadow: 0 0 15px rgba(0,0,0,0.2);
                  border-radius: 5px;
                  line-height: 18px;
                  color: #555;
              }
              .info.legend h4 {
                  margin: 0 0 5px;
                  color: #333;
                  font-weight: bold;
              }
              .info.legend i {
                  width: 18px;
                  height: 18px;
                  float: left;
                  margin-right: 8px;
                  opacity: 0.7;
                  border: 1px solid #ccc; /* Add subtle border */
              }
          `}</style>
      </div>
  );
};