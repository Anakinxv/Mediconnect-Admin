import React, { useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "@/shared/ui/sonner";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

function MCToast() {
  const toastState = useGlobalUIStore((state) => state.toast);
  const clearToast = useGlobalUIStore((state) => state.clearToast);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (toastState.open && toastState.message) {
      switch (toastState.type) {
        case "success":
          toast.success(toastState.message);
          break;
        case "error":
          toast.error(toastState.message);
          break;
        case "warning":
          toast.warning(toastState.message);
          break;
        case "info":
          toast.info(toastState.message);
          break;
        default:
          toast(toastState.message);
      }
      clearToast();
    }
  }, [toastState, clearToast]);

  return <Toaster position={isMobile ? "top-center" : "bottom-right"} />;
}

export default MCToast;
