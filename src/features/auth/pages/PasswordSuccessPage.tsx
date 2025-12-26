import React from "react";
import { useTranslation } from "react-i18next";
import SuccessImg from "@/assets/successPassword.png";
import MCButton from "@/shared/components/forms/MCButton";
import { useNavigate } from "react-router-dom";

function PasswordSuccessPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <img
        src={SuccessImg}
        alt={t("passwordSuccess.imgAlt", "Contraseña actualizada con éxito")}
        className="w-90 h-90 mb-8 pointer-events-none" // imagen mucho más grande
      />
      <h2 className="text-3xl font-semibold mb-4">
        {t("passwordSuccess.title", "¡Listo! Tu contraseña fue actualizada.")}
      </h2>
      <MCButton className="mt-6" onClick={() => navigate("/auth/login")}>
        {t("passwordSuccess.continue", "Continuar")}
      </MCButton>
    </div>
  );
}

export default PasswordSuccessPage;
3;
