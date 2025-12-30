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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  Sun,
  Laptop2,
  Check,
} from "lucide-react";

import { useTranslation } from "react-i18next";
import flagSpain from "@/assets/flag-spain.png";
import flagUSA from "@/assets/flag-usa.png";
import flagFrance from "@/assets/flag-france.png";
import flagHaiti from "@/assets/flag-haiti.png";
import flagItaly from "@/assets/flag-italy.png";
import flagJapan from "@/assets/flag-japan.png";
import flagPortugal from "@/assets/flag-portugal.png";
import flagChina from "@/assets/flag-china.png";
import { useAppStore } from "@/stores/useAppStore";

const isMac =
  typeof window !== "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const cmdOrCtrl = isMac ? "⌘" : "Ctrl";

const languages = [
  { code: "es", label: "Español", flag: flagSpain },
  { code: "en", label: "English", flag: flagUSA },
  { code: "fr", label: "Français", flag: flagFrance },
  { code: "ht", label: "Kreyòl", flag: flagHaiti },
  { code: "it", label: "Italiano", flag: flagItaly },
  { code: "ja", label: "日本語", flag: flagJapan },
  { code: "pt", label: "Português", flag: flagPortugal },
  { code: "zh", label: "中文", flag: flagChina },
];

const themes = [
  {
    value: "light",
    label: "Claro",
    icon: <Sun className="w-4 h-4 mr-2 text-yellow-500" />,
  },
  {
    value: "dark",
    label: "Oscuro",
    icon: <Moon className="w-4 h-4 mr-2 text-primary" />,
  },
  {
    value: "system",
    label: "Sistema",
    icon: <Laptop2 className="w-4 h-4 mr-2 text-secondary" />,
  },
];

export function AdminUserMenu() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("dashboard");
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const selectedLang = languages.find((l) => l.code === language);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-3 outline-none border-none shadow-none ring-0 focus:ring-0 h-fit transition-colors ${
            open ? "bg-accent/70 rounded-full" : ""
          }`}
        >
          <Avatar className="h-14 w-14 rounded-full shadow-lg transition-all">
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
                {t("userMenu.admin")}
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
            {t("userMenu.viewProfile")}
            <DropdownMenuShortcut>⇧{cmdOrCtrl}+P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Pencil className="w-4 h-4 mr-2" />
            {t("userMenu.editProfile")}
            <DropdownMenuShortcut>{cmdOrCtrl}+E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          {/* Submenú de idiomas */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Languages className="w-4 h-4 mr-2" />
              {t("userMenu.changeLanguage")}
              <span className="ml-2 flex items-center gap-1">
                <img
                  src={selectedLang?.flag}
                  alt={selectedLang?.label}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-xs">{selectedLang?.label}</span>
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-56 p-1">
              <DropdownMenuRadioGroup
                value={language}
                onValueChange={setLanguage}
              >
                {languages.map((lang) => (
                  <DropdownMenuRadioItem
                    key={lang.code}
                    value={lang.code}
                    className={`focus:outline-none focus:ring-0 ${
                      language === lang.code ? "text-primary" : ""
                    }`}
                  >
                    <img
                      src={lang.flag}
                      alt={lang.label}
                      className="w-5 h-5 rounded-full"
                    />
                    {lang.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          {/* Submenú de tema */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Moon className="w-4 h-4 mr-2" />
              {t("userMenu.changeTheme")}
              <span className="ml-2 flex items-center gap-1">
                {themes.find((th) => th.value === theme)?.icon}
                <span className="text-xs">
                  {themes.find((th) => th.value === theme)?.label}
                </span>
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-56 p-1">
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) =>
                  setTheme(value as "light" | "dark" | "system")
                }
              >
                {themes.map((th) => (
                  <DropdownMenuRadioItem
                    key={th.value}
                    value={th.value}
                    className={`focus:outline-none focus:ring-0 ${
                      theme === th.value ? "text-primary" : ""
                    }`}
                  >
                    {th.icon}
                    {th.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings className="w-4 h-4 mr-2" />
            {t("userMenu.settings")}
            <DropdownMenuShortcut>{cmdOrCtrl}+S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Shield className="w-4 h-4 mr-2" />
            {t("userMenu.privacy")}
            <DropdownMenuShortcut>{cmdOrCtrl}+P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-primary/15" />
        <DropdownMenuItem variant="destructive">
          <LogOut className="w-4 h-4 mr-2" />
          {t("userMenu.logout")}
          <DropdownMenuShortcut>⇧{cmdOrCtrl}+Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AdminUserMenu;
