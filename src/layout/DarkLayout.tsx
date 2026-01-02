import { useAppStore } from "@/stores/useAppStore";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

function DarkLayout() {
  const theme = useAppStore((state) => state.theme);
  const resolvedTheme = useAppStore((state) => state.resolvedTheme);

  useEffect(() => {
    const appliedTheme = theme === "system" ? resolvedTheme : theme;
    document.documentElement.setAttribute("data-theme", appliedTheme);
  }, [theme, resolvedTheme]);
  return <Outlet />;
}

export default DarkLayout;
