import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  Camera,
  Plus,
  Check,
  Heart,
  Share2
} from 'lucide-react';
import { allLocations } from '@/data/locations';
import { useToast } from '@/hooks/use-toast';

interface DestinationDetailsProps {
  destination?: LocationPoint;
  onBack?: () => void;
  mode?: 'view' | 'select';
  onSelect?: (destination: LocationPoint) => void;
}

const DestinationDetails: React.FC<DestinationDetailsProps> = ({ 
  destination: propDestination,
  onBack,
  mode = 'view',
  onSelect
}) => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAddedToItinerary, setIsAddedToItinerary] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const destination = propDestination || allLocations.find(location => location.id === id);

  if (!destination) {
    return (
      <div className="min-h-screen bg-gradient-nature flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy điểm đến</h1>
          <Link to="/destinations">
            <Button>Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToItinerary = () => {
    setIsAddedToItinerary(true);
    toast({
      title: "Đã thêm vào lịch trình",
      description: `${destination.name} đã được thêm vào lịch trình của bạn`,
    });
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Đã bỏ yêu thích" : "Đã thêm vào yêu thích",
      description: `${destination.name} ${isFavorited ? 'đã được bỏ khỏi' : 'đã được thêm vào'} danh sách yêu thích`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: destination.name,
        text: destination.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Đã sao chép liên kết",
        description: "Liên kết đã được sao chép vào clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-nature">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          {onBack ? (
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-2 bg-white/90 backdrop-blur-sm"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          ) : (
            <Link to="/destinations">
              <Button variant="secondary" size="sm" className="gap-2 bg-white/90 backdrop-blur-sm">
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Button>
            </Link>
          )}
        </div>

        {/* Hero Image */}
        <div className="relative h-[50vh] md:h-[60vh]">
          <img
            src={destination.images[0]}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-white/90 text-black">
                {destination.category}
              </Badge>
              {destination.rating && (
                <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{destination.rating}</span>
                </div>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{destination.name}</h1>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{destination.checkIns?.toLocaleString()} check-ins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          {mode === 'select' && onSelect ? (
            <Button
              onClick={() => onSelect(destination)}
              className="flex-1 gap-2"
            >
              <Check className="w-4 h-4" />
              Chọn điểm đến này
            </Button>
          ) : (
            <Button
              onClick={handleAddToItinerary}
              disabled={isAddedToItinerary}
              className="flex-1 gap-2"
            >
              {isAddedToItinerary ? (
                <>
                  <Check className="w-4 h-4" />
                  Đã thêm vào lịch trình
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Thêm vào lịch trình
                </>
              )}
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={handleToggleFavorite}
            className="gap-2"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            {isFavorited ? 'Đã yêu thích' : 'Yêu thích'}
          </Button>
          
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="gallery">Thư viện ảnh</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Giới thiệu</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {destination.description}
                </p>
              </CardContent>
            </Card>

            {/* Highlights */}
            {destination.highlights && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Điểm nổi bật</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {destination.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Thông tin</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span>Tọa độ: {destination.coordinates.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span>{destination.checkIns?.toLocaleString()} lượt check-in</span>
                  </div>
                  {destination.rating && (
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-muted-foreground" />
                      <span>Đánh giá: {destination.rating}/5</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Thư viện ảnh</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {destination.images.map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg">
                      <img
                        src={image}
                        alt={`${destination.name} ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Đánh giá từ du khách</h2>
                {destination.reviews && destination.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {destination.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-start gap-3">
                          <img
                            src={review.avatar}
                            alt={review.author}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{review.author}</span>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-muted-foreground'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground text-sm mb-1">{review.comment}</p>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Chưa có đánh giá nào</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DestinationDetails;
