import React, { useCallback, useRef } from "react";
import MCTextArea from "@/shared/components/forms/MCTextArea";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useTranslation } from "react-i18next";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { z } from "zod";

interface DeniedDocProps {
  id: string;
  documentTitle: string;
  onConfirmReject: (reason: string) => void;
  children: React.ReactNode;
}

function unlockBodyScroll() {
  document.body.style.overflow = "";
  document.body.style.removeProperty("overflow");
  document.documentElement.style.removeProperty("overflow");
}

export default function DeniedDoc({
  id,
  documentTitle,
  onConfirmReject,
  children,
}: DeniedDocProps) {
  const { t } = useTranslation("common");
  const setToast = useGlobalUIStore((s) => s.setToast);

  const submitRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = useCallback(() => {
    submitRef.current?.click();
  }, []);

  const handleSecondary = useCallback(() => {
    setToast({
      message: t("verification.reject.aborted"),
      type: "info",
      open: true,
    });
    unlockBodyScroll();
  }, [setToast, t]);

  const onSubmit = useCallback(
    (values: { rejectionReason: string }) => {
      onConfirmReject(values.rejectionReason);
      setToast({
        message: t("verification.reject.success"),
        type: "success",
        open: true,
      });
      unlockBodyScroll();
    },
    [onConfirmReject, setToast, t],
  );

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
      description={t("verification.reject.description")}
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
        <button ref={submitRef} type="submit" className="hidden" />
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
