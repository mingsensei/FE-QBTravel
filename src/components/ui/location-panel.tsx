import React, { useState } from 'react';
import { LocationPoint } from '@/types/map';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Star, MapPin, Users, Camera, MessageCircle, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationPanelProps {
  location: LocationPoint | null;
  onClose: () => void;
  className?: string;
}

export const LocationPanel: React.FC<LocationPanelProps> = ({
  location,
  onClose,
  className
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [userRating, setUserRating] = useState(0);

  if (!location) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === location.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? location.images.length - 1 : prev - 1
    );
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4 transition-colors",
              star <= (interactive ? userRating : rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground",
              interactive && "cursor-pointer hover:text-yellow-400"
            )}
            onClick={interactive ? () => setUserRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={cn(
      "fixed right-0 top-0 h-full w-full max-w-2xl bg-card shadow-floating z-50 overflow-y-auto transition-transform duration-500 ease-bounce",
      className
    )}>
      <div className="relative">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background shadow-nature"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Image slideshow */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={location.images[currentImageIndex]}
            alt={location.name}
            className="w-full h-full object-cover transition-transform duration-300"
          />
          
          {/* Image navigation */}
          {location.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-primary/20"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-primary/20"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
              
              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {location.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      index === currentImageIndex ? "bg-primary" : "bg-background/60"
                    )}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          
          {/* Title overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">{location.name}</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{location.category}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{location.checkIns.toLocaleString()} check-ins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rating and type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {renderStars(location.rating)}
              <span className="text-sm font-medium">{location.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({location.reviews.length} reviews)
              </span>
            </div>
            <Badge 
              variant={location.type === 'attraction' ? 'default' : 'secondary'}
              className="px-3 py-1"
            >
              {location.type === 'attraction' ? 'Tourist Attraction' : 'Craft Village'}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About this place</h3>
            <p className="text-muted-foreground leading-relaxed">{location.description}</p>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Highlights</h3>
            <div className="flex flex-wrap gap-2">
              {location.highlights.map((highlight, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1 shadow-nature">
              <Camera className="w-4 h-4 mr-2" />
              Check In
            </Button>
            <Button variant="outline" className="flex-1">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>

          {/* Reviews section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Reviews & Comments
            </h3>

            {/* Add review */}
            <Card className="mb-4 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Share your experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your rating</label>
                  {renderStars(userRating, true)}
                </div>
                <Textarea
                  placeholder="Tell others about your visit..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  className="min-h-20"
                />
                <Button size="sm" className="w-full">
                  Post Review
                </Button>
              </CardContent>
            </Card>

            {/* Existing reviews */}
            <div className="space-y-4">
              {location.reviews.map((review) => (
                <Card key={review.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={review.avatar || `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face`}
                        alt={review.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{review.author}</span>
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {location.reviews.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
