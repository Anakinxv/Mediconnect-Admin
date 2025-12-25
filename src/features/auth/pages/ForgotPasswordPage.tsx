import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import AuthContentContainer from "../components/AuthContentContainer";
import MCInput from "@/shared/components/forms/MCInput";
import { ForgotPasswordSchema } from "@/schema/AuthSchema";
import { useAppStore } from "@/stores/useAppStore";
import { useTranslation } from "react-i18next";
import AuthFooterContainer from "../components/AuthFooterContainer";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  const forgotPasswordData = useAppStore((state) => state.forgotPassword);
  const setForgotPassword = useAppStore((state) => state.setForgotPassword);

  return (
    <div className="h-full flex justify-center items-center">
      <AuthContentContainer
        title={t("forgotPassword.title")}
        subtitle={t("forgotPassword.subtitle")}
      >
        <MCFormWrapper
          schema={ForgotPasswordSchema((key) => t(key))}
          onSubmit={(data) => {
            setForgotPassword({ email: data.email });
            navigate("/auth/verify-email", { replace: true });
          }}
          defaultValues={forgotPasswordData}
          className="flex flex-col items-center w-full"
        >
          <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <MCInput
              name="email"
              type="email"
              label={t("forgotPassword.emailLabel")}
              placeholder={t("forgotPassword.emailPlaceholder")}
            />
            <p className="text-center mt-2 w-full">
              {forgotPasswordData.email}
            </p>
          </div>
          <AuthFooterContainer
            backButtonProps={{
              disabled: true,
            }}
          />
        </MCFormWrapper>
      </AuthContentContainer>
    </div>
  );
}

export default ForgotPasswordPage;
