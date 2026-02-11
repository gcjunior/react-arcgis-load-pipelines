import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ArcGISMap from "./ArcGISMap";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ArcGISMap />
  </StrictMode>,
);
