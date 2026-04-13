import React from "react";
import { useTranslation } from "react-i18next";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import MCInput from "@/shared/components/forms/MCInput";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { useProfileStore } from "@/stores/useProfileStore";
import { verifyAccountSchema } from "@/schema/account.schema";
import { useNavigate } from "react-router-dom";
import MCButton from "@/shared/components/forms/MCButton";
import { ArrowRight } from "lucide-react";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useConfirmaPassword } from "@/features/account/hooks/useConfirmaPassword";
import { AxiosError } from "axios";

const CONTEXT_ROUTES: Record<string, string> = {
  CHANGE_EMAIL: "/settings/change-email",
  CHANGE_PASSWORD: "/settings/change-password",
  DELETE_ACCOUNT: "/settings/delete-account",
};

function VerifyIdentityPage() {
  const { t } = useTranslation("common");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const setVerifyAccountPassword = useProfileStore(
    (state) => state.setVerifyAccountPassword,
  );

  const setToast = useGlobalUIStore((state) => state.setToast);

  const verificationContext = useGlobalUIStore(
    (state) => state.verificationContext,
  );
  const setVerificationStatus = useGlobalUIStore(
    (state) => state.setVerificationContextStatus,
  );

  const { mutateAsync: verifyIdentity, isPending } = useConfirmaPassword();

  React.useEffect(() => {
    if (!verificationContext) {
      navigate("/settings");
    }
  }, [verificationContext, navigate]);

  const handleSubmitSuccess = async (values: { password: string }) => {
    try {
      const result = await verifyIdentity({ password: values.password });

      if (!result?.success || !result?.verificado) {
        setToast({
          type: "error",
          message: t(
            "verifyIdentity.invalidCredentials",
            "Credenciales inválidas.",
          ),
          open: true,
        });
        return;
      }

      setToast({
        type: "success",
        message: t(
          "verifyIdentity.successMessage",
          "Información verificada correctamente.",
        ),
        open: true,
      });

      setVerificationStatus("VERIFIED");
      setVerifyAccountPassword(values);

      if (verificationContext && CONTEXT_ROUTES[verificationContext]) {
        navigate(CONTEXT_ROUTES[verificationContext]);
      } else {
        navigate("/settings");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const apiMessage =
        axiosError.response?.data?.message ||
        t("verifyIdentity.invalidCredentials", "Credenciales inválidas.");

      setToast({
        type: "error",
        message: apiMessage,
        open: true,
      });
    }
  };

  return (
    <MCDashboardContent mainWidth={isMobile ? "w-full" : "max-w-2xl"}>
      <div
        className={`flex flex-col gap-6 items-center justify-center w-full mb-8 ${
          isMobile ? "px-4" : "px-0"
        }`}
      >
        <div
          className={`w-full flex flex-col gap-2 justify-center items-center ${
            isMobile ? "min-w-0" : "min-w-xl"
          }`}
        >
          <h1
            className={`font-medium mb-2 text-center ${
              isMobile ? "text-3xl" : "text-5xl"
            }`}
          >
            {t("verifyIdentity.title", "Verify your identity")}
          </h1>
          <p className="text-muted-foreground text-base max-w-md text-center">
            {t(
              "verifyIdentity.description",
              "For security, we need to verify it's you. Enter your current password.",
            )}
          </p>
          <MCFormWrapper
            schema={verifyAccountSchema(t)}
            onSubmit={handleSubmitSuccess}
            defaultValues={{
              password: "",
            }}
            className={`mt-4 flex flex-col items-center gap-4 h-full ${
              isMobile ? "w-full" : "w-md"
            }`}
          >
            <MCInput
              label={t("verifyIdentity.passwordLabel", "Password")}
              type="password"
              name="password"
              placeholder={t(
                "verifyIdentity.passwordPlaceholder",
                "Enter your password",
              )}
              className="w-full"
            />
            <MCButton
              type="submit"
              disabled={isPending}
              className={isMobile ? "w-full" : "w-xs"}
              icon={<ArrowRight size={isMobile ? 20 : 24} />}
              iconPosition="right"
            >
              {isPending
                ? t("verifyIdentity.verifyingButton", "Verifying...")
                : t("verifyIdentity.verifyButton", "Verify")}
            </MCButton>
          </MCFormWrapper>
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default VerifyIdentityPage;
