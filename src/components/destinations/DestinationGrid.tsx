import React from 'react';
import { LocationPoint } from '@/types/map';
import { DestinationCard } from './DestinationCard';

interface DestinationGridProps {
  destinations: LocationPoint[];
  selectedCategory?: string;
  searchQuery?: string;
}

export const DestinationGrid: React.FC<DestinationGridProps> = ({
  destinations,
  selectedCategory,
  searchQuery
}) => {
  const filteredDestinations = destinations.filter(destination => {
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || destination.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (filteredDestinations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-nature mb-6 flex items-center justify-center">
          <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Không tìm thấy điểm đến</h3>
        <p className="text-muted-foreground max-w-md">
          Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác để khám phá những điểm đến tuyệt vời của Quảng Bình.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredDestinations.map((destination, index) => (
        <DestinationCard 
          key={destination.id} 
          destination={destination}
          animationDelay={index * 0.1}
        />
      ))}
    </div>
  );
};