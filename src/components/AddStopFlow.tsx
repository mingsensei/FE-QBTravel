import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, Plus, Check } from 'lucide-react';
import { LocationPoint } from '@/types/map';
import { ItineraryStop } from '@/types/itinerary';
import SearchPage from './SearchPage';

interface AddStopFlowProps {
  onBack: () => void;
  onAddStop: (stop: Omit<ItineraryStop, 'id' | 'challenges' | 'posts'>) => void;
}

const AddStopFlow: React.FC<AddStopFlowProps> = ({ onBack, onAddStop }) => {
  const [step, setStep] = useState<'search' | 'configure'>('search');
  const [selectedDestination, setSelectedDestination] = useState<LocationPoint | null>(null);
  const [timeConfig, setTimeConfig] = useState({
    startedAt: '',
    endedAt: '',
    duration: '2 giờ'
  });

  const handleDestinationSelect = (destination: LocationPoint) => {
    setSelectedDestination(destination);
    setStep('configure');
  };

  const handleTimeSubmit = () => {
    if (!selectedDestination || !timeConfig.startedAt || !timeConfig.endedAt) {
      return;
    }

    const newStop: Omit<ItineraryStop, 'id' | 'challenges' | 'posts'> = {
      destinationId: selectedDestination.id,
      name: selectedDestination.name,
      image: selectedDestination.images[0],
      coordinates: selectedDestination.coordinates,
      scheduledTime: timeConfig.startedAt,
      duration: timeConfig.duration,
      startedAt: timeConfig.startedAt,
      endedAt: timeConfig.endedAt
    };

    onAddStop(newStop);
  };

  const calculateDuration = () => {
    if (timeConfig.startedAt && timeConfig.endedAt) {
      const start = new Date(`2000-01-01T${timeConfig.startedAt}`);
      const end = new Date(`2000-01-01T${timeConfig.endedAt}`);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (diffHours > 0) {
        const hours = Math.floor(diffHours);
        const minutes = Math.round((diffHours - hours) * 60);
        return hours > 0 ? `${hours} giờ ${minutes > 0 ? minutes + ' phút' : ''}` : `${minutes} phút`;
      }
    }
    return timeConfig.duration;
  };

  if (step === 'search') {
    return (
      <div className="min-h-screen bg-gradient-nature">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại lịch trình
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Thêm điểm đến mới
            </h1>
            <p className="text-muted-foreground">
              Tìm kiếm và chọn điểm đến để thêm vào lịch trình
            </p>
          </div>

          <SearchPage 
            mode="select"
            onDestinationSelect={handleDestinationSelect}
            showBackButton={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-nature pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setStep('search')}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Chọn điểm đến khác
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Cấu hình thời gian
            </h1>
            <p className="text-muted-foreground">
              Đặt thời gian bắt đầu và kết thúc cho điểm đến
            </p>
          </div>

          {/* Selected Destination Preview */}
          {selectedDestination && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedDestination.images[0]}
                    alt={selectedDestination.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{selectedDestination.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {selectedDestination.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Time Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Thời gian tham quan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Giờ bắt đầu *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={timeConfig.startedAt}
                    onChange={(e) => setTimeConfig(prev => ({ 
                      ...prev, 
                      startedAt: e.target.value,
                      duration: calculateDuration()
                    }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Giờ kết thúc *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={timeConfig.endedAt}
                    onChange={(e) => setTimeConfig(prev => ({ 
                      ...prev, 
                      endedAt: e.target.value,
                      duration: calculateDuration()
                    }))}
                    required
                  />
                </div>
              </div>

              {/* Duration Display */}
              {timeConfig.startedAt && timeConfig.endedAt && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium">Thời gian dự kiến: {calculateDuration()}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('search')}
                  className="flex-1"
                >
                  Quay lại
                </Button>
                <Button 
                  onClick={handleTimeSubmit}
                  disabled={!timeConfig.startedAt || !timeConfig.endedAt}
                  className="flex-1 gap-2"
                >
                  <Check className="w-4 h-4" />
                  Thêm vào lịch trình
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddStopFlow;