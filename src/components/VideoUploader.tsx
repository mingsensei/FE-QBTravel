import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Video, Upload, X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface VideoUploaderProps {
  video: File | null;
  onVideoChange: (video: File | null) => void;
  maxSizeMB?: number;
}

/**
 * VideoUploader Component
 * Elegant single video upload with preview and nature-inspired styling
 */
export const VideoUploader: React.FC<VideoUploaderProps> = ({
  video,
  onVideoChange,
  maxSizeMB = 100
}) => {
  // Handle file drop and selection
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const videoFile = acceptedFiles.find(file => file.type.startsWith('video/'));
    if (videoFile) {
      const sizeMB = videoFile.size / 1024 / 1024;
      if (sizeMB <= maxSizeMB) {
        onVideoChange(videoFile);
      } else {
        alert(`Video file is too large. Maximum size is ${maxSizeMB}MB.`);
      }
    }
  }, [maxSizeMB, onVideoChange]);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    },
    multiple: false,
    maxFiles: 1
  });

  // Remove video
  const removeVideo = () => {
    onVideoChange(null);
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-foreground">
        Video {video && '(1/1)'}
      </Label>
      
      {!video ? (
        // Upload Area
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
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            <div className={`
              p-4 rounded-full transition-all duration-300
              ${isDragActive 
                ? 'bg-primary/20 text-primary' 
                : 'bg-secondary text-secondary-foreground'
              }
            `}>
              <Video className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                {isDragActive 
                  ? 'Drop video here...' 
                  : 'Drop video here or click to browse'
                }
              </p>
              <p className="text-sm text-muted-foreground">
                MP4, MOV, AVI, MKV, WebM up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        </Card>
      ) : (
        // Video Preview
        <Card className="group relative overflow-hidden bg-gradient-card shadow-soft">
          <div className="aspect-video relative bg-black rounded-lg overflow-hidden">
            <video
              src={URL.createObjectURL(video)}
              className="w-full h-full object-cover"
              controls
              preload="metadata"
            />
            
            {/* Overlay with remove button */}
            <div className="absolute top-2 right-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={removeVideo}
                className="rounded-full w-8 h-8 p-0 opacity-80 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Video info */}
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Play className="w-4 h-4 text-primary" />
              <p className="font-medium text-foreground truncate">
                {video.name}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Size: {(video.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};