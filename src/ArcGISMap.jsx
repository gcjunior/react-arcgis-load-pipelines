import { loadModules } from "esri-loader";
import { useEffect, useRef } from "react";

const ArcGISMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
      ],
      { css: true },
    )
      .then(([ArcGISMap, MapView, Graphic, GraphicsLayer]) => {
        // Create map
        const map = new ArcGISMap({
          basemap: "topo-vector", // Options: 'topo-vector', 'streets', 'satellite'
        });

        // Create view
        new MapView({
          container: mapRef.current,
          map: map,
          center: [-118.805, 34.027],
          zoom: 13,
        });

        // Create a graphics layer
        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

        // Example pipeline line (polyline) coordinates
        const pipelineLine = {
          type: "polyline", // autocasts as new Polyline()
          paths: [
            [-118.805, 34.027],
            [-118.81, 34.03],
            [-118.815, 34.025],
          ],
        };

        // Line symbol
        const lineSymbol = {
          type: "simple-line", // autocasts as new SimpleLineSymbol()
          color: [255, 0, 0], // red
          width: 4,
          style: "solid",
        };

        // Create the graphic
        const pipelineGraphic = new Graphic({
          geometry: pipelineLine,
          symbol: lineSymbol,
        });

        // Add to the graphics layer
        graphicsLayer.add(pipelineGraphic);

        // Optional: add another pipeline
        const pipeline2 = new Graphic({
          geometry: {
            type: "polyline",
            paths: [
              [-118.805, 34.027],
              [-118.8, 34.035],
            ],
          },
          symbol: {
            type: "simple-line",
            color: [0, 0, 255], // blue
            width: 3,
            style: "dash",
          },
        });
        graphicsLayer.add(pipeline2);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />
    </div>
  );
};

export default ArcGISMap;
