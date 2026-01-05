import LogoImg from "@/assets/MediConnectLanding-green.png";
import LogoImgdDark from "@/assets/MediConnectLanding.png";
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
import AdminNavbarBell from "../components/AdminNavbarBell";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/useAppStore";
function AdminNavbar() {
  const location = useLocation();
  const { t } = useTranslation("dashboard");
  const theme = useAppStore((state) => state.theme);
  const usuariosRoutes = [
    "/usuarios/admins",
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
  const isDashboardActive = location.pathname === "/admin/dashboard";
  const isReporteActive = location.pathname === "/reporte-cuentas";

  const hasActiveChildUsuarios = usuariosRoutes.includes(location.pathname);
  const hasActiveChildContenido = contenidoRoutes.includes(location.pathname);

  return (
    <nav className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 bg-background rounded-full shadow-md border border-border">
      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <img
          src={theme === "dark" ? LogoImgdDark : LogoImg}
          alt="MediConnect"
          className="h-12 sm:h-16 lg:h-18 w-auto"
        />
      </div>

      <main className="bg-bg-btn-secondary px-3 sm:px-4 lg:px-6 py-2 rounded-full hidden md:block">
        {/* Main Navigation */}
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="gap-2 lg:gap-6">
            {/* Dashboard */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/admin/dashboard"
                active={isDashboardActive}
                className={`text-sm lg:text-base px-2 lg:px-4 py-4 lg:py-6 rounded-full hover:rounded-full ${
                  isDashboardActive
                    ? "font-medium"
                    : "font-normal opacity-50 hover:opacity-100"
                }`}
              >
                {t("navbar.dashboard")}
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Usuarios Dropdown */}
            <NavigationMenuItem
              className={hasActiveChildUsuarios ? "has-active-child" : ""}
            >
              <div className="relative">
                <NavigationMenuTrigger
                  className={`${navigationMenuTriggerStyle()} text-sm lg:text-base px-2 lg:px-4 py-4 lg:py-6 ${
                    isUsuariosActive
                      ? "font-medium"
                      : "font-normal opacity-50 hover:opacity-100"
                  }`}
                  active={isUsuariosActive}
                  hasActiveChild={hasActiveChildUsuarios}
                >
                  {t("navbar.usuarios")}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="absolute left-0 z-50 border-primary/15 w-48 lg:w-52">
                  <ul className="p-2 flex flex-col gap-1">
                    <li>
                      <NavigationMenuLink
                        href="/usuarios/admins"
                        active={location.pathname === "/usuarios/admins"}
                        isChild
                        className="text-sm"
                      >
                        {t("navbar.admins")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/usuarios/pacientes"
                        active={location.pathname === "/usuarios/pacientes"}
                        isChild
                        className="text-sm"
                      >
                        {t("navbar.pacientes")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/usuarios/doctores"
                        active={location.pathname === "/usuarios/doctores"}
                        isChild
                        className="text-sm"
                      >
                        {t("navbar.doctores")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/usuarios/centros"
                        active={location.pathname === "/usuarios/centros"}
                        isChild
                        className="text-sm"
                      >
                        {t("navbar.centros")}
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
                className={`text-sm lg:text-base px-2 lg:px-4 py-4 lg:py-6 rounded-full hover:rounded-full ${
                  isReporteActive
                    ? "font-medium"
                    : "font-normal opacity-50 hover:opacity-100"
                }`}
              >
                {t("navbar.reporteCuentas")}
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Contenido Dropdown */}
            <NavigationMenuItem
              className={hasActiveChildContenido ? "has-active-child" : ""}
            >
              <div className="relative">
                <NavigationMenuTrigger
                  className={`${navigationMenuTriggerStyle()} text-sm lg:text-base px-2 lg:px-4 py-4 lg:py-6 ${
                    isContenidoActive
                      ? "font-medium"
                      : "font-normal opacity-50 hover:opacity-100"
                  }`}
                  active={isContenidoActive}
                  hasActiveChild={hasActiveChildContenido}
                >
                  {t("navbar.contenido")}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="absolute left-0 z-50 border-primary/15 w-52 lg:w-56">
                  <ul className="p-2 flex flex-col gap-1">
                    <li>
                      <NavigationMenuLink
                        href="/contenido/tipo-centro-salud"
                        active={
                          location.pathname === "/contenido/tipo-centro-salud"
                        }
                        isChild
                        className="text-sm"
                      >
                        {t("navbar.tipoCentroSalud")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/contenido/profesion"
                        active={location.pathname === "/contenido/profesion"}
                        isChild
                        className="text-sm"
                      >
                        {t("navbar.profesion")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/contenido/tipo-servicio"
                        active={
                          location.pathname === "/contenido/tipo-servicio"
                        }
                        isChild
                        className="text-sm"
                      >
                        {t("navbar.tipoServicio")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/contenido/pais"
                        active={location.pathname === "/contenido/pais"}
                        isChild
                        className="text-sm"
                      >
                        {t("navbar.pais")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/contenido/tipo-seguro"
                        active={location.pathname === "/contenido/tipo-seguro"}
                        isChild
                        className="text-sm"
                      >
                        {t("navbar.tipoSeguro")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/contenido/seguros"
                        active={location.pathname === "/contenido/seguros"}
                        isChild
                        className="text-sm"
                      >
                        {t("navbar.seguros")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/contenido/alergias"
                        active={location.pathname === "/contenido/alergias"}
                        isChild
                        className="text-sm"
                      >
                        {t("navbar.alergias")}
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
      <div className="flex items-center gap-2 sm:gap-3">
        <AdminNavbarBell />
        <div className="hidden md:block">
          <AdminUserMenu />
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
