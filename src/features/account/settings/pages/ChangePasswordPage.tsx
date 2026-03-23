import { useEffect } from "react";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import MCInput from "@/shared/components/forms/MCInput";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { useProfileStore } from "@/stores/useProfileStore";
import { useNavigate } from "react-router-dom";
import MCButton from "@/shared/components/forms/MCButton";
import { ArrowRight } from "lucide-react";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { changePasswordSchema } from "@/schema/account.schema";
import { useTranslation } from "react-i18next";
import { useChangePassword } from "@/features/account/hooks/useChangePassword";
import { AxiosError } from "axios";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
function ChangePasswordPage() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const changePasswordData = useProfileStore(
    (state) => state.changePasswordData,
  );
  const setChangePasswordData = useProfileStore(
    (state) => state.setChangePasswordData,
  );
  const verifyAccountPassword = useProfileStore(
    (state) => state.verifyAccountPassword,
  );

  const verificationContext = useGlobalUIStore(
    (state) => state.verificationContext,
  );
  const verificationContextStatus = useGlobalUIStore(
    (state) => state.verificationContextStatus,
  );
  const setToast = useGlobalUIStore((state) => state.setToast);

  const { mutateAsync: changePassword, isPending } = useChangePassword();

  useEffect(() => {
    if (
      verificationContext !== "CHANGE_PASSWORD" ||
      verificationContextStatus !== "VERIFIED"
    ) {
      navigate("/settings");
      return;
    }

    if (!verifyAccountPassword?.password) {
      navigate("/settings/verify-identity");
    }
  }, [
    verificationContext,
    verificationContextStatus,
    verifyAccountPassword,
    navigate,
  ]);

  const passwordSchema = changePasswordSchema(t);

  const handleSubmit = async (data: {
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    try {
      const result = await changePassword({
        passwordActual: verifyAccountPassword?.password ?? "",
        nuevaPassword: data.newPassword,
        confirmarPassword: data.confirmNewPassword,
      });

      if (!result?.success) {
        setToast({
          type: "error",
          message:
            result?.message ||
            t("changePassword.error", "No se pudo cambiar la contraseña."),
          open: true,
        });
        return;
      }

      setChangePasswordData({
        ...changePasswordData,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });

      setToast({
        type: "success",
        message:
          result.message ||
          t("changePassword.success", "Contraseña actualizada correctamente."),
        open: true,
      });

      navigate("/settings");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setToast({
        type: "error",
        message:
          axiosError.response?.data?.message ||
          t("changePassword.error", "No se pudo cambiar la contraseña."),
        open: true,
      });
    }
  };

  return (
    <MCDashboardContent mainWidth={isMobile ? "w-full" : "max-w-2xl"}>
      <div className="flex flex-col gap-6 items-center justify-center w-full mb-8 px-4">
        <div className="w-full flex flex-col gap-2 justify-center items-center">
          <h1 className="text-3xl md:text-5xl font-medium mb-2 text-center">
            {t("changePassword.title")}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md text-center">
            {t("changePassword.description")}
          </p>
          <MCFormWrapper
            schema={passwordSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              newPassword: changePasswordData?.newPassword || "",
              confirmNewPassword: changePasswordData?.confirmNewPassword || "",
            }}
            className="w-full max-w-md mt-4 flex flex-col items-center gap-4 h-full"
          >
            <MCInput
              label={t("changePassword.newPasswordLabel")}
              name="newPassword"
              type="password"
              placeholder={t("changePassword.newPasswordPlaceholder")}
              className="w-full"
            />

            <MCInput
              label={t("changePassword.confirmNewPasswordLabel")}
              name="confirmNewPassword"
              type="password"
              placeholder={t(
                "changePassword.confirmNewPasswordPlaceholder",
                "Confirm new password",
              )}
              className="w-full"
            />

            <MCButton
              type="submit"
              disabled={isPending}
              className="w-full md:w-xs"
              icon={<ArrowRight />}
              iconPosition="right"
            >
              {isPending
                ? t("changePassword.changingButton", "Cambiando...")
                : t("changePassword.changeButton")}
            </MCButton>
          </MCFormWrapper>
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default ChangePasswordPage;
