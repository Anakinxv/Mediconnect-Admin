import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoWhite from "@/assets/MediConnectLanding.png";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/useAppStore";
import { MCModalBase } from "@/shared/components/MCModalBase";

function AuthHeader() {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const email = useAppStore((state) => state.forgotPassword.email);
  const otp = useAppStore((state) => state.otp);

  const modal = useAppStore((state) => state.modalOpen);
  const setModalOpen = useAppStore((state) => state.setModalOpen);

  const hasProgress = email || otp;

  const handleBackClick = () => {
    if (hasProgress) {
      setModalOpen(true);
    } else {
      navigate("/login");
    }
  };

  const handleCloseCancelModal = () => {
    setModalOpen(false);
  };

  const handleConfirmCancel = () => {
    navigate("/login", { replace: true });
    setModalOpen(false);
  };

  return (
    <>
      <div className="bg-primary py-4 px-6">
        <div className="flex items-center justify-between">
          {/* Left: Arrow + Volver */}
          <button
            className="group flex items-center gap-2 text-white transition-all duration-150 hover:opacity-80 active:scale-95"
            onClick={handleBackClick}
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
          <div className="w-20"></div>
        </div>
      </div>

      {/* Modal de advertencia */}
      <MCModalBase
        id="cancel-process-modal"
        isOpen={modal}
        onClose={handleCloseCancelModal}
        title="¿Deseas cancelar el proceso?"
        variant="warning"
        onConfirm={handleConfirmCancel}
        onSecondary={handleCloseCancelModal}
        confirmText="Sí, cancelar"
        secondaryText="Continuar"
      >
        <p className="text-gray-600 mb-4">
          Si sales ahora, perderás el progreso de recuperación de contraseña y
          el código de verificación enviado será eliminado.
        </p>
        <p className="text-gray-600">
          Tendrás que iniciar el proceso nuevamente.
        </p>
      </MCModalBase>
    </>
  );
}

export default AuthHeader;
