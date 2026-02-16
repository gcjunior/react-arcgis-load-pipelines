import { loadModules } from "esri-loader";
import { useEffect, useRef, useState } from "react";
import { Button, Row, Col, Container } from "react-bootstrap";
import PipelineModal from "../../components/Modal/PipelineModal";
import Loader from "../../components/Loader";
import { useArcGISMap } from "./useArcGISMap";
import "react-loading-skeleton/dist/skeleton.css";

const ArcGISMap = () => {
  const mapRef = useRef(null);
  const [modalData, setModalData] = useState(null);

  const { data: pipelines, loading, error, progress } = useArcGISMap();

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
          if (geometry.type === "MultiLineString") {
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
                  name: properties.name_en ?? "N/A",
                  status: geometry.type,
                }, // store data for click
              });
              graphicsLayer.add(graphic);
            });
          } else {
            const graphic = new Graphic({
              geometry: {
                type: "polyline",
                paths: [geometry.coordinates],
              },
              symbol: {
                type: "simple-line",
                color: [0, 0, 255],
                width: 3,
                style: "solid",
              },
              attributes: {
                name: properties.name_en ?? "N/A",
                status: geometry.type,
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
                status: graphic.attributes.status,
              });
            }
          });
        });
      })
      .catch((err) => console.error(err));
  }, [pipelines]);

  // ✅ FULL PAGE LOADER
  if (loading) return <Loader progress={progress} loading={loading} />;

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <Container fluid className="px-0">
      <Row>
        <Col>
          <Button type="button">Filter</Button>
          <Button type="button">Login</Button>
          <Button type="button">New Pipeline</Button>
        </Col>
      </Row>
      <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
      {/* Modal */}
      {modalData && (
        <PipelineModal
          hideModal={() => setModalData(null)}
          record={modalData}
        />
      )}
    </Container>
  );
};

export default ArcGISMap;
