import { Outlet } from "react-router-dom";
import AdminNavbar from "@/features/dashboard/components/AdminNavbar";
import AdminNavbarMobile from "@/features/dashboard/components/AdminNavbarMobile";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

function DashboardLayout() {
  const isMobile = useIsMobile();

  return (
    <div className="p-10 bg-bg-btn-secondary min-h-screen flex flex-col gap-6">
      {isMobile ? <AdminNavbarMobile /> : <AdminNavbar />}
      <div className="w-fill ">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
