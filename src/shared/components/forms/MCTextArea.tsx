import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Textarea } from "@/shared/ui/textarea";
interface MCTextAreaProps {
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  status?: "default" | "error" | "success" | "warning" | "loading";
  statusMessage?: string;
}

function MCTextArea({
  name,
  label,
  placeholder,
  value,
  onChange,
  className,
  required = false,
  disabled = false,
  rows = 4,
  status = "default",
  statusMessage,
}: MCTextAreaProps) {
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
        return "border-primary/50 focus:border-primary/50";
    }
  };

  return (
    <div className="w-full flex flex-col mb-4 px-0 sm:px-2">
      {label && (
        <label
          htmlFor={name}
          className="text-left text-base sm:text-lg text-primary mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Textarea
        id={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        {...(() => {
          const field = register(name);
          return {
            ...field,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
              field.onChange(e);
              onChange?.(e);
            },
          };
        })()}
        className={cn(
          "w-full rounded-3xl border focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 p-3 resize-none text-primary",
          handleStatusColor(),
          className
        )}
        value={value}
      />
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

export default MCTextArea;
