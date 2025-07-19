import React, { useState, useMemo } from "react";
import { allLocations } from "@/data/locations";
import { DestinationGrid } from "./DestinationGrid";
import { DestinationFilters } from "./DestinationFilters";
import { MapPin, Compass } from "lucide-react";
import qbHeaderVideo from "@/assets/qbheader.webm";


export const DestinationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");


  const categories = useMemo(
    () => Array.from(new Set(allLocations.map((l) => l.category))).sort(),
    []
  );


  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allLocations.filter((d) => {
      const catOk =
        selectedCategory === "all" || d.category === selectedCategory;
      const qOk =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [searchQuery, selectedCategory]);


  const avgRating = (
    allLocations.reduce((s, l) => s + l.rating, 0) / allLocations.length
  ).toFixed(1);


  return (
    <div className="min-h-screen bg-gradient-nature">
      {/* Header */}
      <div className="relative overflow-hidden min-h-[500px] pt-24">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={qbHeaderVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/30" />
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
        {/* Featured */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Điểm đến nổi bật
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      Điểm du lịch
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      {allLocations[0].name}
                    </h3>
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


            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-soft)] border border-border/50 h-full lg:h-[400px] flex flex-col">
                <div className="flex-1 overflow-y-auto overscroll-contain pr-1">
                  <DestinationFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    categories={categories}
                    totalCount={allLocations.length}
                    filteredCount={filtered.length}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* All Destinations with side stats (responsive re-order) */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Tất cả điểm đến
          </h2>


          {/* Grid bao gồm: (mobile) stats rồi list; (desktop) list (2 cột) + stats (1 cột) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* STATS – mobile: xuất hiện trước list; desktop: cột phải */}
            <div className="order-2 lg:order-2 space-y-6 lg:col-span-1">
              <div className="bg-card rounded-xl p-5 shadow-sm border border-border/50 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{allLocations.length}</p>
                  <p className="text-xs text-muted-foreground">Tổng điểm đến</p>
                </div>
              </div>
              <div className="bg-card rounded-xl p-5 shadow-sm border border-border/50 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Compass className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{categories.length}</p>
                  <p className="text-xs text-muted-foreground">Danh mục</p>
                </div>
              </div>
              <div className="bg-card rounded-xl p-5 shadow-sm border border-border/50 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold">{avgRating}</p>
                  <p className="text-xs text-muted-foreground">
                    Đánh giá trung bình
                  </p>
                </div>
              </div>
            </div>


            {/* LIST – mobile: sau stats; desktop: bên trái (chiếm 2 cột) */}
            <div className="order-3 lg:order-1 lg:col-span-2 space-y-6">
              <DestinationGrid
                destinations={filtered}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



