import { useEffect } from "react";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import MCInput from "@/shared/components/forms/MCInput";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { useProfileStore } from "@/stores/useProfileStore";
import { useNavigate } from "react-router-dom";
import MCButton from "@/shared/components/forms/MCButton";
import { ArrowRight } from "lucide-react";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { changeEmailSchema } from "@/schema/account.schema";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import { useChangeEmail } from "@/features/account/hooks/useChangeEmail";
import { AxiosError } from "axios";

function ChangeEmailPage() {
  const { t } = useTranslation("common");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const verificationContext = useGlobalUIStore(
    (state) => state.verificationContext,
  );
  const verificationContextStatus = useGlobalUIStore(
    (state) => state.verificationContextStatus,
  );
  const setToast = useGlobalUIStore((state) => state.setToast);

  const changeEmailData = useProfileStore((state) => state.changeEmailData);
  const setChangeEmailData = useProfileStore(
    (state) => state.setChangeEmailData,
  );
  const verifyAccountPassword = useProfileStore(
    (state) => state.verifyAccountPassword,
  );

  const { mutateAsync: changeEmail, isPending } = useChangeEmail();

  useEffect(() => {
    if (
      verificationContext !== "CHANGE_EMAIL" ||
      verificationContextStatus !== "VERIFIED"
    ) {
      navigate("/settings");
    }
  }, [verificationContext, verificationContextStatus, navigate]);

  const newEmailSchema = changeEmailSchema(t).pick({ newEmail: true });

  const handleSubmit = async (data: { newEmail: string }) => {
    if (!verifyAccountPassword?.password) {
      setToast({
        type: "error",
        message: t(
          "changeEmail.passwordRequired",
          "Debes verificar tu identidad nuevamente.",
        ),
        open: true,
      });
      navigate("/settings/verify-identity");
      return;
    }

    try {
      const result = await changeEmail({
        nuevoEmail: data.newEmail,
        password: verifyAccountPassword.password,
      });

      if (!result?.success) {
        setToast({
          type: "error",
          message:
            result?.message ||
            t("changeEmail.error", "No se pudo cambiar el email."),
          open: true,
        });
        return;
      }

      setChangeEmailData({
        ...changeEmailData,
        newEmail: data.newEmail,
        otp: changeEmailData?.otp ?? "",
      });

      setToast({
        type: "success",
        message:
          result.message ||
          t("changeEmail.success", "Email actualizado exitosamente"),
        open: true,
      });

      navigate("/settings");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setToast({
        type: "error",
        message:
          axiosError.response?.data?.message ||
          t("changeEmail.error", "No se pudo cambiar el email."),
        open: true,
      });
    }
  };

  return (
    <MCDashboardContent mainWidth={isMobile ? "w-full" : "max-w-2xl"}>
      <div
        className={`flex flex-col gap-6 items-center justify-center w-full mb-8 ${isMobile ? "px-4" : "px-0"}`}
      >
        <div
          className={`w-full flex flex-col gap-2 justify-center items-center ${isMobile ? "min-w-0" : "min-w-xl"}`}
        >
          <h1
            className={`font-medium mb-2 text-center ${isMobile ? "text-3xl" : "text-5xl"}`}
          >
            {t("changeEmail.title")}
          </h1>
          <p className="text-muted-foreground text-base max-w-md text-center">
            {t("changeEmail.description")}
          </p>
          <MCFormWrapper
            schema={newEmailSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              newEmail: changeEmailData?.newEmail || "",
            }}
            className={`mt-4 flex flex-col items-center gap-4 h-full ${isMobile ? "w-full" : "w-md"}`}
          >
            <MCInput
              label={t("changeEmail.newEmailLabel")}
              name="newEmail"
              placeholder={t("changeEmail.newEmailPlaceholder")}
              className="w-full"
            />
            <MCButton
              type="submit"
              disabled={isPending}
              className={isMobile ? "w-full" : "w-xs"}
              icon={<ArrowRight />}
              iconPosition="right"
            >
              {isPending
                ? t("changeEmail.changingButton", "Cambiando...")
                : t("changeEmail.changeButton")}
            </MCButton>
          </MCFormWrapper>
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default ChangeEmailPage;
