import { useState } from "react";
import { Menu, X, ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";
import AdminUserMenu from "./AdminUserMenu";

import { useAppStore } from "@/stores/useAppStore";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AdminNavbarMobile() {
  const [open, setOpen] = useState(false);
  const [usuariosOpen, setUsuariosOpen] = useState(false);
  const [contenidoOpen, setContenidoOpen] = useState(false);

  const theme = useAppStore((state) => state.theme);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("dashboard");

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

  const handleNavigation = (route: string) => {
    navigate(route);
    setOpen(false);
  };

  const handleLogout = () => {
    // Aquí puedes agregar tu lógica de logout
    console.log("Logout clicked");
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between w-full px-6 py-4 md:hidden bg-background rounded-full shadow-md border border-border">
      {/* Logo/Brand */}
      <div className="flex items-center gap-3">
        <img
          src={
            theme === "dark"
              ? "https://res.cloudinary.com/dy2wtanhl/image/upload/v1771637881/MediConnectLanding_ryopcw.png"
              : "https://res.cloudinary.com/dy2wtanhl/image/upload/v1771637879/MediConnectLanding-green_trpgvu.png"
          }
          alt="MediConnect"
          className="h-16 w-auto"
        />
      </div>

      {/* Right side - Notifications + Menu */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-bg-btn-secondary border-none shadow-none h-14 w-14 hover:bg-bg-btn-secondary/80 active:scale-95 transition-all duration-200"
            >
              <Menu className="h-6 w-6 text-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-80 p-0 bg-background border-l border-border"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      theme === "dark"
                        ? "https://res.cloudinary.com/dy2wtanhl/image/upload/v1771637881/MediConnectLanding_ryopcw.png"
                        : "https://res.cloudinary.com/dy2wtanhl/image/upload/v1771637879/MediConnectLanding-green_trpgvu.png"
                    }
                    alt="MediConnect"
                    className="h-12 w-auto"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="rounded-full h-8 w-8 hover:bg-accent/70 focus:bg-accent active:scale-95 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* User Profile Section */}
              <div className="p-6 border-b border-border">
                <AdminUserMenu />
              </div>

              {/* Navigation Menu */}
              <div className="flex-1 p-6 overflow-y-auto">
                <nav className="space-y-3">
                  {/* Dashboard */}
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left h-12 px-4 rounded-xl transition-all duration-200 active:scale-95 ${
                      isDashboardActive
                        ? "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary"
                        : "text-primary hover:bg-accent/70 hover:text-primary focus:bg-accent"
                    }`}
                    onClick={() => handleNavigation("/")}
                  >
                    {t("navbar.dashboard")}
                  </Button>

                  {/* Usuarios Dropdown */}
                  <Collapsible
                    open={usuariosOpen}
                    onOpenChange={setUsuariosOpen}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`w-full justify-between text-left h-12 px-4 rounded-full transition-all duration-200 active:scale-95 ${
                          isUsuariosActive
                            ? "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary"
                            : "text-primary hover:bg-accent/70 hover:text-primary focus:bg-accent"
                        }`}
                      >
                        {t("navbar.usuarios")}
                        {usuariosOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 space-y-1 mt-2">
                      {/* Admin eliminado */}
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-left h-10 px-4 rounded-lg text-sm transition-all duration-200 active:scale-95 ${
                          location.pathname === "/usuarios/pacientes"
                            ? "bg-accent/50 text-primary"
                            : "text-primary/80 hover:bg-accent/60 hover:text-primary focus:bg-accent"
                        }`}
                        onClick={() => handleNavigation("/usuarios/pacientes")}
                      >
                        {t("navbar.pacientes")}
                      </Button>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-left h-10 px-4 rounded-lg text-sm transition-all duration-200 active:scale-95 ${
                          location.pathname === "/usuarios/doctores"
                            ? "bg-accent/50 text-primary"
                            : "text-primary/80 hover:bg-accent/60 hover:text-primary focus:bg-accent"
                        }`}
                        onClick={() => handleNavigation("/usuarios/doctores")}
                      >
                        {t("navbar.doctores")}
                      </Button>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-left h-10 px-4 rounded-lg text-sm transition-all duration-200 active:scale-95 ${
                          location.pathname === "/usuarios/centros"
                            ? "bg-acent/50 text-primary"
                            : "text-primary/80 hover:bg-accent/60 hover:text-primary focus:bg-accent"
                        }`}
                        onClick={() => handleNavigation("/usuarios/centros")}
                      >
                        {t("navbar.centros")}
                      </Button>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Reporte de cuentas eliminado */}
                  {/* 
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left h-12 px-4 rounded-xl transition-all duration-200 active:scale-95 ${
                      isReporteActive
                        ? "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary"
                        : "text-primary hover:bg-accent/70 hover:text-primary focus:bg-accent"
                    }`}
                    onClick={() => handleNavigation("/reporte-cuentas")}
                  >
                    {t("navbar.reporteCuentas")}
                  </Button>
                  */}

                  {/* Contenido Dropdown */}
                  <Collapsible
                    open={contenidoOpen}
                    onOpenChange={setContenidoOpen}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`w-full justify-between text-left h-12 px-4 rounded-full transition-all duration-200 active:scale-95 ${
                          isContenidoActive
                            ? "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary"
                            : "text-primary hover:bg-accent/70 hover:text-primary focus:bg-accent"
                        }`}
                      >
                        {t("navbar.contenido")}
                        {contenidoOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 space-y-1 mt-2">
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-left h-10 px-4 rounded-lg text-sm transition-all duration-200 active:scale-95 ${
                          location.pathname === "/contenido/tipo-centro-salud"
                            ? "bg-accent/50 text-primary"
                            : "text-primary/80 hover:bg-accent/60 hover:text-primary focus:bg-accent"
                        }`}
                        onClick={() =>
                          handleNavigation("/contenido/tipo-centro-salud")
                        }
                      >
                        {t("navbar.tipoCentroSalud")}
                      </Button>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-left h-10 px-4 rounded-lg text-sm transition-all duration-200 active:scale-95 ${
                          location.pathname === "/contenido/profesion"
                            ? "bg-accent/50 text-primary"
                            : "text-primary/80 hover:bg-accent/60 hover:text-primary focus:bg-accent"
                        }`}
                        onClick={() => handleNavigation("/contenido/profesion")}
                      >
                        {t("navbar.profesion")}
                      </Button>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-left h-10 px-4 rounded-lg text-sm transition-all duration-200 active:scale-95 ${
                          location.pathname === "/contenido/tipo-servicio"
                            ? "bg-accent/50 text-primary"
                            : "text-primary/80 hover:bg-accent/60 hover:text-primary focus:bg-accent"
                        }`}
                        onClick={() =>
                          handleNavigation("/contenido/tipo-servicio")
                        }
                      >
                        {t("navbar.tipoServicio")}
                      </Button>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-left h-10 px-4 rounded-lg text-sm transition-all duration-200 active:scale-95 ${
                          location.pathname === "/contenido/pais"
                            ? "bg-accent/50 text-primary"
                            : "text-primary/80 hover:bg-accent/60 hover:text-primary focus:bg-accent"
                        }`}
                        onClick={() => handleNavigation("/contenido/pais")}
                      >
                        {t("navbar.pais")}
                      </Button>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-left h-10 px-4 rounded-lg text-sm transition-all duration-200 active:scale-95 ${
                          location.pathname === "/contenido/tipo-seguro"
                            ? "bg-accent/50 text-primary"
                            : "text-primary/80 hover:bg-accent/60 hover:text-primary focus:bg-accent"
                        }`}
                        onClick={() =>
                          handleNavigation("/contenido/tipo-seguro")
                        }
                      >
                        {t("navbar.tipoSeguro")}
                      </Button>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-left h-10 px-4 rounded-lg text-sm transition-all duration-200 active:scale-95 ${
                          location.pathname === "/contenido/seguros"
                            ? "bg-accent/50 text-primary"
                            : "text-primary/80 hover:bg-accent/60 hover:text-primary focus:bg-accent"
                        }`}
                        onClick={() => handleNavigation("/contenido/seguros")}
                      >
                        {t("navbar.seguros")}
                      </Button>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-left h-10 px-4 rounded-lg text-sm transition-all duration-200 active:scale-95 ${
                          location.pathname === "/contenido/alergias"
                            ? "bg-accent/50 text-primary"
                            : "text-primary/80 hover:bg-accent/60 hover:text-primary focus:bg-accent"
                        }`}
                        onClick={() => handleNavigation("/contenido/alergias")}
                      >
                        {t("navbar.alergias")}
                      </Button>
                    </CollapsibleContent>
                  </Collapsible>
                </nav>
              </div>

              {/* Footer - Logout Button */}
              <div className="p-6 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  data-variant="destructive"
                  className="
    w-full justify-start text-left h-12 px-4 rounded-xl transition-all duration-200 active:scale-95
    text-red-600
    hover:bg-red-600/10 hover:text-red-600
    focus:bg-red-600/15 focus:text-red-600
    [&_svg]:!text-red-600
    dark:hover:bg-red-600/20 dark:hover:text-red-500
    dark:focus:bg-red-600/30 dark:focus:text-red-500
  "
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("userMenu.logout")}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default AdminNavbarMobile;
