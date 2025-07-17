import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryProps {
  images: Array<{
    url: string;
    alt: string;
  }>;
}

export function Gallery({ images }: GalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-green-50 to-green-100/50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
          Photo Gallery
        </h2>
        
        {/* Mobile: Horizontal Scroll */}
        <div className="lg:hidden">
          <div className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {images.map((image, index) => (
              <Dialog key={index} open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <div 
                    className="flex-shrink-0 w-80 h-60 cursor-pointer snap-start"
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsOpen(true);
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                    />
                  </div>
                </DialogTrigger>
              </Dialog>
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden lg:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <Dialog key={index} open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <div 
                  className="aspect-video cursor-pointer group"
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setIsOpen(true);
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
              </DialogTrigger>
            </Dialog>
          ))}
        </div>

        {/* Lightbox Modal */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-4xl w-full p-0 bg-black/90">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <img
                src={images[currentImageIndex]?.url}
                alt={images[currentImageIndex]?.alt}
                className="w-full max-h-[80vh] object-contain"
              />
              
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}