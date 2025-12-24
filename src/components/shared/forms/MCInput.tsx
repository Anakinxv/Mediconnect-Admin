import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { EyeIcon } from "@/components/ui/eye";
import { EyeOffIcon } from "@/components/ui/eye-off";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";

interface MCInputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  showPasswordToggle?: boolean;
  size?: "small" | "medium" | "large";
  status?: "default" | "error" | "success" | "warning" | "loading";
  statusMessage?: string;
}

function MCInput({
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  className,
  required = false,
  disabled = false,
  showPasswordToggle = false,
  size = "medium",
  status = "default",
  statusMessage,
}: MCInputProps) {
  const PasswordVisibility = useAppStore((state) => state.PasswordVisibility);
  const SetPasswordVisibility = useAppStore(
    (state) => state.SetPasswordVisibility
  );

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const handleStatusColor = () => {
    switch (status) {
      case "error":
        return "border-red-500 focus:border-red-500";
      case "success":
        return "border-green-500 focus:border-green-500";
      case "warning":
        return "border-yellow-500 focus:border-yellow-500";
      case "loading":
        return "border-blue-500 focus:border-blue-500";
      default:
        return "border-primary/50 focus:border-primary";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-10 px-3 text-sm";
      case "large":
        return "h-16 px-6 text-lg";
      default:
        return "h-12 sm:h-[60px] px-3 sm:px-5";
    }
  };

  const handlePasswordToggle = () => {
    SetPasswordVisibility(!PasswordVisibility);
  };

  return (
    <div className="w-full flex flex-col mb-4 px-0 sm:px-2">
      {/* Label and Password Toggle */}
      {label && (
        <div className="flex flex-row justify-between items-center mb-1 gap-2">
          <label
            htmlFor={name}
            className="text-left text-base sm:text-lg text-primary"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {(type === "password" || showPasswordToggle) && (
            <Button
              type="button"
              variant="ghost"
              className=" rounded-2xl text-gray-500 px-2 py-1"
              onClick={handlePasswordToggle}
            >
              {PasswordVisibility ? (
                <span className="flex items-center gap-1">
                  <EyeOffIcon size={18} />
                  <p className="hidden sm:inline">Ocultar</p>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <EyeIcon size={18} />
                  <p className="hidden sm:inline">Mostrar</p>
                </span>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Input Container */}
      <div className="relative">
        <Input
          id={name}
          placeholder={placeholder}
          type={type === "password" && PasswordVisibility ? "text" : type}
          required={required}
          value={value}
          disabled={disabled}
          {...(() => {
            const field = register(name);
            return {
              ...field,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                field.onChange(e);
                onChange?.(e);
              },
            };
          })()}
          className={cn(
            "w-full   rounded-4xl border  focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-primary placeholder:text-md",
            getSizeClasses(),
            handleStatusColor(),
            className
          )}
        />
      </div>

      {/* Status Message */}
      {statusMessage && (
        <span
          className={cn(
            "text-sm mt-1 block",
            status === "success"
              ? "text-green-500"
              : status === "error"
              ? "text-red-500"
              : status === "warning"
              ? "text-yellow-500"
              : status === "loading"
              ? "text-blue-500"
              : "text-gray-500"
          )}
        >
          {statusMessage}
        </span>
      )}

      {errors[name] && (
        <span className="text-red-500 text-sm mt-1">
          {String(errors[name]?.message)}
        </span>
      )}
    </div>
  );
}

export default MCInput;
