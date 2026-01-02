import { Outlet } from "react-router-dom";
import AdminNavbar from "@/shared/navigation/AdminNavbar";
import AdminNavbarMobile from "@/shared/navigation/AdminNavbarMobile";

function DashboardLayout() {
  return (
    <div className="p-8 bg-bg-btn-secondary min-h-screen flex flex-col gap-6">
      {/* Navbar móvil solo visible en pantallas pequeñas */}
      <div className="block md:hidden">
        <AdminNavbarMobile />
      </div>
      {/* Navbar escritorio solo visible en pantallas medianas o mayores */}
      <div className="hidden md:block">
        <AdminNavbar />
      </div>
      <div className="w-fill ">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
