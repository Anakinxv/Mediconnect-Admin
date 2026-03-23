import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import MCButton from "@/shared/components/forms/MCButton";

import { ROUTES } from "@/router/routes";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { useAppStore } from "@/stores/useAppStore";
import { useLogin } from "../hooks/useLogin";

const SuccessImg =
  "https://res.cloudinary.com/dy2wtanhl/image/upload/v1771694169/successPassword_gcxlbt.png";

function PasswordSuccessPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const canAccessPage = useGlobalUIStore((state) => state.canAccessPage);
  const allowedPages = useGlobalUIStore((state) => state.allowedPages);
  const setToast = useGlobalUIStore((state) => state.setToast);
  const setIsLoading = useGlobalUIStore((state) => state.setIsLoading);

  const forgotPasswordEmail = useAppStore(
    (state) => state.forgotPassword.email,
  );
  const resetPassword = useAppStore((state) => state.resetPassword);
  const clearAuth = useAppStore((state) => state.clearAuth);

  const { mutateAsync: login, isPending: isLoggingIn } = useLogin();

  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const hasValidAccess =
      canAccessPage && allowedPages.includes(ROUTES.PASSWORD_SUCCESS);

    if (!hasValidAccess) {
      navigate(ROUTES.FORGOT_PASSWORD, { replace: true });
    } else {
      setHasAccess(true);
    }
  }, [canAccessPage, allowedPages, navigate]);

  const handleclick = async () => {
    if (!forgotPasswordEmail || !resetPassword.password) {
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    try {
      setIsLoading(true);

      const response = await login({
        email: forgotPasswordEmail,
        password: resetPassword.password,
      });

      if (response.usuario.rol !== "Administrador") {
        clearAuth();
        setToast({
          message: t("login.unauthorized", "No tienes permisos para acceder"),
          type: "error",
          open: true,
        });
        navigate(ROUTES.LOGIN, { replace: true });
        return;
      }

      setToast({
        message: t("login.success", "Inicio de sesión exitoso"),
        type: "success",
        open: true,
      });

      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch {
      setToast({
        message: t("login.error", "Credenciales incorrectas"),
        type: "error",
        open: true,
      });
      navigate(ROUTES.LOGIN, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasAccess) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <img
        src={SuccessImg}
        alt={t("passwordSuccess.imgAlt")}
        className="w-90 h-90 mb-8 pointer-events-none"
      />
      <h2 className="text-3xl font-semibold mb-4">
        {t("passwordSuccess.title")}
      </h2>
      <MCButton className="mt-6" onClick={handleclick} disabled={isLoggingIn}>
        {isLoggingIn
          ? t("login.loading", "Cargando...")
          : t("passwordSuccess.continue")}
      </MCButton>
    </div>
  );
}

export default PasswordSuccessPage;
