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
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      onImageSelected(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setSelectedImage(null);
    onImageSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card
      title=""
      animate={animate}
      className={cn(
        "p-6 flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary/50 transition-colors bg-card/40 cursor-pointer overflow-hidden",
        selectedImage && "border-solid border-border",
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

      {selectedImage ? (
        <div className="relative w-full aspect-video rounded-btn overflow-hidden border border-border bg-muted flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedImage}
            alt="Selected crop preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileInput}
              className="bg-background hover:bg-muted text-foreground cursor-pointer"
            >
              <Camera className="mr-1.5 h-4 w-4" />
              Retake
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="cursor-pointer"
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-6 text-center space-y-4">
          <div className="flex gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Camera className="h-6 w-6" />
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Upload className="h-6 w-6" />
            </div>
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
