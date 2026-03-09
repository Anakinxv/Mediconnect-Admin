import { ArrowLeftIcon } from "@/shared/ui/arrow-left";

interface MCBackButtonProps {
  onClick?: () => void;
  size?: number;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "background";
}

function MCBackButton({
  onClick,
  size = 24,
  className = "",
  disabled = false,
  variant = "default",
}: MCBackButtonProps) {
  const bgClass =
    variant === "background"
      ? "bg-background"
      : "bg-[var(--color-bg-btn-secondary)]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        ${bgClass} text-[var(--color-primary)] 
        flex items-center justify-center
        rounded-full border border-transparent
        w-[40px] h-[40px] md:w-[56px] md:h-[56px]
        hover:opacity-90 active:opacity-80
        active:scale-95 active:shadow-inner
        transition-all
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
        ${className}
      `}
      style={{ aspectRatio: "1/1" }}
      disabled={disabled}
    >
      <ArrowLeftIcon size={size} />
    </button>
  );
}

export default MCBackButton;
