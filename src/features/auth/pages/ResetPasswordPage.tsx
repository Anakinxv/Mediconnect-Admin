import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import AuthContentContainer from "../components/AuthContentContainer";
import MCInput from "@/shared/components/forms/MCInput";
import { useAppStore } from "@/stores/useAppStore";
import { useTranslation } from "react-i18next";
import AuthFooterContainer from "../components/AuthFooterContainer";
import { useNavigate } from "react-router-dom";
import { ResetPasswordSchema } from "@/schema/AuthSchema";

function ResetPasswordPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const resetPassword = useAppStore((state) => state.resetPassword);
  const setResetPassword = useAppStore((state) => state.setResetPassword);

  const handleSubmit = (data: {
    password: string;
    confirmPassword: string;
  }) => {
    if (data.password && data.confirmPassword) {
      setResetPassword({
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      navigate("/auth/password-success", { replace: true });
    } else {
      alert(t("resetPassword.errorFields"));
    }
  };

  return (
    <AuthContentContainer
      title={t("resetPassword.title", "Establece tu nueva contraseña")}
      subtitle={t(
        "resetPassword.subtitle",
        "Ingresa y confirma una contraseña segura para mantener tu cuenta protegida."
      )}
    >
      <MCFormWrapper
        schema={ResetPasswordSchema((key) => t(key))}
        onSubmit={(data) => handleSubmit(data)}
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
            label={t("resetPassword.passwordLabel", "Contraseña")}
            placeholder={t("resetPassword.passwordPlaceholder", "Contraseña")}
          />
          <MCInput
            name="confirmPassword"
            type="password"
            label={t(
              "resetPassword.confirmPasswordLabel",
              "Confirmar Contraseña"
            )}
            placeholder={t(
              "resetPassword.confirmPasswordPlaceholder",
              "Confirmar Contraseña"
            )}
          />
        </div>
        <AuthFooterContainer
          continueButtonProps={{
            children: t("footer.continue", "Continuar"),
          }}
        />
      </MCFormWrapper>
    </AuthContentContainer>
  );
}

export default ResetPasswordPage;
