import React from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface AuthContentContainerProps {
  title: string;
  subtitle?: React.ReactNode; // Cambiado de string a React.ReactNode
  children: React.ReactNode;
}

const AuthContentContainer: React.FC<AuthContentContainerProps> = ({
  title,
  subtitle,
  children,
}) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={`w-full flex flex-col justify-center items-center overflow-x-hidden ${
        isMobile ? "p-4 max-w-full" : "p-8 max-w-3xl"
      }`}
    >
      <h2
        className={`text-3xl font-bold mb-2 text-center ${
          isMobile ? "text-2xl" : ""
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-primary/80 mb-6 text-center">{subtitle}</p>
      )}
      <div className={isMobile ? "w-full px-4" : "w-full"}>{children}</div>
    </div>
  );
};

export default AuthContentContainer;
