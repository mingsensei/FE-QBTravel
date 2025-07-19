import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Plus, Eye } from 'lucide-react';
import { Itinerary } from '@/types/itinerary';
import { mockItinerary } from '@/data/mockItinerary';

interface ItineraryListProps {
  onSelectItinerary: (itinerary: Itinerary) => void;
  onCreateNew: () => void;
}

const ItineraryList: React.FC<ItineraryListProps> = ({ onSelectItinerary, onCreateNew }) => {
  // Mock data - in real app this would come from API
  const [itineraries] = useState<Itinerary[]>([mockItinerary]);

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ngày`;
  };

  return (
    <div className="min-h-screen bg-gradient-nature pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Lịch trình của tôi
              </h1>
              <p className="text-muted-foreground">
                Quản lý và theo dõi các chuyến đi của bạn
              </p>
            </div>
            <Button onClick={onCreateNew} className="gap-2">
              <Plus className="w-4 h-4" />
              Tạo lịch trình mới
            </Button>
          </div>
        </div>

        {/* Itinerary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary) => (
            <Card key={itinerary.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{itinerary.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {itinerary.description}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Date and Duration */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateRange(itinerary.startDate, itinerary.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{calculateDuration(itinerary.startDate, itinerary.endDate)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-xs">
                    {itinerary.stops.length} điểm đến
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>Quảng Bình</span>
                  </div>
                </div>

                {/* Preview of first few stops */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Điểm đến:</h4>
                  <div className="space-y-1">
                    {itinerary.stops.slice(0, 3).map((stop, index) => (
                      <div key={stop.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <span className="truncate">{stop.name}</span>
                      </div>
                    ))}
                    {itinerary.stops.length > 3 && (
                      <div className="text-xs text-muted-foreground ml-6">
                        +{itinerary.stops.length - 3} điểm đến khác
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  onClick={() => onSelectItinerary(itinerary)}
                  className="w-full gap-2"
                  variant="outline"
                >
                  <Eye className="w-4 h-4" />
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {itineraries.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gradient-nature mb-6 flex items-center justify-center mx-auto">
              <Calendar className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Chưa có lịch trình nào</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Tạo lịch trình đầu tiên của bạn để bắt đầu khám phá những điểm đến tuyệt vời ở Quảng Bình.
            </p>
            <Button onClick={onCreateNew} className="gap-2">
              <Plus className="w-4 h-4" />
              Tạo lịch trình đầu tiên
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryList;