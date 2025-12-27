import { useEffect, useRef } from "react";
import MCButton from "@/shared/components/forms/MCButton";
import { blendy } from "@/lib/blendy";

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

const sizeClasses = {
  small: "max-w-sm",
  medium: "max-w-md",
  large: "max-w-2xl",
  full: "w-full h-full",
};

function MCModalBase({
  id,
  isOpen,
  onClose,
  children,
  title,
  size = "medium",
  className,
  variant = "info",
  onConfirm,
  onSecondary,
  confirmText = "Confirm",
  secondaryText = "Cancel",
}: MCModalBaseProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // OPEN animation
  useEffect(() => {
    if (isOpen) {
      blendy.update();
      requestAnimationFrame(() => {
        blendy.toggle(id);
      });
    }
  }, [isOpen, id]);

  // ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  function handleClose() {
    blendy.untoggle(id, onClose);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      {/* TARGET de Blendy */}
      <div
        data-blendy-to={id}
        ref={modalRef}
        className={`bg-white rounded-lg shadow-lg ${sizeClasses[size]} ${
          className || ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* UN SOLO WRAPPER */}
        <div className="p-6 relative flex flex-col">
          {title && (
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={handleClose}
                aria-label="Close"
                type="button"
              >
                ×
              </button>
            </div>
          )}

          <div>{children}</div>

          {/* botones por variante */}
          {variant === "warning" && (
            <div className="flex gap-2 justify-end w-full mt-6">
              <MCButton
                variant="secondary"
                onClick={onSecondary || handleClose}
              >
                {secondaryText}
              </MCButton>
              <MCButton variant="delete" onClick={onConfirm}>
                {confirmText}
              </MCButton>
            </div>
          )}

          {variant === "confirm" && (
            <div className="flex justify-end w-full mt-6">
              <MCButton variant="primary" onClick={onConfirm}>
                {confirmText}
              </MCButton>
            </div>
          )}

          {variant === "decide" && (
            <div className="flex gap-2 justify-end w-full mt-6">
              <MCButton
                variant="secondary"
                onClick={onSecondary || handleClose}
              >
                {secondaryText}
              </MCButton>
              <MCButton variant="primary" onClick={onConfirm}>
                {confirmText}
              </MCButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MCModalBase;
