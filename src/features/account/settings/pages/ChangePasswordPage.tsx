import { useEffect } from "react";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import MCInput from "@/shared/components/forms/MCInput";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { useProfileStore } from "@/stores/useProfileStore";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/useAppStore";
import MCButton from "@/shared/components/forms/MCButton";
import { ArrowRight } from "lucide-react";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { changePasswordSchema } from "@/schema/account.schema";
import { useTranslation } from "react-i18next";

function ChangePasswordPage() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  const changePasswordData = useProfileStore(
    (state) => state.changePasswordData,
  );
  const setChangePasswordData = useProfileStore(
    (state) => state.setChangePasswordData,
  );

  const VerificationContext = useGlobalUIStore(
    (state) => state.verificationContext,
  );
  const VerificationContextStatus = useGlobalUIStore(
    (state) => state.verificationContextStatus,
  );

  // Redirige si no está en el contexto correcto o no tiene datos pendientes
  useEffect(() => {
    if (
      VerificationContext !== "CHANGE_PASSWORD" ||
      VerificationContextStatus !== "VERIFIED"
    ) {
      navigate("/settings");
    }
  }, [VerificationContext, VerificationContextStatus, navigate]);

  // Usa t para el schema
  const passwordSchema = changePasswordSchema(t);

  const handleSubmit = (data: {
    confirmNewPassword: string;
    newPassword: string;
  }) => {
    setChangePasswordData({
      ...changePasswordData,
      confirmNewPassword: data.confirmNewPassword,
      newPassword: data.newPassword,
    });
    // Aquí deberías llamar a tu API para cambiar la contraseña
    navigate("/settings");
  };

  return (
    <MCDashboardContent mainWidth="max-w-2xl">
      <div className="flex flex-col gap-6 items-center justify-center w-full mb-8">
        <div className="w-full min-w-xl flex flex-col gap-2 justify-center items-center">
          <h1 className="text-5xl font-medium mb-2">
            {t("changePassword.title")}
          </h1>
          <p className="text-muted-foreground text-base max-w-md text-center">
            {t("changePassword.description")}
          </p>
          <MCFormWrapper
            schema={passwordSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              newPassword: changePasswordData?.newPassword || "",
              confirmNewPassword: changePasswordData?.confirmNewPassword || "",
            }}
            className="w-md mt-4 flex flex-col items-center gap-4 h-full"
          >
            <MCInput
              label={t("changePassword.currentPasswordLabel")}
              name="newPassword"
              type="password"
              placeholder={t("changePassword.currentPasswordPlaceholder")}
              className="w-full"
            />
            <MCInput
              label={t("changePassword.newPasswordLabel")}
              name="confirmNewPassword"
              type="password"
              placeholder={t("changePassword.newPasswordPlaceholder")}
              className="w-full"
            />
            <MCButton
              type="submit"
              className="w-xs"
              icon={<ArrowRight />}
              iconPosition="right"
            >
              {t("changePassword.changeButton")}
            </MCButton>
          </MCFormWrapper>
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default ChangePasswordPage;
