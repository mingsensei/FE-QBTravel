import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Heart, MessageCircle, Share2, User } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  embedUrl: string;
  comments: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: string;
  }>;
}

interface VideoSectionProps {
  videos: Video[];
}

export function VideoSection({ videos }: VideoSectionProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsOpen(true);
  };

  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
          Experience Videos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="group cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 rounded-t-lg" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => openVideo(video)}
                  >
                    <Play className="h-8 w-8" />
                  </Button>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{video.views} views</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Video Modal */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-6xl w-full p-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Video Player */}
              <div className="lg:col-span-2">
                <div className="aspect-video bg-black">
                  {selectedVideo && (
                    <iframe
                      src={selectedVideo.embedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {selectedVideo?.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{selectedVideo?.views} views</p>
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Like
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="p-6 bg-gray-50 max-h-[600px] overflow-y-auto">
                <h4 className="font-semibold mb-4 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Comments
                </h4>
                <div className="space-y-4">
                  {selectedVideo?.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{comment.author}</p>
                        <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{comment.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}