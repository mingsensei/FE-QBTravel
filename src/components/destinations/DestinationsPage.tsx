import React, { useState, useMemo } from 'react';
import { allLocations } from '@/data/locations';
import { DestinationGrid } from './DestinationGrid';
import { DestinationFilters } from './DestinationFilters';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DestinationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Extract unique categories from locations
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(allLocations.map(location => location.category))
    ).sort();
    return uniqueCategories;
  }, []);

  // Filter destinations based on search and category
  const filteredDestinations = useMemo(() => {
    return allLocations.filter(destination => {
      const matchesCategory = selectedCategory === 'all' || destination.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        destination.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        destination.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-nature">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Trang chủ
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Khám Phá Quảng Bình
              </h1>
              <p className="text-lg text-primary-foreground/90">
                Những điểm đến tuyệt vời đang chờ đón bạn
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <MapPin className="w-4 h-4" />
            <span>Tỉnh Quảng Bình, Việt Nam</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-soft)] border border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{allLocations.length}</p>
                <p className="text-sm text-muted-foreground">Tổng điểm đến</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-soft)] border border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Compass className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Danh mục</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-soft)] border border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {(allLocations.reduce((sum, loc) => sum + loc.rating, 0) / allLocations.length).toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Đánh giá trung bình</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-soft)] border border-border/50 mb-8">
          <DestinationFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
            totalCount={allLocations.length}
            filteredCount={filteredDestinations.length}
          />
        </div>

        {/* Destinations Grid */}
        <DestinationGrid
          destinations={filteredDestinations}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};