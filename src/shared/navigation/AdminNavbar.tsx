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
import { ROUTES } from "@/router/routes";

function AdminNavbar() {
  const location = useLocation();
  const { t } = useTranslation("dashboard");
  const theme = useAppStore((state) => state.theme);

  const usuariosRoutes = [ROUTES.PATIENTS, ROUTES.DOCTORS, ROUTES.CENTERS];

  const contenidoRoutes = [
    ROUTES.HEALTH_CENTER_TYPE,
    ROUTES.PROFESSION,
    ROUTES.SERVICE_TYPE,
    ROUTES.COUNTRY,
    ROUTES.INSURANCE_TYPE,
    ROUTES.INSURANCES,
    ROUTES.ALLERGIES,
  ];

  const isUsuariosActive = usuariosRoutes.includes(location.pathname);
  const isContenidoActive = contenidoRoutes.includes(location.pathname);
  const isDashboardActive = location.pathname === ROUTES.DASHBOARD;

  const hasActiveChildUsuarios = usuariosRoutes.includes(location.pathname);
  const hasActiveChildContenido = contenidoRoutes.includes(location.pathname);

  return (
    <nav className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 bg-background rounded-full shadow-md border border-border">
      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <img
          src={
            theme === "dark"
              ? "https://res.cloudinary.com/dy2wtanhl/image/upload/v1771637881/MediConnectLanding_ryopcw.png"
              : "https://res.cloudinary.com/dy2wtanhl/image/upload/v1771637879/MediConnectLanding-green_trpgvu.png"
          }
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
                href={ROUTES.DASHBOARD}
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
                        href={ROUTES.PATIENTS}
                        active={location.pathname === ROUTES.PATIENTS}
                        isChild
                        className="text-sm text-primary/80 hover:text-primary"
                      >
                        {t("navbar.pacientes")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href={ROUTES.DOCTORS}
                        active={location.pathname === ROUTES.DOCTORS}
                        isChild
                        className="text-sm text-primary/80 hover:text-primary"
                      >
                        {t("navbar.doctores")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href={ROUTES.CENTERS}
                        active={location.pathname === ROUTES.CENTERS}
                        isChild
                        className="text-sm text-primary/80 hover:text-primary"
                      >
                        {t("navbar.centros")}
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </div>
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
                        href={ROUTES.HEALTH_CENTER_TYPE}
                        active={location.pathname === ROUTES.HEALTH_CENTER_TYPE}
                        isChild
                        className="text-sm text-primary/80 hover:text-primary"
                      >
                        {t("navbar.tipoCentroSalud")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href={ROUTES.PROFESSION}
                        active={location.pathname === ROUTES.PROFESSION}
                        isChild
                        className="text-sm text-primary/80 hover:text-primary"
                      >
                        {t("navbar.profesion")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href={ROUTES.SERVICE_TYPE}
                        active={location.pathname === ROUTES.SERVICE_TYPE}
                        isChild
                        className="text-sm text-primary/80 hover:text-primary"
                      >
                        {t("navbar.tipoServicio")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href={ROUTES.COUNTRY}
                        active={location.pathname === ROUTES.COUNTRY}
                        isChild
                        className="text-sm text-primary/80 hover:text-primary"
                      >
                        {t("navbar.pais")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href={ROUTES.INSURANCE_TYPE}
                        active={location.pathname === ROUTES.INSURANCE_TYPE}
                        isChild
                        className="text-sm text-primary/80 hover:text-primary"
                      >
                        {t("navbar.tipoSeguro")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href={ROUTES.INSURANCES}
                        active={location.pathname === ROUTES.INSURANCES}
                        isChild
                        className="text-sm text-primary/80 hover:text-primary"
                      >
                        {t("navbar.seguros")}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href={ROUTES.ALLERGIES}
                        active={location.pathname === ROUTES.ALLERGIES}
                        isChild
                        className="text-sm text-primary/80 hover:text-primary"
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
        {/* <AdminNavbarBell /> */}
        <div className="hidden md:block">
          <AdminUserMenu />
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
