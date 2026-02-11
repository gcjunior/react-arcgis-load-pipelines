import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

const ArcGISMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Load required ArcGIS modules
    loadModules([
      'esri/Map',
      'esri/views/MapView'
    ], { css: true })
      .then(([ArcGISMap, MapView]) => {
        // Create a new map
        const map = new ArcGISMap({
          basemap: 'topo-vector' // Options: 'topo-vector', 'streets', 'satellite'
        });

        // Create a view
        new MapView({
          container: mapRef.current,
          map: map,
          center: [-118.805, 34.027], // Longitude, latitude
          zoom: 13
        });
      })
      .catch(err => console.error('ArcGIS: ', err));
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default ArcGISMap
