import { Outlet } from "react-router-dom";
import AdminNavbar from "@/features/dashboard/components/AdminNavbar";
import AdminNavbarMobile from "@/features/dashboard/components/AdminNavbarMobile";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

function DashboardLayout() {
  const isMobile = useIsMobile();

  return (
    <div>
      {isMobile ? <AdminNavbarMobile /> : <AdminNavbar />}
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
