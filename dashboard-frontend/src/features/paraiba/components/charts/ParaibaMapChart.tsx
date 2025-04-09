import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// Import the GeoJSON data directly
import paraibaGeoJson from '../../../../assets/data/PB.json'; // Adjusted path

// Define the structure for IDEB data passed to the map
interface IdebDataMap {
  [ano: string]: {
    [municipio: string]: number; // municipio key must match GeoJSON property NOME
  };
}

interface ParaibaMapChartProps {
  idebData: IdebDataMap; // Use the defined interface
  selectedYear: string;
}

// Define color scale for IDEB
const getColor = (ideb: number | undefined): string => {
  if (ideb === undefined || isNaN(ideb)) return '#cccccc'; // Grey for missing/invalid data
  if (ideb >= 7.5) return '#084594'; // Dark Blue
  if (ideb >= 6.5) return '#2171b5';
  if (ideb >= 5.5) return '#4292c6';
  if (ideb >= 4.5) return '#6baed6';
  if (ideb >= 3.5) return '#9ecae1';
  if (ideb >= 2.5) return '#c6dbef';
  return '#eff3ff'; // Lightest Blue / Almost White
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
legendLabels.push(`<i style="background:#cccccc"></i> N/A`); // Add N/A to legend

export const ParaibaMapChart: React.FC<ParaibaMapChartProps> = ({ idebData, selectedYear }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null); // Ref for the container div
  const mapInstanceRef = useRef<L.Map | null>(null); // Ref for the Leaflet map instance
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null); // Ref for the GeoJSON layer
  const legendControlRef = useRef<L.Control | null>(null); // Ref for the legend control

  // Function to style features based on IDEB
  const styleFeature = useCallback((feature: any) => {
    const municipioNome = feature?.properties?.NOME;
    const idebValue = idebData[selectedYear]?.[municipioNome]; // Access data safely
    return {
      fillColor: getColor(idebValue),
      weight: 1,
      opacity: 1,
      color: '#666', // Slightly darker border for better visibility
      fillOpacity: 0.7,
    };
  }, [idebData, selectedYear]); // Depend on data and selected year

  // Function for popup content
  const onEachFeature = useCallback((feature: any, layer: L.Layer) => {
    const municipioNome = feature?.properties?.NOME;
    const idebValue = idebData[selectedYear]?.[municipioNome];
    const displayIdeb = typeof idebValue === 'number' && !isNaN(idebValue) ? idebValue.toFixed(2) : 'Não disponível';
    layer.bindPopup(`<strong>Município:</strong> ${municipioNome || 'Desconhecido'}<br><strong>IDEB (${selectedYear}):</strong> ${displayIdeb}`);

     // Add hover effect
     layer.on({
         mouseover: (e) => {
             const targetLayer = e.target;
             targetLayer.setStyle({
                 weight: 3,
                 color: '#333', // Darker border on hover
                 fillOpacity: 0.9
             });
             if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                 targetLayer.bringToFront();
             }
         },
         mouseout: (e) => {
             geoJsonLayerRef.current?.resetStyle(e.target); // Reset style using the ref
         }
     });

  }, [idebData, selectedYear]); // Depend on data and selected year

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([-7.2666, -36.5833], 7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);
      mapInstanceRef.current = map;

      // Add Legend Control
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

    // Cleanup map instance on component unmount
    return () => {
       if (mapInstanceRef.current) {
         mapInstanceRef.current.remove();
         mapInstanceRef.current = null;
       }
    };
  }, []); // Empty dependency array ensures this runs only once

  // Update GeoJSON layer when data or year changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !paraibaGeoJson) return;

    // Remove previous GeoJSON layer if it exists
    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
    }

    // Add new GeoJSON layer with updated style and popups
    geoJsonLayerRef.current = L.geoJSON(paraibaGeoJson as any, { // Cast needed as L.GeoJSON expects specific GeoJSON types
      style: styleFeature,
      onEachFeature: onEachFeature,
    }).addTo(map);

    // Adjust map bounds (with a slight delay if needed)
    const bounds = geoJsonLayerRef.current.getBounds();
    if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [10, 10] }); // Add slight padding
    } else {
        // Fallback or retry logic if bounds are invalid initially
        console.warn("GeoJSON bounds invalid initially, retrying fitBounds.");
        setTimeout(() => {
            if (geoJsonLayerRef.current) {
                const retryBounds = geoJsonLayerRef.current.getBounds();
                if (retryBounds.isValid()) {
                    map.fitBounds(retryBounds, { padding: [10, 10] });
                } else {
                     console.error("Failed to fit map bounds after retry.");
                     map.setView([-7.2666, -36.5833], 7); // Reset to default view
                }
            }
        }, 500);
    }

  }, [idebData, selectedYear, styleFeature, onEachFeature]); // Re-run when these change

  return (
     // Use the ref on the container div
      <div ref={mapContainerRef} style={{ height: '500px', width: '100%' }}>
          {/* Add CSS for the legend */}
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