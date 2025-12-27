import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AuthHeader from "@/features/auth/components/AuthHeader";
import { useAppStore } from "@/stores/useAppStore";

function AuthLayout() {
  const location = useLocation();
  const reset = useAppStore((state) => state.reset);
  const setAccessPage = useAppStore((state) => state.setAccessPage);
  const email = useAppStore((state) => state.forgotPassword.email);
  const otp = useAppStore((state) => state.otp);
  useEffect(() => {
    return () => {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/auth")) {
        reset();
        setAccessPage(false, []);
      }
    };
  }, [location.pathname, reset, setAccessPage]);

  return (
    <div>
      <div>
        <AuthHeader />
      </div>
      <div className="h-full flex justify-center items-center mt-20">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
