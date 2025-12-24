import { Button } from "@/shared/ui/button";

type MediButtonProps = {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "delete" | "success" | "warning" | "link";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

function MCButton({
  variant = "primary",
  onClick,
  disabled,
  children,
  className,
  type = "button",
}: MediButtonProps) {
  const baseStyles =
    "px-8 py-5 text-lg md:px-10 md:py-7 md:text-xl font-medium rounded-full transition-colors transition-opacity transition-transform duration-200 focus:outline-none active:scale-99";

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
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        className || ""
      }`}
    >
      {children}
    </Button>
  );
}

export default MCButton;
