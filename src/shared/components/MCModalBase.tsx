import type React from "react";

import { useEffect } from "react";
import MCButton from "@/shared/components/forms/MCButton";
import { X } from "lucide-react";

interface MCModalBaseProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "small" | "medium" | "large" | "full";
  className?: string;
  variant?: "warning" | "confirm" | "decide" | "info";
  onConfirm?: () => void;
  onSecondary?: () => void;
  confirmText?: string;
  secondaryText?: string;
}

export function MCModalBase({
  id,
  isOpen,
  onClose,
  children,
  title,
  size = "medium",
  className = "",
  variant = "info",
  onConfirm,
  onSecondary,
  confirmText = "Confirmar",
  secondaryText = "Cancelar",
}: MCModalBaseProps) {
  const handleClose = () => {
    if (typeof window !== "undefined" && (window as any).blendy) {
      (window as any).blendy.untoggle(id, () => {
        onClose();
      });
    } else {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    handleClose();
  };

  useEffect(() => {
    if (isOpen && typeof window !== "undefined" && (window as any).blendy) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        (window as any).blendy.update();
        (window as any).blendy.toggle(id);
      }, 10);
    }
  }, [isOpen, id]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: "max-w-md",
    medium: "max-w-lg",
    large: "max-w-2xl",
    full: "max-w-full mx-4",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        data-blendy-to={id}
        onClick={(e) => e.stopPropagation()}
        className={`${sizeClasses[size]} w-full ${className}`}
      >
        <div className="bg-card rounded-xl shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-semibold text-foreground">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-muted"
                aria-label="Cerrar modal"
              >
                <X size={24} />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>

          {/* Botones por variante */}
          {variant === "warning" && (
            <div className="flex gap-2 justify-end w-full px-6 pb-6">
              <MCButton
                variant="secondary"
                size="m"
                onClick={onSecondary || handleClose}
              >
                {secondaryText}
              </MCButton>
              <MCButton variant="delete" size="m" onClick={handleConfirm}>
                {confirmText}
              </MCButton>
            </div>
          )}

          {variant === "confirm" && (
            <div className="flex justify-end w-full px-6 pb-6">
              <MCButton variant="primary" size="m" onClick={handleConfirm}>
                {confirmText}
              </MCButton>
            </div>
          )}

          {variant === "decide" && (
            <div className="flex gap-2 justify-end w-full px-6 pb-6">
              <MCButton
                variant="secondary"
                size="m"
                onClick={onSecondary || handleClose}
              >
                {secondaryText}
              </MCButton>
              <MCButton variant="primary" size="m" onClick={handleConfirm}>
                {confirmText}
              </MCButton>
            </div>
          )}

          {/* Info variant doesn't show buttons in footer, content is custom */}
        </div>
      </div>
    </div>
  );
}
