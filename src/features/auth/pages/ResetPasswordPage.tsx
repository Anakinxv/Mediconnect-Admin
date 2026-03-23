import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import AuthContentContainer from "../components/AuthContentContainer";
import MCInput from "@/shared/components/forms/MCInput";
import { useAppStore } from "@/stores/useAppStore";
import { useTranslation } from "react-i18next";
import AuthFooterContainer from "../components/AuthFooterContainer";
import { useNavigate } from "react-router-dom";
import { ResetPasswordSchema } from "@/schema/AuthSchema";
import { useEffect } from "react";
import { useState } from "react";
import { ROUTES } from "@/router/routes";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { useResetPassword } from "../hooks/useResetPasssowrd";

function ResetPasswordPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  const resetPassword = useAppStore((state) => state.resetPassword);
  const setResetPassword = useAppStore((state) => state.setResetPassword);
  const forgotPasswordEmail = useAppStore(
    (state) => state.forgotPassword.email,
  );
  const otp = useAppStore((state) => state.otp);

  const setAccessPage = useGlobalUIStore((state) => state.setAccessPage);
  const setToast = useGlobalUIStore((state) => state.setToast);
  const setIsLoading = useGlobalUIStore((state) => state.setIsLoading);

  const { mutateAsync: resetPasswordRequest, isPending: isResetting } =
    useResetPassword();

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  useEffect(() => {
    if (!forgotPasswordEmail || !otp) {
      navigate(ROUTES.FORGOT_PASSWORD, { replace: true });
    }
  }, [forgotPasswordEmail, otp, navigate]);

  const handleSubmit = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    const recoveryToken = sessionStorage.getItem("recoveryToken");

    if (!recoveryToken) {
      setStatusMessage({
        type: "error",
        text: t(
          "resetPassword.missingToken",
          "Token de recuperación no encontrado. Verifica el código nuevamente.",
        ),
      });
      setToast({
        message: t(
          "resetPassword.missingToken",
          "Token de recuperación no encontrado. Verifica el código nuevamente.",
        ),
        type: "error",
        open: true,
      });
      navigate(ROUTES.VERIFY_EMAIL, { replace: true });
      return;
    }

    try {
      setIsLoading(true);

      await resetPasswordRequest({
        token: recoveryToken,
        nuevaPassword: data.password,
        confirmarPassword: data.confirmPassword,
      });

      setResetPassword({
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      sessionStorage.removeItem("recoveryToken");

      setAccessPage(true, [ROUTES.PASSWORD_SUCCESS]);
      setStatusMessage({
        type: "success",
        text: t(
          "resetPassword.success",
          "Contraseña actualizada correctamente.",
        ),
      });
      setToast({
        message: t(
          "resetPassword.success",
          "Contraseña actualizada correctamente.",
        ),
        type: "success",
        open: true,
      });

      navigate(ROUTES.PASSWORD_SUCCESS, { replace: true });
    } catch (error: any) {
      setStatusMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          t("resetPassword.error", "No se pudo actualizar la contraseña."),
      });
      setToast({
        message:
          error?.response?.data?.message ||
          t("resetPassword.error", "No se pudo actualizar la contraseña."),
        type: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContentContainer
      title={t("resetPassword.title")}
      subtitle={t("resetPassword.subtitle")}
    >
      {/* Status visual */}
      {statusMessage.type && (
        <div
          className={`mb-4 text-center ${
            statusMessage.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {statusMessage.text}
        </div>
      )}
      <MCFormWrapper
        schema={ResetPasswordSchema((key) => t(key))}
        onSubmit={(data) => void handleSubmit(data)}
        defaultValues={{
          password: resetPassword.password,
          confirmPassword: resetPassword.confirmPassword,
        }}
        className="flex flex-col items-center w-full"
      >
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <MCInput
            name="password"
            type="password"
            label={t("resetPassword.passwordLabel")}
            placeholder={t("resetPassword.passwordPlaceholder")}
          />
          <MCInput
            name="confirmPassword"
            type="password"
            label={t("resetPassword.confirmPasswordLabel")}
            placeholder={t("resetPassword.confirmPasswordPlaceholder")}
          />
        </div>

        <AuthFooterContainer
          continueButtonProps={{
            children: t("footer.continue"),
            disabled: isResetting,
          }}
          backButtonProps={{
            onClick: () => navigate(ROUTES.VERIFY_EMAIL, { replace: true }),
          }}
        />
      </MCFormWrapper>
    </AuthContentContainer>
  );
}

export default ResetPasswordPage;
