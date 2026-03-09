import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { Upload, File, Image, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
interface MCFileInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  showPreview?: boolean;
}

function MCFileInput({
  name,
  label,
  placeholder = "Seleccionar archivo",
  className,
  required = false,
  disabled = false,
  accept = "image/*,.pdf,.doc,.docx",
  multiple = false,
  maxSize = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
  showPreview = true,
}: MCFileInputProps) {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];

    fileArray.forEach((file) => {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        console.error(`Tipo de archivo no permitido: ${file.type}`);
        return;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        console.error(`Archivo muy grande: ${file.name}`);
        return;
      }

      validFiles.push(file);
    });

    if (multiple) {
      setSelectedFiles([...selectedFiles, ...validFiles]);
      setValue(name, [...selectedFiles, ...validFiles]);
    } else {
      setSelectedFiles(validFiles.slice(0, 1));
      setValue(name, validFiles[0] || null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setValue(name, multiple ? newFiles : null);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <Image size={20} />;
    }
    return <File size={20} />;
  };

  const isImage = (fileType: string) => fileType.startsWith("image/");

  return (
    <div className="w-full flex flex-col mb-4">
      {/* Label */}
      {label && (
        <div className="flex flex-row justify-between items-center mb-2 gap-2">
          <span className="text-left text-base sm:text-lg text-primary">
            {label}
          </span>
          {required && <span className="text-red-500">*</span>}
        </div>
      )}

      {/* File Input Area */}
      <div
        className={cn(
          "relative border-2 border-dashed border-primary/30 rounded-4xl p-6 text-center transition-all duration-300 hover:border-primary/50 cursor-pointer",
          dragActive && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Input
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          {...register(name)}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <Upload className="text-primary/60" size={32} />
          <p className="text-primary/80 font-medium">{placeholder}</p>
          <p className="text-sm text-primary/60">
            Arrastra y suelta o haz clic para seleccionar
          </p>
          <p className="text-xs text-primary/40">
            Máximo {maxSize}MB •{" "}
            {allowedTypes.join(", ").replace(/image\/|application\//g, "")}
          </p>
        </div>
      </div>

      {/* File Preview */}
      {showPreview && selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-accent rounded-2xl"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-primary/60">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {isImage(file.type) && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {errors[name] && (
        <span className="text-red-500 text-sm mt-1">
          {String(errors[name]?.message)}
        </span>
      )}
    </div>
  );
}

export default MCFileInput;
