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
  Monitor,
  X,
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
import { useIsMobile } from "@/lib/hooks/useIsMobile";
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
    icon: <Sun className="w-4 h-4 text-primary" />,
  },
  {
    value: "dark",
    label: "Oscuro",
    icon: <Moon className="w-4 h-4 text-primary" />,
  },
  {
    value: "system",
    label: "Sistema",
    icon: <Monitor className="w-4 h-4 text-primary" />,
  },
];

export function AdminUserMenu() {
  const [open, setOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState<string | null>(null);
  const { t } = useTranslation("dashboard");
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const themeButtonRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    if (isMobile) {
      setSubMenuOpen(null);
    }
  };

  const handleThemeChangeAndClose = (
    themeValue: Theme,
    event: React.MouseEvent
  ) => {
    handleThemeChange(themeValue, event);
    if (isMobile) {
      setSubMenuOpen(null);
    }
  };

  // Mobile sub-menu component
  const MobileSubMenu = ({
    title,
    children,
    isOpen,
    onClose,
  }: {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    );
  };

  const currentLang = languages.find((lang) => lang.code === language);
  const currentThemeOption = themeOptions.find(
    (option) => option.value === theme
  );

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`flex items-center  justify-center gap-3 rounded-full w-full  bg-transparent hover:bg-accent/80   outline-none border-none shadow-none ring-0 focus:ring-0 h-fit transition-colors ${
              open ? "bg-primary rounded-full text-primary" : ""
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
                <span
                  className={`text-base font-semibold ${
                    !open ? "text-primary" : "text-background"
                  }`}
                >
                  José Almirante
                </span>
                <span
                  className={`text-sm font-normal max-w-35 truncate ${
                    !open ? "text-primary" : "text-background"
                  }`}
                  style={{ textOverflow: "clip" }}
                  title="jose@gmail.com"
                >
                  {t("userMenu.admin")}
                </span>
              </div>
              <div className="flex flex-col h-full w-full items-start justify-start">
                <ChevronDown
                  className={`w-7 h-7 mt-0.5 stroke-2.5 transition-transform duration-200 ${
                    open ? "rotate-180 text-background" : "text-primary"
                  }`}
                />
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className={cn(
            "rounded-2xl bg-background border border-primary/20",
            isMobile
              ? "w-[calc(100vw-2rem)] max-w-sm" // Better mobile width
              : "w-80"
          )}
          align={isMobile ? "end" : "end"} // Keep consistent alignment
          side="bottom"
          sideOffset={isMobile ? 12 : 8} // More space on mobile
          avoidCollisions={true} // Prevent dropdown from going off-screen
        >
          <DropdownMenuLabel
            className={cn(
              "flex items-center gap-3",
              isMobile ? "px-3 py-3" : "px-4 py-3"
            )}
          >
            <Avatar
              className={cn(
                "rounded-full shadow-lg",
                isMobile ? "h-10 w-10" : "h-13 w-13"
              )}
            >
              <AvatarImage
                src="https://i.pinimg.com/736x/ff/e7/3f/ffe73ffe75682fec82ccd320ccb43fe9.jpg"
                alt="José Almirante"
                className="object-cover"
              />
              <AvatarFallback className={cn(isMobile ? "text-sm" : "text-xl")}>
                JA
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start leading-tight text-left min-w-0 flex-1">
              <span
                className={cn(
                  "font-semibold",
                  isMobile ? "text-sm" : "text-base"
                )}
              >
                José Almirante
              </span>
              <span
                className={cn(
                  "font-normal overflow-hidden truncate",
                  isMobile ? "text-xs max-w-40" : "text-sm max-w-55"
                )}
                style={{ textOverflow: "clip" }}
                title="emmanuel03250310@gmail.com"
              >
                emmanuel03250310@gmail.com
              </span>
            </div>
            {/* Close button for mobile */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                className="p-1 h-6 w-6 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-primary/15" />

          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              {t("userMenu.viewProfile")}
              {!isMobile && (
                <DropdownMenuShortcut>⇧{cmdOrCtrl}+P</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="w-4 h-4 mr-2" />
              {t("userMenu.editProfile")}
              {!isMobile && (
                <DropdownMenuShortcut>{cmdOrCtrl}+E</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuGroup>
            {/* Language Menu */}
            {isMobile ? (
              <DropdownMenuItem
                onClick={() => setSubMenuOpen("language")}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Languages className="w-4 h-4 mr-2" />
                  {t("userMenu.changeLanguage")}
                </div>
                <div className="flex items-center gap-2">
                  {currentLang && (
                    <img
                      src={currentLang.flag}
                      alt={currentLang.label}
                      className="w-4 h-4 rounded-full"
                    />
                  )}
                  <ChevronDown className="w-3 h-3" />
                </div>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Languages className="w-4 h-4 mr-2" />
                  {t("userMenu.changeLanguage")}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent
                  className="w-56 p-1 bg-background border border-primary/20 rounded-xl shadow-lg"
                  sideOffset={8}
                  alignOffset={-4}
                >
                  <DropdownMenuRadioGroup
                    value={language}
                    onValueChange={setLanguage}
                  >
                    {languages.map((lang) => (
                      <DropdownMenuRadioItem
                        key={lang.code}
                        value={lang.code}
                        className={cn(
                          "focus:outline-none focus:ring-0",
                          language === lang.code ? "text-primary" : ""
                        )}
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
            )}

            {/* Theme Menu */}
            {isMobile ? (
              <DropdownMenuItem
                onClick={() => setSubMenuOpen("theme")}
                className="flex items-center justify-between"
                ref={themeButtonRef}
              >
                <div className="flex items-center">
                  <Sun className="w-4 h-4 mr-2" />
                  {t("userMenu.changeTheme")}
                </div>
                <div className="flex items-center gap-2">
                  {currentThemeOption?.icon}
                  <ChevronDown className="w-3 h-3" />
                </div>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  className="cursor-pointer"
                  ref={themeButtonRef}
                >
                  <Sun className="w-4 h-4 mr-2" />
                  {t("userMenu.changeTheme")}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent
                  className="w-56 p-1 bg-background border border-primary/20 rounded-xl shadow-lg"
                  sideOffset={8}
                  alignOffset={-4}
                >
                  {themeOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={(e) => handleThemeChange(option.value, e)}
                      className={cn(
                        "cursor-pointer flex items-center gap-2 focus:outline-none focus:ring-0 relative",
                        theme === option.value && "text-primary"
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
            )}
          </DropdownMenuGroup>

          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              {t("userMenu.settings")}
              {!isMobile && (
                <DropdownMenuShortcut>{cmdOrCtrl}+S</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="w-4 h-4 mr-2" />
              {t("userMenu.privacy")}
              {!isMobile && (
                <DropdownMenuShortcut>{cmdOrCtrl}+P</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-primary/15" />

          <DropdownMenuItem variant="destructive">
            <LogOut className="w-4 h-4 mr-2" />
            {t("userMenu.logout")}
            {!isMobile && (
              <DropdownMenuShortcut>⇧{cmdOrCtrl}+Q</DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mobile Sub-menus */}
      {isMobile && (
        <>
          <MobileSubMenu
            title={t("userMenu.changeLanguage")}
            isOpen={subMenuOpen === "language"}
            onClose={() => setSubMenuOpen(null)}
          >
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                    "hover:bg-accent",
                    language === lang.code
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "border border-transparent"
                  )}
                >
                  <img
                    src={lang.flag}
                    alt={lang.label}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium">{lang.label}</span>
                  {language === lang.code && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </MobileSubMenu>

          <MobileSubMenu
            title={t("userMenu.changeTheme")}
            isOpen={subMenuOpen === "theme"}
            onClose={() => setSubMenuOpen(null)}
          >
            <div className="space-y-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={(e) => handleThemeChangeAndClose(option.value, e)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                    "hover:bg-accent",
                    theme === option.value
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "border border-transparent"
                  )}
                >
                  {option.icon}
                  <span className="font-medium">{option.label}</span>
                  {theme === option.value && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </MobileSubMenu>
        </>
      )}
    </>
  );
}

export default AdminUserMenu;
