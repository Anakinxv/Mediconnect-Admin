import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/shared/animate-ui/components/radix/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  User,
  Pencil,
  Languages,
  Moon,
  Settings,
  Shield,
  LogOut,
  ChevronDown,
} from "lucide-react";

const isMac =
  typeof window !== "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const cmdOrCtrl = isMac ? "⌘" : "Ctrl";

export function AdminUserMenu() {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-3 outline-none border-none shadow-none ring-0 focus:ring-0 h-fit transition-colors ${
            open ? "bg-gray-100 rounded-full" : ""
          }`}
        >
          <Avatar className="h-13 w-13 rounded-full shadow-lg transition-all">
            <AvatarImage
              src="https://i.pinimg.com/736x/ff/e7/3f/ffe73ffe75682fec82ccd320ccb43fe9.jpg"
              alt="José Almirante"
              className="object-cover"
            />
            <AvatarFallback className="text-xl">JA</AvatarFallback>
          </Avatar>
          <div className="flex items-start gap-3 0">
            <div className="flex flex-col items-start leading-tight text-left">
              <span className="text-base font-semibold">José Almirante</span>
              <span
                className="text-sm font-normal max-w-35 truncate"
                style={{ textOverflow: "clip" }}
                title="jose@gmail.com"
              >
                Admin
              </span>
            </div>
            <div className="flex flex-col h-full w-full items-start justify-start">
              <ChevronDown
                className={`w-7 h-7 text-muted-foreground mt-0.5 stroke-2.5 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 rounded-2xl bg-background border border-primary/20"
        align="end"
      >
        <DropdownMenuLabel className="flex items-center gap-3 px-4 py-3">
          <Avatar className="h-13 w-13 rounded-full shadow-lg">
            <AvatarImage
              src="https://i.pinimg.com/736x/ff/e7/3f/ffe73ffe75682fec82ccd320ccb43fe9.jpg"
              alt="José Almirante"
              className="object-cover"
            />
            <AvatarFallback className="text-xl">JA</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start leading-tight text-left">
            <span className="text-base font-semibold">José Almirante</span>
            <span
              className="text-sm font-normal max-w-55 overflow-hidden truncate"
              style={{ textOverflow: "clip" }}
              title="jose@gmail.com"
            >
              emmanuel03250310@gmail.com
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary/15" />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="w-4 h-4 mr-2" />
            Ver Perfil
            <DropdownMenuShortcut>⇧{cmdOrCtrl}+P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Pencil className="w-4 h-4 mr-2" />
            Editar Perfil
            <DropdownMenuShortcut>{cmdOrCtrl}+E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator className="bg-primary/15" /> */}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Languages className="w-4 h-4 mr-2" />
            Cambiar Idioma
            <DropdownMenuShortcut>{cmdOrCtrl}+L</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Moon className="w-4 h-4 mr-2" />
            Cambiar Tema
            <DropdownMenuShortcut>{cmdOrCtrl}+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator className="bg-primary/15" /> */}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings className="w-4 h-4 mr-2" />
            Configuración
            <DropdownMenuShortcut>{cmdOrCtrl}+S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Shield className="w-4 h-4 mr-2" />
            Privacidad y Seguridad
            <DropdownMenuShortcut>{cmdOrCtrl}+P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-primary/15" />
        <DropdownMenuItem variant="destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
          <DropdownMenuShortcut>⇧{cmdOrCtrl}+Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AdminUserMenu;
