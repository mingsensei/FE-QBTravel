import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Plus, Eye } from 'lucide-react';
import { Itinerary } from '@/types/itinerary';

interface ItineraryListProps {
  onSelectItinerary: (itinerary: Itinerary) => void;
  onCreateNew: () => void;
}

const ItineraryList: React.FC<ItineraryListProps> = ({ onSelectItinerary, onCreateNew }) => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8081/api/itinerary/by-user/2');
        if (!res.ok) throw new Error('Không thể tải dữ liệu lịch trình');
        const data = await res.json();
        
        setItineraries(data);
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi khi gọi API');
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

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

                {/* Location placeholder */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>Quảng Bình</span>
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
        {itineraries.length === 0 && !loading && (
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
