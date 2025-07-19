import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowLeft, MapPin, Star, Plus, Check, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { allLocations } from '@/data/locations';
import { LocationPoint } from '@/types/map';
import { useToast } from '@/hooks/use-toast';
import DestinationDetails from './DestinationDetails';

interface SearchPageProps {
  mode?: 'add' | 'select';
  onDestinationSelect?: (destination: LocationPoint) => void;
  showBackButton?: boolean;
  itineraryId?: string;
}

const SearchPage: React.FC<SearchPageProps> = ({ 
  mode = 'add', 
  onDestinationSelect,
  showBackButton = true,
  itineraryId 
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedDestinations, setAddedDestinations] = useState<Set<string>>(new Set());
  const [loadingDestinations, setLoadingDestinations] = useState<Set<string>>(new Set());
  const [showDestinationDetails, setShowDestinationDetails] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<LocationPoint | null>(null);

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'attraction', name: 'Danh lam' },
    { id: 'craft-village', name: 'Làng nghề' }
  ];

  // Fetch existing stops from backend when component mounts
  useEffect(() => {
    if (itineraryId && mode === 'add') {
      fetchExistingStops();
    }
  }, [itineraryId, mode]);

  const fetchExistingStops = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      const response = await fetch(`/api/itinerary-stop/itinerary/${itineraryId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const stops = await response.json();
        // Extract locationIds from existing stops
        const existingLocationIds = stops.map((stop: any) => stop.locationId.toString());
        setAddedDestinations(new Set(existingLocationIds));
      }
    } catch (error) {
      console.error('Error fetching existing stops:', error);
    }
  };

  const filteredLocations = allLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || location.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // API call function to add destination to itinerary
  const addDestinationToItinerary = async (destination: LocationPoint, itineraryId: string) => {
    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        throw new Error('No access token found');
      }

      // Get current stop count to determine stopOrder
      const currentStopsResponse = await fetch(`/api/itinerary-stop/itinerary/${itineraryId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      let stopOrder = 1;
      if (currentStopsResponse.ok) {
        const currentStops = await currentStopsResponse.json();
        stopOrder = currentStops.length + 1;
      }

      const response = await fetch(`/api/itinerary-stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          itineraryId: parseInt(itineraryId),
          locationId: parseInt(destination.id),
          stopOrder: stopOrder,
          startedAt: null,
          endedAt: null
        }),
      });

      if (!response.ok) {
        // Check if it's an authentication error
        if (response.status === 401) {
          // Clear invalid token and redirect to login
          localStorage.removeItem('accessToken');
          throw new Error('Authentication failed. Please login again.');
        }
        
        // Check for duplicate entry
        if (response.status === 409) {
          throw new Error('Điểm đến này đã có trong lịch trình');
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error adding destination to itinerary:', error);
      throw error;
    }
  };

  const handleAddDestination = async (location: LocationPoint) => {
    if (mode === 'select' && onDestinationSelect) {
      onDestinationSelect(location);
      return;
    }

    // Check if already added
    if (addedDestinations.has(location.id)) {
      toast({
        title: "Thông báo",
        description: "Điểm đến này đã có trong lịch trình",
        variant: "default",
      });
      return;
    }

    // Nếu mode là 'add', gọi API để thêm vào itinerary
    if (!itineraryId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy ID lịch trình",
        variant: "destructive",
      });
      return;
    }

    // Set loading state
    setLoadingDestinations(prev => new Set(prev).add(location.id));

    try {
      await addDestinationToItinerary(location, itineraryId);
      
      // Update UI state after successful API call
      setAddedDestinations(prev => new Set(prev).add(location.id));
      
      toast({
        title: "Thành công",
        description: `${location.name} đã được thêm vào lịch trình`,
      });

      // Optional: Navigate back to itinerary after a delay
      // setTimeout(() => navigate('/itinerary'), 1500);

    } catch (error) {
      let errorMessage = "Không thể thêm điểm đến vào lịch trình. Vui lòng thử lại.";
      
      if (error instanceof Error) {
        if (error.message.includes('Authentication failed')) {
          errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
          // Optional: redirect to login page
          // navigate('/login');
        } else if (error.message.includes('No access token')) {
          errorMessage = "Vui lòng đăng nhập để tiếp tục.";
          // navigate('/login');
        } else if (error.message.includes('đã có trong lịch trình')) {
          errorMessage = error.message;
          // Also update local state to reflect this
          setAddedDestinations(prev => new Set(prev).add(location.id));
        }
      }
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // Remove loading state
      setLoadingDestinations(prev => {
        const newSet = new Set(prev);
        newSet.delete(location.id);
        return newSet;
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
        itineraryId={itineraryId}
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
              {filteredLocations.map((location) => {
                const isLoading = loadingDestinations.has(location.id);
                const isAdded = addedDestinations.has(location.id);
                
                return (
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
                              disabled={isAdded || isLoading}
                              className="gap-2"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Đang thêm...
                                </>
                              ) : isAdded ? (
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;