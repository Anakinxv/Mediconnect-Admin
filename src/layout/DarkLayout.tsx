import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

function DarkLayout() {
  const theme = useGlobalUIStore((state) => state.theme);
  const resolvedTheme = useGlobalUIStore((state) => state.resolvedTheme);

  useEffect(() => {
    const appliedTheme = theme === "system" ? resolvedTheme : theme;
    document.documentElement.setAttribute("data-theme", appliedTheme);
  }, [theme, resolvedTheme]);
  return <Outlet />;
}

export default DarkLayout;
