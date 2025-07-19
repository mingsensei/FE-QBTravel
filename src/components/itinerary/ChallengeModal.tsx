import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Camera, Video, CheckCircle2, Star } from 'lucide-react';
import { ItineraryStop } from '@/types/itinerary';
import { useToast } from '@/hooks/use-toast';

interface ChallengeModalProps {
  stop: ItineraryStop;
  challengeId: string;
  onClose: () => void;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({ 
  stop, 
  challengeId, 
  onClose 
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const challenge = stop.challenges.find(c => c.id === challengeId);

  if (!challenge) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "Vui lòng chọn file",
        description: "Bạn cần tải lên ảnh hoặc video để hoàn thành thử thách",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      toast({
        title: "Hoàn thành thử thách!",
        description: `Bạn đã nhận được ${challenge.points} điểm`,
      });
      setUploading(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {challenge.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Star className="w-5 h-5 text-primary" />
            )}
            {challenge.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Challenge Info */}
          <div className="space-y-3">
            <p className="text-muted-foreground">{challenge.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {challenge.type === 'photo' ? 'Ảnh' : 
                 challenge.type === 'video' ? 'Video' : 
                 challenge.type === 'checkin' ? 'Check-in' : 'Hoạt động'}
              </Badge>
              <Badge variant="outline">{challenge.points} điểm</Badge>
            </div>
          </div>

          {/* Status */}
          {challenge.completed ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Đã hoàn thành!</span>
              </div>
              {challenge.evidence && (
                <div className="mt-3">
                  <p className="text-sm text-green-600 mb-2">Bằng chứng đã tải lên:</p>
                  {challenge.evidence.type === 'photo' ? (
                    <img 
                      src={challenge.evidence.url} 
                      alt="Evidence"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <video 
                      src={challenge.evidence.url} 
                      className="w-48 h-32 object-cover rounded-lg"
                      controls
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    {challenge.type === 'photo' ? (
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    ) : (
                      <Video className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="mb-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="font-medium text-primary hover:text-primary/80">
                        Tải lên {challenge.type === 'photo' ? 'ảnh' : 'video'}
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        accept={challenge.type === 'photo' ? 'image/*' : 'video/*'}
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {challenge.type === 'photo' ? 'PNG, JPG, GIF tối đa 10MB' : 'MP4, MOV tối đa 50MB'}
                  </p>
                </div>
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Xem trước:</p>
                  {challenge.type === 'photo' ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview"
                      className="w-full max-w-sm h-48 object-cover rounded-lg mx-auto"
                    />
                  ) : (
                    <video 
                      src={previewUrl} 
                      className="w-full max-w-sm h-48 object-cover rounded-lg mx-auto"
                      controls
                    />
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!selectedFile || uploading}
                  className="flex-1"
                >
                  {uploading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang tải lên...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Hoàn thành thử thách
                    </div>
                  )}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Huỷ
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeModal;