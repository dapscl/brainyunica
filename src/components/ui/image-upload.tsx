import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  bucket: string;
  currentImageUrl?: string;
  onImageUrlChange: (url: string) => void;
  label?: string;
  error?: string;
}

export const ImageUpload = ({
  bucket,
  currentImageUrl,
  onImageUrlChange,
  label = "Logo",
  error,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo no puede superar los 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

      onImageUrlChange(data.publicUrl);
      toast.success("Imagen cargada exitosamente");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("Error al cargar la imagen");
      setPreviewUrl(currentImageUrl || "");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl("");
    onImageUrlChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {previewUrl ? (
        <div className="relative w-full max-w-xs">
          <div className="aspect-video rounded-lg border overflow-hidden bg-muted">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-8 w-8"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors ${
            error ? "border-destructive" : "border-muted-foreground/25"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {uploading ? "Cargando..." : "Haz clic para seleccionar una imagen"}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP (máx. 5MB)
              </p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={uploading}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
