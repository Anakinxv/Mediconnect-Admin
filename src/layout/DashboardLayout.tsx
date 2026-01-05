import { Outlet } from "react-router-dom";
import AdminNavbar from "@/shared/navigation/AdminNavbar";
import AdminNavbarMobile from "@/shared/navigation/AdminNavbarMobile";

function DashboardLayout() {
  return (
    <div className="p-8 bg-bg-btn-secondary  min-h-screen  flex flex-col gap-6">
      {/* Navbar móvil solo visible en pantallas pequeñas */}
      <div className="block md:hidden sticky top-0 z-30 animate-fade-in">
        <AdminNavbarMobile />
      </div>
      {/* Navbar escritorio solo visible en pantallas medianas o mayores */}
      <div className="hidden md:block sticky top-5 z-30 animate-fade-in">
        <AdminNavbar />
      </div>
      <div className="w-fill h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
