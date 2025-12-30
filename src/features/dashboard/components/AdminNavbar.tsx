import LogoImg from "@/assets/MediConnectLanding-green.png";
import AdminUserMenu from "./AdminUserMenu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuContent,
} from "@/shared/ui/navigation-menu";
import { useLocation } from "react-router-dom";
import AdminNavbarBell from "./AdminNavbarBell";
function AdminNavbar() {
  const location = useLocation();

  const usuariosRoutes = [
    "/a",
    "/usuarios/pacientes",
    "/usuarios/doctores",
    "/usuarios/centros",
  ];

  const contenidoRoutes = [
    "/contenido/tipo-centro-salud",
    "/contenido/profesion",
    "/contenido/tipo-servicio",
    "/contenido/pais",
    "/contenido/tipo-seguro",
    "/contenido/seguros",
    "/contenido/alergias",
  ];

  const isUsuariosActive = usuariosRoutes.includes(location.pathname);
  const isContenidoActive = contenidoRoutes.includes(location.pathname);
  const isDashboardActive = location.pathname === "/";
  const isReporteActive = location.pathname === "/reporte-cuentas";

  const hasActiveChildUsuarios = usuariosRoutes.includes(location.pathname);
  const hasActiveChildContenido = contenidoRoutes.includes(location.pathname);

  return (
    <nav className="w-full flex items-center justify-between px-10 py-3 bg-white rounded-full">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={LogoImg} alt="MediConnect" className="h-18 w-auto" />
      </div>
      <main className="bg-bg-btn-secondary px-6 py-2 rounded-full">
        {/* Main Navigation */}
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="gap-6">
            {/* Dashboard */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/"
                active={isDashboardActive}
                className={`text-base px-4 py-6  rounded-full hover:rounded-full ${
                  isDashboardActive
                    ? "font-medium"
                    : "font-normal opacity-50 hover:opacity-100"
                }`}
              >
                Dashboard
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Usuarios Dropdown */}
            <NavigationMenuItem
              className={hasActiveChildUsuarios ? "has-active-child" : ""}
            >
              <div className="relative">
                <NavigationMenuTrigger
                  className={`${navigationMenuTriggerStyle()} text-base px-4 py-6 ${
                    isUsuariosActive
                      ? "font-medium"
                      : "font-normal opacity-50 hover:opacity-100"
                  }`}
                  active={isUsuariosActive}
                  hasActiveChild={hasActiveChildUsuarios}
                >
                  Usuarios
                </NavigationMenuTrigger>
                <NavigationMenuContent className="absolute left-0 z-50 border-primary/15">
                  <ul className="p-2 flex flex-col gap-1">
                    <li>
                      <NavigationMenuLink
                        href="/a"
                        active={location.pathname === "/a"}
                        isChild
                      >
                        Admins
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/usuarios/pacientes"
                        active={location.pathname === "/usuarios/pacientes"}
                        isChild
                      >
                        Pacientes
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/usuarios/doctores"
                        active={location.pathname === "/usuarios/doctores"}
                        isChild
                      >
                        Doctores
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/usuarios/centros"
                        active={location.pathname === "/usuarios/centros"}
                        isChild
                      >
                        Centros de Salud
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </div>
            </NavigationMenuItem>

            {/* Reporte de cuentas */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/reporte-cuentas"
                active={isReporteActive}
                className={`text-base px-4 py-6 rounded-full hover:rounded-full ${
                  isReporteActive
                    ? "font-medium"
                    : "font-normal opacity-50 hover:opacity-100"
                }`}
              >
                Reporte de cuentas
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Contenido Dropdown */}
            <NavigationMenuItem
              className={hasActiveChildContenido ? "has-active-child" : ""}
            >
              <div className="relative">
                <NavigationMenuTrigger
                  className={`${navigationMenuTriggerStyle()} text-base px-4 py-6 ${
                    isContenidoActive
                      ? "font-medium"
                      : "font-normal opacity-50 hover:opacity-100"
                  }`}
                  active={isContenidoActive}
                  hasActiveChild={hasActiveChildContenido}
                >
                  Contenido
                </NavigationMenuTrigger>
                <NavigationMenuContent className="absolute left-0 z-50 border-primary/15">
                  <ul className="p-2 flex flex-col gap-1">
                    <li>
                      <NavigationMenuLink
                        href="/contenido/tipo-centro-salud"
                        active={
                          location.pathname === "/contenido/tipo-centro-salud"
                        }
                        isChild
                      >
                        Tipo Centro Salud
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/contenido/profesion"
                        active={location.pathname === "/contenido/profesion"}
                        isChild
                      >
                        Profesión
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/contenido/tipo-servicio"
                        active={
                          location.pathname === "/contenido/tipo-servicio"
                        }
                        isChild
                      >
                        Tipo Servicio
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/contenido/pais"
                        active={location.pathname === "/contenido/pais"}
                        isChild
                      >
                        País
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/contenido/tipo-seguro"
                        active={location.pathname === "/contenido/tipo-seguro"}
                        isChild
                      >
                        Tipo Seguro
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/contenido/seguros"
                        active={location.pathname === "/contenido/seguros"}
                        isChild
                      >
                        Seguros
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/contenido/alergias"
                        active={location.pathname === "/contenido/alergias"}
                        isChild
                      >
                        Alergias
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </div>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </main>

      {/* User Menu */}
      <div className="flex items-center gap-3">
        <AdminNavbarBell />
        <AdminUserMenu />
      </div>
    </nav>
  );
}

export default AdminNavbar;
