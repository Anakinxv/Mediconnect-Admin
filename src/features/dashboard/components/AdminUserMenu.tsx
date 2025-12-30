import { useState, useCallback, useRef } from "react";
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
  Monitor,
} from "lucide-react";

import { useTranslation } from "react-i18next";
import { flushSync } from "react-dom";
import flagSpain from "@/assets/flag-spain.png";
import flagUSA from "@/assets/flag-usa.png";
import flagFrance from "@/assets/flag-france.png";
import flagHaiti from "@/assets/flag-haiti.png";
import flagItaly from "@/assets/flag-italy.png";
import flagJapan from "@/assets/flag-japan.png";
import flagPortugal from "@/assets/flag-portugal.png";
import flagChina from "@/assets/flag-china.png";
import { useAppStore } from "@/stores/useAppStore";
import type { Theme } from "@/stores/useGlobalUISlice";
import { cn } from "@/lib/utils";

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

const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: "light",
    label: "Claro",
    icon: <Sun className="w-4 h-4 text-yellow-500" />,
  },
  {
    value: "dark",
    label: "Oscuro",
    icon: <Moon className="w-4 h-4 text-primary" />,
  },
  {
    value: "system",
    label: "Sistema",
    icon: <Monitor className="w-4 h-4 text-secondary" />,
  },
];

export function AdminUserMenu() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("dashboard");
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const themeButtonRef = useRef<HTMLDivElement>(null);

  const selectedLang = languages.find((l) => l.code === language);
  const currentThemeOption = themeOptions.find((t) => t.value === theme);

  const handleThemeChange = useCallback(
    async (newTheme: Theme, event: React.MouseEvent) => {
      const target = event.currentTarget as HTMLElement;

      // Check if View Transitions API is supported
      if (!document.startViewTransition) {
        setTheme(newTheme);
        return;
      }

      await document.startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme);
        });
      }).ready;

      const { top, left, width, height } = target.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    },
    [setTheme]
  );

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
          {/* Submenú de tema mejorado */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              className="cursor-pointer"
              ref={themeButtonRef}
            >
              <Sun className="w-4 h-4 mr-2" />
              {t("userMenu.changeTheme")}
              <span className="ml-auto flex items-center gap-1.5 text-xs text-foreground/60">
                {currentThemeOption?.icon}
                {currentThemeOption?.label}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-56 p-1 bg-card border-border">
              {themeOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={(e) => handleThemeChange(option.value, e)}
                  className={cn(
                    "cursor-pointer flex items-center gap-2 focus:outline-none focus:ring-0 relative",
                    theme === option.value && "bg-accent text-primary"
                  )}
                >
                  {theme === option.value && (
                    <span className="absolute left-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                  <span className="ml-4">{option.icon}</span>
                  {option.label}
                </DropdownMenuItem>
              ))}
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
