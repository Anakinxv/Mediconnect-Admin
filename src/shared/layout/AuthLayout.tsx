import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AuthHeader from "@/features/auth/components/AuthHeader";
import { useAppStore } from "@/stores/useAppStore";

function AuthLayout() {
  const location = useLocation();
  const reset = useAppStore((state) => state.reset);
  useEffect(() => {
    return () => {
      reset();
    };
  }, [location]);

  return (
    <div>
      <div>
        <AuthHeader />
      </div>
      <div className=" h-full flex justify-center items-center mt-20 ">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
