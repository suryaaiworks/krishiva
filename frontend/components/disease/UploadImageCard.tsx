"use client";

import * as React from "react";
import { Camera, Upload, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UploadImageCardProps {
  onImageSelected: (file: File | null) => void;
  className?: string;
  animate?: boolean;
}

export function UploadImageCard({
  onImageSelected,
  className,
  animate = true,
}: UploadImageCardProps) {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [uploadDate, setUploadDate] = React.useState("");
  const [fileSize, setFileSize] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      year: "numeric", 
      month: "short", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setSelectedImage(URL.createObjectURL(selectedFile));
      setFileSize(formatFileSize(selectedFile.size));
      setUploadDate(getFormattedDate());
      onImageSelected(selectedFile);
      
      // Simulate upload progress
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 70);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setSelectedImage(null);
    setFile(null);
    setProgress(0);
    setUploadDate("");
    setFileSize("");
    onImageSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = () => {
    if (!selectedImage || !file) return;
    const a = document.createElement("a");
    a.href = selectedImage;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card
      title=""
      animate={animate}
      className={cn(
        "p-6 flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary/50 transition-all duration-300 bg-card/40 overflow-hidden rounded-card",
        selectedImage && "border-solid border-border cursor-default",
        !selectedImage && "cursor-pointer",
        className
      )}
      onClick={!selectedImage ? triggerFileInput : undefined}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {selectedImage && file ? (
        <div className="w-full space-y-4">
          {/* Progress Indicator */}
          {progress < 100 && (
            <div className="w-full space-y-2 py-4 text-left">
              <div className="flex justify-between items-center text-xs text-muted-foreground font-semibold">
                <span>Uploading crop image...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-100 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Uploaded Card Preview */}
          {progress === 100 && (
            <div className="flex flex-col md:flex-row gap-5 p-4 bg-muted/20 border border-border/60 rounded-card items-center md:items-start w-full text-left">
              {/* Image Preview Thumbnail */}
              <div className="relative w-32 h-32 md:w-28 md:h-28 shrink-0 rounded-card overflow-hidden border border-border/80 shadow-inner">
                <img
                  src={selectedImage}
                  alt="Selected crop preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* File Details & Actions */}
              <div className="flex-1 space-y-4 w-full text-center md:text-left">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-foreground truncate max-w-[280px] mx-auto md:mx-0">
                    {file.name}
                  </h4>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 text-[10px] text-muted-foreground font-medium">
                    <span>{fileSize}</span>
                    <span className="text-border">•</span>
                    <span>Uploaded: {uploadDate}</span>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedImage, "_blank")}
                    className="h-8 text-[11px] font-bold px-3 rounded-btn border-border/80 hover:bg-muted cursor-pointer"
                  >
                    View
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={triggerFileInput}
                    className="h-8 text-[11px] font-bold px-3 rounded-btn border-border/80 hover:bg-muted cursor-pointer"
                  >
                    Replace
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="h-8 text-[11px] font-bold px-3 rounded-btn border-border/80 hover:bg-muted cursor-pointer"
                  >
                    Download
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                    className="h-8 text-[11px] font-bold px-3 rounded-btn bg-destructive hover:bg-destructive/90 cursor-pointer"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center py-5 text-center space-y-3.5 w-full">
          <div className="relative w-full max-w-[200px] h-20 flex items-center justify-center">
            {/* Ambient pulsing backdrop */}
            <div className="absolute h-16 w-16 rounded-full bg-primary/5 dark:bg-primary/10 animate-pulse pointer-events-none" />
            <div className="absolute h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/25 pointer-events-none" />
            
            {/* Custom agriculture leaf + camera outline illustration */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-primary relative z-10">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" fill="rgba(34,197,94,0.15)" />
            </svg>
            
            {/* Small leaf emblem floating next to camera */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="absolute top-2 right-12 w-4.5 h-4.5 text-amber-500 animate-pulse">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 21 3c-1.5 4-2 5.5-3.1 11.2A7 7 0 0 1 11 20z" />
            </svg>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-bold text-foreground">
              Take a photo or upload crop image
            </p>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Supports JPEG, PNG up to 10MB. AI will analyze crop condition for disease detection.
            </p>
          </div>
          <Button type="button" variant="default" className="text-xs px-4 h-9 rounded-btn cursor-pointer">
            Choose Photo
          </Button>
        </div>
      )}
    </Card>
  );
}
