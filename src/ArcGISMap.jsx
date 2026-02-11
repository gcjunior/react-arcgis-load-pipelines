import { loadModules } from "esri-loader";
import { useEffect, useRef, useState } from "react";
import PipelineModal from './components/PipelineModal'

const ArcGISMap = () => {
  const mapRef = useRef(null);

  // Modal state
  const [modalData, setModalData] = useState(null);

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
        const view = new MapView({
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

        // Pipeline data
        const pipelines = [
          {
            id: 1,
            name: "Main Pipeline",
            status: "Active",
            geometry: {
              type: "polyline",
              paths: [
                [-118.805, 34.027],
                [-118.81, 34.03],
                [-118.815, 34.025],
              ],
            },
            symbol: {
              type: "simple-line",
              color: [255, 0, 0],
              width: 4,
              style: "solid",
            },
          },
          {
            id: 2,
            name: "Secondary Pipeline",
            status: "Maintenance",
            geometry: {
              type: "polyline",
              paths: [
                [-118.805, 34.027],
                [-118.8, 34.035],
              ],
            },
            symbol: {
              type: "simple-line",
              color: [0, 0, 255],
              width: 3,
              style: "dash",
            },
          },
        ];

        // Add pipelines to graphics layer
        pipelines.forEach((pipeline) => {
          const graphic = new Graphic({
            geometry: pipeline.geometry,
            symbol: pipeline.symbol,
            attributes: pipeline, // store data for click
          });
          graphicsLayer.add(graphic);
        });

        // Handle click events
        view.on("click", (event) => {
          view.hitTest(event).then((response) => {
            const graphic = response.results.find(
              (result) => result.graphic.layer === graphicsLayer,
            )?.graphic;

            if (graphic) {
              // Open modal with pipeline info
              setModalData({
                name: graphic.attributes.name,
                status: graphic.attributes.status,
                id: graphic.attributes.id,
              });
            }
          });
        });
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />
      {/* Modal */}
      {modalData && (
        <PipelineModal
          hideModal={() => setModalData(null)}
          record={modalData}
        />
      )}
    </div>
  );
};

export default ArcGISMap;
