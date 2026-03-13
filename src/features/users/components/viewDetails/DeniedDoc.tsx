import React from "react";
import MCTextArea from "@/shared/components/forms/MCTextArea";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useTranslation } from "react-i18next";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { TriangleAlert } from "lucide-react";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { z } from "zod";

interface DeniedDocProps {
  id: string;
  documentTitle: string;
  onConfirmReject: (reason: string) => void;
  children: React.ReactNode;
}

export default function DeniedDoc({
  id,
  documentTitle,
  onConfirmReject,
  children,
}: DeniedDocProps) {
  const { t } = useTranslation("common");
  const setToast = useGlobalUIStore((s) => s.setToast);

  const handleConfirm = () => {
    // Mantener vacío si MCModalBase ya coordina el submit del formulario interno.
  };

  const handleSecondary = () => {
    setToast({
      message: t("verification.reject.aborted"),
      type: "info",
      open: true,
    });
  };

  const onSubmit = (values: { rejectionReason: string }) => {
    onConfirmReject(values.rejectionReason);
    setToast({
      message: t("verification.reject.success"),
      type: "success",
      open: true,
    });
  };

  return (
    <MCModalBase
      id={id}
      title={`${t("verification.reject.title")}: ${documentTitle}`}
      trigger={children}
      variant="warning"
      size="smWide"
      onConfirm={handleConfirm}
      onSecondary={handleSecondary}
      confirmText={t("verification.reject.confirm")}
      secondaryText={t("verification.reject.cancel")}
      description="¿Seguro que quieres rechazar este documento? Una vez rechazado, no podrás modificar el estado del mismo."
    >
      <MCFormWrapper
        defaultValues={{ rejectionReason: "" }}
        schema={rejectDocumentSchema(t)}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <MCTextArea
          name="rejectionReason"
          placeholder={t("verification.reject.reasonPlaceholder")}
          required
          charLimit={300}
          showCharCount
          rows={4}
          maxRows={10}
        />
      </MCFormWrapper>
    </MCModalBase>
  );
}

const rejectDocumentSchema = (t: (key: string) => string) =>
  z.object({
    rejectionReason: z
      .string()
      .min(1, t("verification.reject.reasonRequired"))
      .max(300, t("verification.reject.reasonTooLong")),
  });
