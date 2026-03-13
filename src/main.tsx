import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css";
import App from "./App.tsx";
import "@/i18n/config";
// import MCToast from "@/shared/components/MCToast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    {/* <MCToast /> */}
  </StrictMode>,
);
