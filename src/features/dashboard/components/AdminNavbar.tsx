import LogoImg from "@/assets/MediConnectLanding-green.png";
import AdminUserMenu from "./AdminUserMenu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/shared/ui/navigation-menu";
import { ChevronDown } from "lucide-react";
function AdminNavbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={LogoImg} alt="MediConnect" className="h-15  w-auto" />
      </div>
      {/* Main Navigation */}
      <NavigationMenu>
        <NavigationMenuList className="gap-2">
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/dashboard"
              className="font-medium px-3 py-2 rounded hover:bg-green-50"
            >
              Dashboard
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/usuarios"
              className="font-medium px-3 py-2 rounded hover:bg-green-50"
            >
              Usuarios
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/reportes"
              className="font-medium px-3 py-2 rounded hover:bg-green-50"
            >
              Reporte de cuentas
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/contenido"
              className="font-medium px-3 py-2 rounded hover:bg-green-50"
            >
              Contenido
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {/* User Menu */}
      <div className="flex items-center gap-3">
        <AdminUserMenu />
      </div>
    </nav>
  );
}

export default AdminNavbar;
