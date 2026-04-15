import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css";
import App from "./App.tsx";
import "@/i18n/config";
import MCToast from "./shared/components/MCToast.tsx";
import { QueryProvider } from "@/config/QueryProvider";
import MCLoadingSpinner from "@/shared/components/MCLoadingSpinner.tsx";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <MCLoadingSpinner />
      <App />
      <MCToast />
      <Analytics />
    </QueryProvider>
  </StrictMode>,
);
