import React from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import MCBackButton from "@/shared/components/forms/MCBackButton";
import MCButton from "@/shared/components/forms/MCButton";
import { useTranslation } from "react-i18next";
import { ArrowRightIcon } from "@/shared/ui/arrow-right";
interface AuthFooterContainerProps {
  children?: React.ReactNode;
}

const AuthFooterContainer: React.FC<AuthFooterContainerProps> = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation("auth");
  return (
    <div
      className={`w-full mt-6  ${
        isMobile
          ? "flex flex-col-2  justify-between items-center"
          : "grid grid-cols-2  sm:flex sm:justify-between items-center"
      }`}
    >
      <div>
        <MCBackButton />
      </div>
      <MCButton type="submit" icon={<ArrowRightIcon />} iconPosition="right">
        {t("footer.continue")}
      </MCButton>
    </div>
  );
};

export default AuthFooterContainer;
