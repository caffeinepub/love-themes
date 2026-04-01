import { Upload } from "lucide-react";
import { useRef, useState } from "react";

interface FileUploadProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  accept?: string;
  label?: string;
  className?: string;
  "data-ocid"?: string;
}

export default function FileUpload({
  value,
  onChange,
  accept = "image/*",
  label = "Upload Image",
  className = "",
  "data-ocid": ocid,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          onChange(result);
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <button
        type="button"
        data-ocid={ocid}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-pink-50 transition-colors w-full"
        style={{ borderColor: "oklch(0.75 0.08 5)" }}
      >
        {value ? (
          <img
            src={value}
            alt="Preview"
            className="max-h-32 mx-auto rounded-lg object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <Upload size={20} style={{ color: "oklch(0.56 0.12 5)" }} />
            <span className="text-sm" style={{ color: "oklch(0.45 0.04 5)" }}>
              {uploading ? "Uploading..." : label}
            </span>
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-red-400 hover:text-red-600 transition-colors"
        >
          Remove image
        </button>
      )}
    </div>
  );
}
