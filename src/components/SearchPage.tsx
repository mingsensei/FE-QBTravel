import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowLeft, MapPin, Star, Plus, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { allLocations } from '@/data/locations';
import { LocationPoint } from '@/types/map';
import { useToast } from '@/hooks/use-toast';
import DestinationDetails from './DestinationDetails';

interface SearchPageProps {
  mode?: 'add' | 'select';
  onDestinationSelect?: (destination: LocationPoint) => void;
  showBackButton?: boolean;
}

const SearchPage: React.FC<SearchPageProps> = ({ 
  mode = 'add', 
  onDestinationSelect,
  showBackButton = true 
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedDestinations, setAddedDestinations] = useState<Set<string>>(new Set());
  const [showDestinationDetails, setShowDestinationDetails] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<LocationPoint | null>(null);

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'attraction', name: 'Danh lam' },
    { id: 'craft-village', name: 'Làng nghề' }
  ];

  const filteredLocations = allLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || location.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddDestination = (location: LocationPoint) => {
    if (mode === 'select' && onDestinationSelect) {
      onDestinationSelect(location);
    } else {
      setAddedDestinations(prev => new Set(prev).add(location.id));
      toast({
        title: "Đã thêm điểm đến",
        description: `${location.name} đã được thêm vào lịch trình`,
      });
    }
  };

  const handleViewDetails = (locationId: string) => {
    const location = allLocations.find(l => l.id === locationId);
    if (location) {
      setSelectedDestination(location);
      setShowDestinationDetails(true);
    }
  };

  if (showDestinationDetails && selectedDestination) {
    return (
      <DestinationDetails 
        destination={selectedDestination}
        onBack={() => setShowDestinationDetails(false)}
        mode={mode}
        onSelect={mode === 'select' ? onDestinationSelect : undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-nature">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {showBackButton && (
            <div className="flex items-center gap-4 mb-6">
              <Link to="/itinerary">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại lịch trình
                </Button>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Tìm kiếm điểm đến
              </h1>
              <p className="text-muted-foreground">
                Khám phá và thêm điểm đến mới vào lịch trình của bạn
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm địa điểm, hoạt động..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredLocations.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Không tìm thấy kết quả</h3>
              <p className="text-muted-foreground">
                Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredLocations.map((location) => (
                <Card key={location.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-80 h-48 md:h-auto">
                        <img
                          src={location.images[0]}
                          alt={location.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">
                                {location.category}
                              </Badge>
                              {location.rating && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{location.rating}</span>
                                </div>
                              )}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{location.name}</h3>
                            <p className="text-muted-foreground mb-3 line-clamp-2">
                              {location.description}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span>{location.checkIns?.toLocaleString()} check-ins</span>
                            </div>
                          </div>
                        </div>

                        {/* Highlights */}
                        {location.highlights && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {location.highlights.slice(0, 3).map((highlight, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {highlight}
                                </Badge>
                              ))}
                              {location.highlights.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{location.highlights.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(location.id)}
                          >
                            Xem chi tiết
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddDestination(location)}
                            disabled={addedDestinations.has(location.id)}
                            className="gap-2"
                          >
                            {addedDestinations.has(location.id) ? (
                              <>
                                <Check className="w-4 h-4" />
                                {mode === 'select' ? 'Đã chọn' : 'Đã thêm'}
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                {mode === 'select' ? 'Chọn điểm đến' : 'Thêm vào lịch trình'}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
