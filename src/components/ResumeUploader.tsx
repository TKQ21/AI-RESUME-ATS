import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ResumeUploaderProps {
  onFileSelect: (file: File) => void;
  file: File | null;
  onClear: () => void;
  isLoading?: boolean;
}

export function ResumeUploader({ onFileSelect, file, onClear, isLoading }: ResumeUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && isValidFile(droppedFile)) {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect]
  );

  const isValidFile = (f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    return ext === "pdf" || ext === "docx" || ext === "doc";
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative rounded-xl border-2 border-dashed transition-all duration-300 ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : file
          ? "border-success/50 bg-success/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      } ${isLoading ? "pointer-events-none opacity-60" : ""}`}
    >
      <AnimatePresence mode="wait">
        {file ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={onClear}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          <motion.label
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 p-8 cursor-pointer"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">
                Resume upload करें
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                PDF या DOCX file drag करें या click करें
              </p>
            </div>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && isValidFile(f)) onFileSelect(f);
              }}
            />
          </motion.label>
        )}
      </AnimatePresence>
    </div>
  );
}
