import React from "react";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useTranslation } from "react-i18next";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

interface AcceptDocProps {
  id: string;
  documentTitle: string;
  onConfirmApprove: () => void;
  children: React.ReactNode;
  variant?: "decide" | "warning";
}

export default function AcceptDoc({
  id,
  documentTitle,
  onConfirmApprove,
  children,
  variant = "decide",
}: AcceptDocProps) {
  const { t } = useTranslation("common");
  const setToast = useGlobalUIStore((s) => s.setToast);

  const handleConfirm = () => {
    onConfirmApprove();
  };

  const handleSecondary = () => {
    setToast({
      message: t("verification.approve.aborted"),
      type: "info",
      open: true,
    });
  };

  const isWarning = variant === "warning";

  return (
    <MCModalBase
      id={id}
      title={`${t("verification.approve.title")}: ${documentTitle}`}
      trigger={children}
      variant={isWarning ? "warning" : "decide"}
      size="smWide"
      onConfirm={handleConfirm}
      onSecondary={handleSecondary}
      confirmText={t("verification.approve.confirm")}
      secondaryText={t("verification.approve.cancel")}
      description={t("verification.approve.description")}
    >
      <></>
    </MCModalBase>
  );
}
