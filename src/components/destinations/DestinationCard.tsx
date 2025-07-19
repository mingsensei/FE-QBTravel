import React from 'react';
import { LocationPoint } from '@/types/map';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Users, Eye } from 'lucide-react';

interface DestinationCardProps {
  destination: LocationPoint;
  animationDelay?: number;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ 
  destination,
  animationDelay = 0 
}) => {
  const handleViewDetails = () => {
    // Navigate to destination details or open modal
    console.log('View details for:', destination.name);
  };

  const formatCheckIns = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div 
      className="group relative bg-gradient-card rounded-xl overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-2"
      style={{
        animationDelay: `${animationDelay}s`,
        animation: 'fade-in 0.6s ease-out both'
      }}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={destination.images[0]}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium text-gray-900">{destination.rating}</span>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
            {destination.category}
          </Badge>
        </div>
        
        {/* Check-ins */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Users className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium text-gray-900">{formatCheckIns(destination.checkIns)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300 truncate">
            {destination.name}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Quảng Bình</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 overflow-hidden" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical' as const
        }}>
          {destination.description}
        </p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1 mb-4">
          {destination.highlights.slice(0, 3).map((highlight, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-accent rounded-full text-accent-foreground"
            >
              {highlight}
            </span>
          ))}
          {destination.highlights.length > 3 && (
            <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
              +{destination.highlights.length - 3}
            </span>
          )}
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleViewDetails}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group-hover:shadow-glow transition-all duration-300"
          size="sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
};