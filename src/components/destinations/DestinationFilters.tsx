import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

interface DestinationFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  totalCount: number;
  filteredCount: number;
}

export const DestinationFilters: React.FC<DestinationFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalCount,
  filteredCount
}) => {
  const hasActiveFilters = searchQuery || selectedCategory !== 'all';

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
  };

  return (
    <div className="flex flex-col gap-5 md:gap-6 text-foreground">
      <section aria-label="Tìm kiếm điểm đến" className="space-y-1.5">
        <label htmlFor="destination-search" className="sr-only">Tìm kiếm</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            id="destination-search"
            type="text"
            placeholder="Tìm kiếm điểm đến..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`pl-10 pr-10 py-2 w-full bg-card border-border focus-visible:ring-2
                        focus-visible:ring-primary/30 focus-visible:border-primary transition-colors rounded-lg
                        ${searchQuery && 'ring-1 ring-primary/40'}`}
            aria-label="Tìm kiếm điểm đến"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange('')}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted rounded-full"
              title="Xóa tìm kiếm"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </section>

      <section aria-label="Lọc danh mục" className="space-y-2.5">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium">Danh mục:</span>
          {hasActiveFilters && (
            <Badge
              variant="outline"
              className="text-[10px] font-medium border-primary/30 text-primary/80 tracking-wide"
            >
              Đang lọc
            </Badge>
          )}
        </div>
        <div
          className="grid gap-2 grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-3
                     lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 mb-1"
          role="listbox"
          aria-label="Chọn danh mục"
        >
          <Button
            role="option"
            aria-selected={selectedCategory === 'all'}
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange('all')}
            className={`justify-center ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'hover:bg-accent hover:text-accent-foreground'
            } transition-all duration-200 text-[13px] font-medium rounded-full`}
          >
            Tất cả
          </Button>
          {categories.map(cat => {
            const active = selectedCategory === cat;
            return (
              <Button
                key={cat}
                role="option"
                aria-selected={active}
                variant={active ? 'default' : 'outline'}
                size="sm"
                onClick={() => onCategoryChange(cat)}
                className={`justify-center ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-glow'
                    : 'hover:bg-accent hover:text-accent-foreground'
                } transition-all duration-200 text-[13px] font-medium rounded-full whitespace-nowrap
                   ${active ? 'px-4' : 'px-3.5'}`}
                title={cat}
              >
                {cat}
              </Button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <div className="sm:hidden -mt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-primary hover:text-primary/80 hover:bg-primary/10 h-8 px-3 rounded-full"
            >
              <X className="w-4 h-4 mr-1" />
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </section>

      <section
        aria-label="Tóm tắt bộ lọc"
        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2 mt-1 border-t border-border/50"
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          Hiển thị <span className="font-medium text-foreground">{filteredCount}</span> trong tổng số{' '}
          <span className="font-medium text-foreground">{totalCount}</span> điểm đến
        </p>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="hidden sm:inline-flex text-primary hover:text-primary/80 hover:bg-primary/10 rounded-full h-8 px-3"
          >
            <X className="w-4 h-4 mr-1" />
            Xóa bộ lọc
          </Button>
        )}
      </section>
    </div>
  );
};
