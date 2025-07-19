import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Video, FileText, Upload } from 'lucide-react';
import { ItineraryStop } from '@/types/itinerary';
import { useToast } from '@/hooks/use-toast';

interface PostModalProps {
  stop: ItineraryStop;
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ stop, onClose }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'note'>('photo');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async () => {
    if (activeTab !== 'note' && !selectedFile) {
      toast({
        title: "Vui lòng chọn file",
        description: "Bạn cần tải lên ảnh hoặc video để đăng bài",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === 'note' && !content.trim()) {
      toast({
        title: "Vui lòng nhập nội dung",
        description: "Ghi chú không thể để trống",
        variant: "destructive"
      });
      return;
    }

    setPosting(true);
    
    // Simulate post creation
    setTimeout(() => {
      toast({
        title: "Đăng bài thành công!",
        description: `Bài viết của bạn về ${stop.name} đã được đăng`,
      });
      setPosting(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Đăng bài về {stop.name}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="photo" className="gap-2">
              <Camera className="w-4 h-4" />
              Ảnh
            </TabsTrigger>
            <TabsTrigger value="video" className="gap-2">
              <Video className="w-4 h-4" />
              Video
            </TabsTrigger>
            <TabsTrigger value="note" className="gap-2">
              <FileText className="w-4 h-4" />
              Ghi chú
            </TabsTrigger>
          </TabsList>

          <TabsContent value="photo" className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="mb-2">
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <span className="font-medium text-primary hover:text-primary/80">
                      Chọn ảnh
                    </span>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">PNG, JPG, GIF tối đa 10MB</p>
              </div>
            </div>

            {previewUrl && activeTab === 'photo' && (
              <img 
                src={previewUrl} 
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg"
              />
            )}

            <Textarea
              placeholder="Viết mô tả cho ảnh của bạn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
          </TabsContent>

          <TabsContent value="video" className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="mb-2">
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <span className="font-medium text-primary hover:text-primary/80">
                      Chọn video
                    </span>
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">MP4, MOV tối đa 50MB</p>
              </div>
            </div>

            {previewUrl && activeTab === 'video' && (
              <video 
                src={previewUrl} 
                className="w-full max-h-64 object-cover rounded-lg"
                controls
              />
            )}

            <Textarea
              placeholder="Viết mô tả cho video của bạn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
          </TabsContent>

          <TabsContent value="note" className="space-y-4">
            <div className="text-center py-4">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Chia sẻ trải nghiệm của bạn</p>
            </div>

            <Textarea
              placeholder="Viết về trải nghiệm của bạn tại đây..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleSubmit} 
            disabled={posting}
            className="flex-1"
          >
            {posting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang đăng...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Đăng bài
              </div>
            )}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;