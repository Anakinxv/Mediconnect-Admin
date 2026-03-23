import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import AuthContentContainer from "../components/AuthContentContainer";
import MCOtpInput from "@/shared/components/forms/MCOtpInput";
import { OtpSchema } from "@/schema/AuthSchema";
import { useAppStore } from "@/stores/useAppStore";
import { useTranslation } from "react-i18next";
import AuthFooterContainer from "../components/AuthFooterContainer";
import MCButton from "@/shared/components/forms/MCButton";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ROUTES } from "@/router/routes";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { useVerifyRecoveryCode } from "../hooks/useVerifyEmailPage";
import { useForgotPassword } from "../hooks/useForgotPassword";

function VerifyEmailPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  const confirmedEmail = useAppStore((state) => state.forgotPassword.email);
  const otpData = useAppStore((state) => state.otp);
  const setOtp = useAppStore((state) => state.setOtp);

  const setToast = useGlobalUIStore((state) => state.setToast);
  const setIsLoading = useGlobalUIStore((state) => state.setIsLoading);

  const { mutateAsync: verifyCode, isPending: isVerifying } =
    useVerifyRecoveryCode();
  const { mutateAsync: resendCode, isPending: isResending } =
    useForgotPassword();

  useEffect(() => {
    if (!confirmedEmail) {
      navigate(ROUTES.FORGOT_PASSWORD, { replace: true });
    }
  }, [confirmedEmail, navigate]);

  const handleSubmit = async (data: { otp: string }) => {
    if (!confirmedEmail) {
      setToast({
        message: t("verifyEmail.noEmail", "Primero ingresa tu correo."),
        type: "error",
        open: true,
      });
      navigate(ROUTES.FORGOT_PASSWORD, { replace: true });
      return;
    }

    try {
      setIsLoading(true);

      const response: any = await verifyCode({
        email: confirmedEmail,
        codigo: data.otp.trim(),
      });

      const recoveryToken =
        response?.recoveryToken ??
        response?.token ??
        response?.data?.recoveryToken ??
        response?.data?.token;

      if (!recoveryToken) {
        setToast({
          message: t(
            "verifyEmail.noRecoveryToken",
            "No se recibió token de recuperación.",
          ),
          type: "error",
          open: true,
        });
        return;
      }

      sessionStorage.setItem("recoveryToken", recoveryToken);
      setOtp(data.otp.trim());

      setToast({
        message: t("verifyEmail.validCode", "Código válido, continuando."),
        type: "success",
        open: true,
      });

      navigate(ROUTES.RESET_PASSWORD, { replace: true });
    } catch (error: any) {
      setToast({
        message:
          error?.response?.data?.message ||
          t("verifyEmail.invalidCode", "Código inválido. Inténtalo de nuevo."),
        type: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!confirmedEmail) return;

    try {
      await resendCode({ email: confirmedEmail });
      setToast({
        message: t("verifyEmail.resent", "Código reenviado correctamente."),
        type: "success",
        open: true,
      });
    } catch (error: any) {
      setToast({
        message:
          error?.response?.data?.message ||
          t("verifyEmail.resendError", "No se pudo reenviar el código."),
        type: "error",
        open: true,
      });
    }
  };

  return (
    <AuthContentContainer
      title={t("verifyEmail.title")}
      subtitle={
        <div>
          {t("verifyEmail.subtitle")}
          <br />
          <span className="font-semibold text-primary">{confirmedEmail}</span>
        </div>
      }
    >
      <MCFormWrapper
        schema={OtpSchema((key) => t(key))}
        onSubmit={(data) => void handleSubmit(data)}
        defaultValues={{ otp: otpData }}
        className="flex flex-col items-center w-full"
      >
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <MCOtpInput
            onChange={(value) => {
              setOtp(value);
            }}
          />
          <p className="text-center mt-2 w-full">{otpData}</p>
        </div>

        <div className="w-md max-w-md m-4 flex flex-col items-center gap-4">
          <p className="text-md text-primary/80  mb-2 text-center">
            <span className="font-semibold text-primary">
              {t("verifyEmail.tip").split(":")[0]}:
            </span>{" "}
            {t("verifyEmail.tip").split(":")[1]}
          </p>
          <MCButton
            variant="tercero"
            size="m"
            type="button"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending
              ? t("verifyEmail.resending", "Reenviando...")
              : t("verifyEmail.resend")}
          </MCButton>
        </div>

        <AuthFooterContainer
          backButtonProps={{
            disabled: false,
            onClick: () => navigate(ROUTES.FORGOT_PASSWORD, { replace: true }),
          }}
          continueButtonProps={{
            disabled: isVerifying || isResending,
          }}
        />
      </MCFormWrapper>
    </AuthContentContainer>
  );
}

export default VerifyEmailPage;
