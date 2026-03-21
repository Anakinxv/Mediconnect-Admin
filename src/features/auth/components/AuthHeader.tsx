import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/useAppStore";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
function AuthHeader() {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const email = useAppStore((state) => state.forgotPassword?.email);
  const otp = useAppStore((state) => state.otp);

  const setLanguage = useGlobalUIStore((state) => state.setLanguage);
  const language = useGlobalUIStore((state) => state.language);

  const hasProgress = email || otp;

  const handleConfirmCancel = () => {
    navigate("/", { replace: true });
  };

  const handleDirectBack = () => {
    navigate("/");
  };

  // Solo el contenido del botón, sin el button tag
  const backButtonContent = (
    <div className="group flex items-center gap-2 text-white transition-all duration-150 hover:opacity-80 active:scale-95">
      <ArrowLeft className="text-white transition-transform duration-200 group-hover:-translate-x-1 group-hover:scale-110" />
      <span className="font-medium text-lg">{t("header.back")}</span>
    </div>
  );

  return (
    <>
      <div className="bg-primary py-4 px-6">
        <div className="flex items-center justify-between">
          {hasProgress ? (
            <MCModalBase
              id="cancel-process-modal"
              trigger={backButtonContent}
              title="¿Deseas cancelar el proceso?"
              variant="warning"
              onConfirm={handleConfirmCancel}
              confirmText="Sí, cancelar"
              secondaryText="Continuar"
              size="smWide"
            >
              <div>
                <p className="text-gray-600 mb-4">
                  Si sales ahora, perderás el progreso de recuperación de
                  contraseña y el código de verificación enviado será eliminado.
                </p>
                <p className="text-gray-600">
                  Tendrás que iniciar el proceso nuevamente.
                </p>
              </div>
            </MCModalBase>
          ) : (
            <button
              className="group flex items-center gap-2 text-white transition-all duration-150 hover:opacity-80 active:scale-95"
              onClick={handleDirectBack}
              type="button"
            >
              <ArrowLeft className="text-white transition-transform duration-200 group-hover:-translate-x-1 group-hover:scale-110" />
              <span className="font-medium text-lg">{t("header.back")}</span>
            </button>
          )}

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            <img
              src={
                "https://res.cloudinary.com/dy2wtanhl/image/upload/v1771637881/MediConnectLanding_ryopcw.png"
              }
              alt="MediConnect Logo"
              className="h-20 object-contain pointer-events-none"
            />
          </div>

          {/* Right: Language flags */}
          <div className="flex gap-2 rounded-lg p-2">
            <button
              onClick={() => setLanguage("en")}
              className={`p-2 rounded transition-opacity ${
                language !== "en" ? "opacity-50" : ""
              }`}
              aria-label="English"
            >
              <img
                src="https://res.cloudinary.com/dy2wtanhl/image/upload/v1771637851/flag-usa_ubewc7.png"
                alt="English"
                className="w-6 h-6"
              />
            </button>
            <button
              onClick={() => setLanguage("es")}
              className={`p-2 rounded transition-opacity ${
                language !== "es" ? "opacity-50" : ""
              }`}
              aria-label="Español"
            >
              <img
                src="https://res.cloudinary.com/dy2wtanhl/image/upload/v1771637850/flag-spain_u9cses.png"
                alt="Español"
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthHeader;
