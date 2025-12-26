import { Button } from "@/shared/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";
type MediButtonProps = {
  children?: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "delete"
    | "success"
    | "warning"
    | "link"
    | "tercero";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  size?: "s" | "m" | "l" | "xl"; // Agregado xl
};

function MCButton({
  variant = "primary",
  onClick,
  disabled,
  children,
  className,
  type = "button",
  icon,
  iconPosition = "left",
  size = "l", // Default medium
}: MediButtonProps) {
  const baseStyles =
    "font-medium rounded-full transition-colors transition-opacity transition-transform duration-200 focus:outline-none active:scale-99";

  const sizeStyles: Record<string, string> = {
    s: "px-4 py-2 text-sm", // pequeño
    m: "px-6 py43 text-base md:px-8 md:py-6 md:text-lg", // intermedio real
    l: "px-8 py-5 text-lg md:px-10 md:py-7 md:text-xl", // era el m anterior
    xl: "px-12 py-7 text-xl md:px-16 md:py-10 md:text-2xl", // era el l anterior
  };

  const variants: Record<string, string> = {
    primary: `
      bg-primary text-background border border-transparent
      hover:bg-primary/90 hover:opacity-90
      active:bg-primary/80 active:opacity-80
    `,
    secondary: `
      bg-transparent border border-primary text-primary
      hover:bg-primary/10 hover:opacity-90
      active:bg-primary/20 active:opacity-80
    `,
    delete: `
      bg-red-600 text-white border border-red-600
      hover:bg-red-700 hover:opacity-90
      active:bg-red-800 active:opacity-80
    `,
    success: `
      bg-green-600 text-white border border-green-600
      hover:bg-green-700 hover:opacity-90
      active:bg-green-800 active:opacity-80
    `,
    warning: `
      bg-yellow-400 text-black border border-yellow-400
      hover:bg-yellow-500 hover:opacity-90
      active:bg-yellow-600 active:opacity-80
    `,
    link: `
      bg-transparent border-none text-primary underline underline-offset-2 px-0 py-0
      hover:text-primary/80 hover:opacity-80
      active:text-primary/60 active:opacity-60
      shadow-none
    `,
    tercero: `
      bg-[var(--color-bg-btn-secondary)] text-black border border-[var(--color-bg-btn-secondary)]
      hover:bg-[var(--color-bg-btn-secondary)]/90 hover:opacity-90
      active:bg-[var(--color-bg-btn-secondary)]/80 active:opacity-80
    `,
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${
        variants[variant] || variants.primary
      } ${className || ""}`}
      icon={icon}
      iconPosition={iconPosition}
    >
      {children}
    </Button>
  );
}

export default MCButton;
