import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoWhite from "@/assets/MediConnectLanding.png";
import { useTranslation } from "react-i18next";
function AuthHeader() {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  return (
    <div className="bg-primary py-4 px-6">
      <div className="flex items-center justify-between">
        {/* Left: Arrow + Volver */}
        <button
          className="group flex items-center gap-2 text-white transition-all duration-150 hover:opacity-80 active:scale-95"
          onClick={() => navigate("/login")} // Cambia aquí la ruta según lo que necesites
          type="button"
        >
          <ArrowLeft className="text-white transition-transform duration-200 group-hover:-translate-x-1 group-hover:scale-110" />
          <span className="font-medium text-lg">{t("header.back")}</span>
        </button>
        {/* Center: Logo */}
        <div className="flex-1 flex justify-center">
          <img
            src={LogoWhite}
            alt="MediConnect Logo"
            className="h-20 object-contain pointer-events-none"
          />
        </div>
        {/* Right: Empty for spacing */}
        <div className="w-20" />
      </div>
    </div>
  );
}

export default AuthHeader;
