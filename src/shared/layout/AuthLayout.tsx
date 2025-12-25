import { Outlet } from "react-router-dom";
import AuthHeader from "@/features/auth/components/AuthHeader";
function AuthLayout() {
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
