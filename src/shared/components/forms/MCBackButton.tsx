import { ArrowLeftIcon } from "@/shared/ui/arrow-left";

interface MCBackButtonProps {
  onClick?: () => void;
  size?: number;
  className?: string;
  disabled?: boolean;
}

function MCBackButton({
  onClick,
  size = 24,
  className = "",
  disabled = false,
}: MCBackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        bg-[var(--color-bg-btn-secondary)] text-[var(--color-primary)] 
        flex items-center justify-center
        rounded-full border border-primary/3
        w-[40px] h-[40px] md:w-[56px] md:h-[56px]
        hover:bg-[var(--color-bg-btn-secondary)]/80 hover:opacity-90
        active:bg-[var(--color-bg-btn-secondary)]/60 active:opacity-80
        transition-all
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
