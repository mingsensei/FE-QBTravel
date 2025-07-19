import React, { useState, useMemo } from 'react';
import { allLocations } from '@/data/locations';
import { DestinationGrid } from './DestinationGrid';
import { DestinationFilters } from './DestinationFilters';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import qbHeaderVideo from '@/assets/qbheader.webm';


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
      <div className="relative overflow-hidden min-h-[500px] pt-24">
        {/* Video nền */}
        <video
            className="absolute inset-0 w-full h-full object-cover"
            src={qbHeaderVideo}
            autoPlay
            loop
            muted
            playsInline
        />
        {/* Overlay mờ cho chữ nổi */}
        <div className="absolute inset-0 bg-black/30"></div>
        {/* Nội dung header */}
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Compass className="w-8 h-8 text-green-600" />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow">
                  Khám Phá Quảng Bình
                </h1>
                <p className="text-lg text-white/90">
                  Những điểm đến tuyệt vời đang chờ đón bạn
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-4 h-4" />
              <span>Tỉnh Quảng Bình, Việt Nam</span>
            </div>
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

        {/* Featured Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Điểm đến nổi bật</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Large Featured Card */}
            <div className="lg:col-span-2">
              {allLocations[0] && (
                <div className="relative h-[400px] rounded-2xl overflow-hidden group cursor-pointer">
                  <img 
                    src={allLocations[0].images[0]} 
                    alt={allLocations[0].name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Điểm du lịch
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{allLocations[0].name}</h3>
                    <div className="flex items-center gap-4 text-sm text-white/90">
                      <span>04/05/2024</span>
                      <span>•</span>
                      <span>1 min read</span>
                      <span>•</span>
                      <span>1428 Views</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Smaller Cards */}
            <div className="space-y-6">
              {allLocations.slice(1, 3).map((location) => (
                <div key={location.id} className="relative h-[190px] rounded-2xl overflow-hidden group cursor-pointer">
                  <img 
                    src={location.images[0]} 
                    alt={location.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Điểm du lịch
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h4 className="font-bold mb-1 line-clamp-2">{location.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-white/90">
                      <span>04/05/2024</span>
                      <span>•</span>
                      <span>1 min read</span>
                      <span>•</span>
                      <span>509 Views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Tất cả điểm đến</h2>
          <DestinationGrid
            destinations={filteredDestinations}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
};