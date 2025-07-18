import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface ImageUploaderProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

/**
 * ImageUploader Component
 * Beautiful drag-and-drop interface for multiple image uploads
 * with preview thumbnails and nature-inspired styling
 */
export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 10
}) => {
  // Handle file drop and selection
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    const totalFiles = images.length + imageFiles.length;
    
    if (totalFiles > maxImages) {
      const remainingSlots = maxImages - images.length;
      const filesToAdd = imageFiles.slice(0, remainingSlots);
      onImagesChange([...images, ...filesToAdd]);
    } else {
      onImagesChange([...images, ...imageFiles]);
    }
  }, [images, maxImages, onImagesChange]);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true,
    maxFiles: maxImages - images.length
  });

  // Remove specific image
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-foreground">
        Images ({images.length}/{maxImages})
      </Label>
      
      {/* Upload Area */}
      <Card
        {...getRootProps()}
        className={`
          relative cursor-pointer transition-all duration-300 ease-smooth
          border-2 border-dashed p-8 text-center bg-gradient-card
          hover:shadow-soft hover:border-primary/50
          ${isDragActive 
            ? 'border-primary bg-primary/5 shadow-glow' 
            : 'border-border'
          }
          ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={images.length >= maxImages} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`
            p-4 rounded-full transition-all duration-300
            ${isDragActive 
              ? 'bg-primary/20 text-primary' 
              : 'bg-secondary text-secondary-foreground'
            }
          `}>
            <Upload className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              {isDragActive 
                ? 'Drop images here...' 
                : images.length >= maxImages
                  ? 'Maximum images reached'
                  : 'Drop images here or click to browse'
              }
            </p>
            <p className="text-sm text-muted-foreground">
              PNG, JPG, GIF, WebP up to 10MB each
            </p>
          </div>
        </div>
      </Card>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="group relative overflow-hidden bg-gradient-card shadow-soft">
              <div className="aspect-square relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Overlay with remove button */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="rounded-full w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* File info */}
              <div className="p-2">
                <p className="text-xs text-muted-foreground truncate">
                  {image.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(image.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};