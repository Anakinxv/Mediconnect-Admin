import { ChevronDownIcon } from "@/shared/ui/chevron-down";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useAppStore } from "@/stores/useAppStore";

const languages = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ht", label: "Kreyòl" },
  { code: "it", label: "Italiano" },
  { code: "ja", label: "日本語" },
  { code: "pt", label: "Português" },
  { code: "zh", label: "中文" },
];

type LanguageDropDownProps = {
  showLabel?: boolean;
  buttonBg?: string;
  buttonText?: string;
  borderColor?: string;
  className?: string;
};

function LanguageDropDown({
  showLabel = false,
  buttonBg = "bg-white",
  buttonText = "text-primary",
  borderColor = "border-primary",
  className = "px-3 py-2", // tamaño compacto por defecto
}: LanguageDropDownProps) {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const selectedLang = languages.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex ${
            showLabel ? "justify-center" : ""
          } items-center gap-2 rounded-full border transition focus:outline-none
            ${buttonBg} ${buttonText} ${borderColor} ${className}
            hover:-translate-y-0.5 hover:scale-105 hover:opacity-95
            active:scale-97 active:translate-y-0 active:opacity-90
            disabled:opacity-50 disabled:cursor-not-allowed
            motion-safe:transition-transform`}
        >
          <span
            className={`flex items-center gap-2 w-full ${
              showLabel ? "justify-center" : ""
            }`}
          >
            {/* Quitar la imagen de la bandera */}
            {showLabel && (
              <span className="font-medium text-lg md:text-xl">
                {selectedLang?.label}
              </span>
            )}
            {!showLabel && (
              <span className="font-medium">{selectedLang?.label}</span>
            )}
          </span>
          <ChevronDownIcon size={20} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="font-medium">
          Selecciona idioma
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
          {languages.map((lang) => (
            <DropdownMenuRadioItem
              key={lang.code}
              value={lang.code}
              className={`focus:outline-none focus:ring-0 ${
                language === lang.code ? "text-primary" : ""
              }`}
            >
              <span className="flex items-center gap-2">
                {/* Quitar la imagen de la bandera */}
                {lang.label}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageDropDown;
