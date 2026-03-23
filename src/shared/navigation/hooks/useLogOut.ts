import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/router/routes";
import { useAppStore } from "@/stores/useAppStore";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

export const useLogOut = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("dashboard");

  const clearAuth = useAppStore((state) => state.clearAuth);
  const setToast = useGlobalUIStore((state) => state.setToast);

  const logout = () => {
    clearAuth();
    sessionStorage.removeItem("recoveryToken");

    setToast({
      message: t("userMenu.logoutSuccess", "Session closed successfully."),
      type: "success",
      open: true,
    });

    navigate(ROUTES.LOGIN, { replace: true });
  };

  return { logout };
};
