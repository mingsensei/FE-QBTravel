import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Image as ImageIcon, FileText } from 'lucide-react';

interface PreviewGalleryProps {
  title: string;
  images: File[];
  video: File | null;
}

/**
 * PreviewGallery Component
 * Beautiful overview of all uploaded content with elegant layout
 */
export const PreviewGallery: React.FC<PreviewGalleryProps> = ({
  title,
  images,
  video
}) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  if (!title && images.length === 0 && !video) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-card shadow-soft border-border">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">Preview</h3>
          <div className="flex items-center space-x-2">
            {title && (
              <Badge variant="secondary" className="bg-secondary">
                <FileText className="w-3 h-3 mr-1" />
                Title
              </Badge>
            )}
            {images.length > 0 && (
              <Badge variant="secondary" className="bg-secondary">
                <ImageIcon className="w-3 h-3 mr-1" />
                {images.length} Image{images.length !== 1 ? 's' : ''}
              </Badge>
            )}
            {video && (
              <Badge variant="secondary" className="bg-secondary">
                <Play className="w-3 h-3 mr-1" />
                Video
              </Badge>
            )}
          </div>
        </div>

        {/* Title Preview */}
        {title && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Title
            </h4>
            <p className="text-lg font-medium text-foreground bg-secondary/30 p-3 rounded-lg">
              {title}
            </p>
          </div>
        )}

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Images ({images.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg bg-secondary/20"
                  onClick={() => setSelectedImage(selectedImage === index ? null : index)}
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className={`
                      w-full h-full object-cover transition-all duration-300
                      ${selectedImage === index 
                        ? 'scale-105 shadow-glow' 
                        : 'group-hover:scale-105'
                      }
                    `}
                  />
                  
                  {/* Overlay */}
                  <div className={`
                    absolute inset-0 transition-opacity duration-300
                    ${selectedImage === index 
                      ? 'bg-primary/20' 
                      : 'bg-black/0 group-hover:bg-black/10'
                    }
                  `} />
                  
                  {/* Index badge */}
                  <div className="absolute top-2 right-2">
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-background/80 backdrop-blur-sm"
                    >
                      {index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Preview */}
        {video && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Video
            </h4>
            <div className="aspect-video relative bg-black rounded-lg overflow-hidden">
              <video
                src={URL.createObjectURL(video)}
                className="w-full h-full object-cover"
                controls
                preload="metadata"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {video.name} • {(video.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};