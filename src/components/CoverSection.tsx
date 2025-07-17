import { MapPin } from 'lucide-react';

interface CoverSectionProps {
  title: string;
  tagline: string;
  location: string;
  backgroundImage: string;
}

export function CoverSection({ title, tagline, location, backgroundImage }: CoverSectionProps) {
  return (
    <div className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6 lg:p-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-xl lg:text-2xl text-green-100 mb-6 leading-relaxed">
            {tagline}
          </p>
          <div className="flex items-center text-white/90 text-lg">
            <MapPin className="w-5 h-5 mr-2 text-green-300" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}