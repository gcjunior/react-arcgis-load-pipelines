import { loadModules } from "esri-loader";
import { useEffect, useRef, useState } from "react";
import PipelineModal from "../../components/Modal/PipelineModal";
import { useArcGISMap } from "./useArcGISMap";

const ArcGISMap = () => {
  const mapRef = useRef(null);
  const [modalData, setModalData] = useState(null);

  const { data: pipelines, loading, error } = useArcGISMap();

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
          center: [-114.0719, 51.0447],
          zoom: 8,
        });

        // Create a graphics layer
        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

        pipelines?.features?.forEach((features) => {
          const { properties, geometry } = features;
          if (geometry.type === 'MultiLineString') {
            geometry.coordinates.forEach((coordinates) => {
              const graphic = new Graphic({
                geometry: {
                  type: "polyline",
                  paths: [coordinates],
                },
                symbol: {
                  type: "simple-line",
                  color: [0, 0, 255],
                  width: 3,
                  style: "solid",
                },
                attributes: {
                  name: properties.name_en ?? 'N/A',
                  status: geometry.type
                }, // store data for click
              });
              graphicsLayer.add(graphic);
            });
          } else {
            const graphic = new Graphic({
              geometry: {
                type: 'polyline',
                paths:[geometry.coordinates]
              },
              symbol: {
                type: "simple-line",
                color: [0, 0, 255],
                width: 3,
                style: "solid",
              },
              attributes: {
                name: properties.name_en ?? 'N/A',
                status: geometry.type
              }, // store data for click
            });
            graphicsLayer.add(graphic);
          }
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
                status: graphic.attributes.status
              });
            }
          });
        });
      })
      .catch((err) => console.error(err));
  }, [pipelines]);

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
