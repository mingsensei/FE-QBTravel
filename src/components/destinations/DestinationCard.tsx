import React from 'react';
import clsx from 'clsx';
import { MapPin, Star } from 'lucide-react';
import { LocationPoint } from '@/types/map';


type LP = LocationPoint & { tags?: string[]; features?: string[] };


interface DestinationCardProps {
  destination: LocationPoint;
  animationDelay?: number;
  variant?: 'grid' | 'horizontal';
}


export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  animationDelay = 0,
  variant = 'horizontal'
}) => {
  const {
    name,
    description,
    images,
    rating,
    category
  } = destination as LP;


  // Fallback tags
  const tags: string[] =
    (destination as LP).tags ||
    (destination as LP).features ||
    [];


  const CategoryBadge = (
    <span className="absolute top-3 left-3 z-10 inline-flex items-center px-3 py-1 rounded-full
                     text-[12px] font-medium bg-primary text-primary-foreground shadow">
      {category || 'Destination'}
    </span>
  );


  const RatingBadge = rating !== undefined && (
    <div className="absolute bottom-3 right-3 z-10 flex items-center space-x-1 px-3 py-1 rounded-full
                    bg-white/90 backdrop-blur text-[13px] font-medium shadow-sm">
      <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
      <span>{rating.toFixed(1)}</span>
    </div>
  );


  const renderTags = () => {
    if (!tags.length) return null;
    const max = 4;
    const visible = tags.slice(0, max);
    const remain = tags.length - visible.length;
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {visible.map(tag => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full bg-muted/60 text-xs font-medium text-foreground/80
                       border border-border/50"
          >
            {tag}
          </span>
        ))}
        {remain > 0 && (
          <span
            className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-foreground/70
                       border border-border/40"
          >
            +{remain}
          </span>
        )}
      </div>
    );
  };


  /* GRID VARIANT */
  if (variant === 'grid') {
    return (
      <div
        style={{ animationDelay: `${animationDelay}s` }}
        className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border/50
                   shadow-sm hover:shadow-lg transition-all duration-300"
      >
        <div className="relative h-48 w-full overflow-hidden">
          {CategoryBadge}
          <img
            src={images?.[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {RatingBadge}
        </div>
        <div className="flex flex-col flex-1 p-5">
          <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">{name}</h3>
          <div className="flex items-center text-xs text-muted-foreground mb-3">
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary" />
            <span>Quảng Bình</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{description}</p>
          {renderTags()}
          <div className="mt-5">
            <button
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold
                         text-sm hover:bg-primary/90 transition shadow focus:outline-none
                         focus:ring-2 focus:ring-primary/40"
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    );
  }


  /* HORIZONTAL VARIANT */
  return (
    <div
      style={{ animationDelay: `${animationDelay}s` }}
      className={clsx(
        'group relative w-full overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm',
        'hover:shadow-lg transition-all duration-300',
        'flex flex-col md:flex-row md:items-stretch'
      )}
    >
      <div
        className={clsx(
          'relative w-full overflow-hidden flex-shrink-0',
          'h-[180px] md:h-full md:self-stretch',
          'md:w-[300px] lg:w-[320px] xl:w-[340px]'
        )}
      >
        {CategoryBadge}
        <img
          src={images?.[0]}
          alt={name}
          className="w-full h-full min-h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {RatingBadge}
      </div>


      <div className="flex flex-col flex-1 p-4 md:p-5 lg:p-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">{name}</h3>
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary" />
          <span>Quảng Bình</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{description}</p>
        {renderTags()}
      </div>
    </div>
  );
};



