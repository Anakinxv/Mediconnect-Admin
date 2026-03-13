import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations/commonAnimations";
import MCBackButton from "@/shared/components/forms/MCBackButton";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  disabledBackButton?: boolean;
  mainWidth?: string;
  mainClassName?: string;
  noBg?: boolean;
  isTele?: boolean;
  create?: boolean;
  abandonarTrigger?: React.ReactNode;
}

const MCDashboardContent: React.FC<Props> = ({
  children,
  showBackButton = true,
  onBack,
  disabledBackButton,
  mainWidth = "max-w-2xl",
  mainClassName = "",
  noBg = false,
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <div
      className={`
        ${noBg ? "bg-transparent p-0 md:px-10 md:py-0" : "bg-background"}
        min-h-screen flex gap-4 rounded-4xl
        ${isMobile ? "p-4" : "p-10"}
      `}
    >
      <div
        className={`w-full gap-8 ${
          isMobile ? "flex flex-col" : "grid grid-cols-[auto_1fr]"
        } justify-items-center `}
      >
        <aside className={isMobile ? "w-full mb-4" : ""}>
          {showBackButton && (
            <MCBackButton
              onClick={onBack || (() => navigate(-1))}
              disabled={disabledBackButton}
              variant={noBg ? "background" : "default"}
            />
          )}
        </aside>

        <motion.main
          {...fadeInUp}
          className={`${isMobile ? "w-full" : mainWidth} flex flex-col gap-4 ${mainClassName}`}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default MCDashboardContent;
