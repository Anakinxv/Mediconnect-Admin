import React, { useEffect } from "react";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import MCButton from "@/shared/components/forms/MCButton";
import { useNavigate } from "react-router-dom";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useTranslation } from "react-i18next";

function DeleteAccountPage() {
  const { t } = useTranslation("common");
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const VerificationContext = useGlobalUIStore(
    (state) => state.verificationContext,
  );
  const VerificationContextStatus = useGlobalUIStore(
    (state) => state.verificationContextStatus,
  );

  useEffect(() => {
    if (
      VerificationContext !== "DELETE_ACCOUNT" ||
      VerificationContextStatus !== "VERIFIED"
    ) {
      navigate("/settings");
    }
  }, [VerificationContext, VerificationContextStatus, navigate]);

  const handleSubmit = () => {
    // Aquí deberías llamar a tu API para eliminar la cuenta
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
            className={`font-medium mb-2 text-center text-destructive ${isMobile ? "text-3xl" : "text-5xl"}`}
          >
            {t("deleteAccount.title")}
          </h1>
          <p className="text-base max-w-md text-center text-muted-foreground">
            {t("deleteAccount.description")}
          </p>
          <div className="bg-destructive/10 border border-destructive rounded-3xl p-4 my-2 max-w-md text-sm text-destructive">
            <b>{t("deleteAccount.whatHappens")}</b>
            <ul className="list-disc ml-5 mt-2">
              <li>{t("deleteAccount.consequence1")}</li>
              <li>{t("deleteAccount.consequence2")}</li>
              <li>{t("deleteAccount.consequence3")}</li>
              <li>{t("deleteAccount.consequence4")}</li>
            </ul>
          </div>
          <div
            className={`flex gap-4 mt-6 ${isMobile ? "flex-col w-full" : ""}`}
          >
            <MCButton
              type="button"
              variant="outline"
              className={isMobile ? "w-full" : ""}
              onClick={() => navigate("/settings")}
            >
              {t("deleteAccount.cancelButton")}
            </MCButton>
            <MCButton
              type="submit"
              variant="delete"
              className={isMobile ? "w-full" : ""}
              onClick={handleSubmit}
            >
              {t("deleteAccount.deleteButton")}
            </MCButton>
          </div>
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default DeleteAccountPage;
