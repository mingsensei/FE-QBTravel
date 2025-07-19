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
  const filtered = destinations.filter(d => {
    const catOk = !selectedCategory || selectedCategory === 'all' || d.category === selectedCategory;
    const q = (searchQuery || '').toLowerCase();
    const qOk =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q);
    return catOk && qOk;
  });


  if (!filtered.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-nature mb-6 flex items-center justify-center">
          <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Không tìm thấy điểm đến</h3>
        <p className="text-muted-foreground max-w-md">
          Hãy thử từ khóa khác hoặc chọn danh mục khác để khám phá thêm.
        </p>
      </div>
    );
  }


  return (
    <div className="flex flex-col space-y-6">
      {filtered.map((d, i) => (
        <DestinationCard
          key={d.id}
          destination={d}
          animationDelay={i * 0.06}
          variant="horizontal"
        />
      ))}
    </div>
  );
};



