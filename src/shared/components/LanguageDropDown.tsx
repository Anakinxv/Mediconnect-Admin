import { ChevronDownIcon } from "../ui/chevron-down";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAppStore } from "@/stores/useAppStore";
import flagSpain from "@/assets/flag-spain.png";
import flagUSA from "@/assets/flag-usa.png";
import flagFrance from "@/assets/flag-france.png";
import flagHaiti from "@/assets/flag-haiti.png";
import flagItaly from "@/assets/flag-italy.png";
import flagJapan from "@/assets/flag-japan.png";
import flagPortugal from "@/assets/flag-portugal.png";
import flagChina from "@/assets/flag-china.png";

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
            <img
              src={selectedLang?.flag}
              alt={selectedLang?.label}
              className="w-5 h-5 rounded-full focus:outline-none"
            />
            {showLabel && (
              <span className="font-medium text-lg md:text-xl">
                {selectedLang?.label}
              </span>
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
                <img
                  src={lang.flag}
                  alt={lang.label}
                  className="w-5 h-5 rounded-full"
                />
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
