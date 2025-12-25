import { ArrowLeftIcon } from "@/shared/ui/arrow-left";
import { useNavigate } from "react-router-dom";

interface MCBackButtonProps {
  onClick?: () => void;
  size?: number;
  className?: string;
  disabled?: boolean; // Añadido
}

function MCBackButton({
  onClick,
  size = 24,
  className = "",
  disabled = false, // Añadido
}: MCBackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={onClick ? onClick : () => navigate(-1)}
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
      disabled={disabled} // Añadido
    >
      <ArrowLeftIcon size={size} />
    </button>
  );
}

export default MCBackButton;
