import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ArcGISMap from "./pages/ArcGISMap/ArcGISMap";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ArcGISMap />
  </StrictMode>,
);
