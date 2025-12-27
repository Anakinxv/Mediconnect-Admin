import { useEffect } from "react";
import AppRouter from "./router/AppRouter";

function App() {
  useEffect(() => {
    // Initialize Blendy
    const script = document.createElement("script");
    script.src = "https://unpkg.com/blendy/dist/blendy.min.js";
    script.async = true;
    script.onload = () => {
      if (typeof window !== "undefined" && (window as any).Blendy) {
        (window as any).blendy = (window as any).Blendy.createBlendy({
          animation: "spring",
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <AppRouter />;
}

export default App;
