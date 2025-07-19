import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Clock, MapPin, Calendar, Edit, Target, Camera } from 'lucide-react';
import { Itinerary, ItineraryStop } from '@/types/itinerary';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ChallengeModal from './itinerary/ChallengeModal';
import PostModal from './itinerary/PostModal';

interface ItineraryDetailsProps {
  itinerary: Itinerary;
  onBack: () => void;
  onAddStop: () => void;
  onUpdateStop: (stopId: string, updates: Partial<ItineraryStop>) => void;
}

const ItineraryDetails: React.FC<ItineraryDetailsProps> = ({ 
  itinerary, 
  onBack, 
  onAddStop,
  onUpdateStop 
}) => {
  const [editingStop, setEditingStop] = useState<string | null>(null);
  const [editTimes, setEditTimes] = useState<{startedAt: string, endedAt: string}>({
    startedAt: '',
    endedAt: ''
  });
  const [selectedStop, setSelectedStop] = useState<ItineraryStop | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

  const handleEditTime = (stop: ItineraryStop) => {
    setEditingStop(stop.id);
    setEditTimes({
      startedAt: stop.startedAt || '',
      endedAt: stop.endedAt || ''
    });
  };

  const handleSaveTime = (stopId: string) => {
    onUpdateStop(stopId, {
      startedAt: editTimes.startedAt,
      endedAt: editTimes.endedAt
    });
    setEditingStop(null);
  };

  const handleCancelEdit = () => {
    setEditingStop(null);
    setEditTimes({ startedAt: '', endedAt: '' });
  };

  const handleChallengeClick = (stop: ItineraryStop, challengeId: string) => {
    setSelectedStop(stop);
    setSelectedChallengeId(challengeId);
    setShowChallengeModal(true);
  };

  const handlePostClick = (stop: ItineraryStop) => {
    setSelectedStop(stop);
    setShowPostModal(true);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Chưa đặt';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-nature pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {itinerary.title}
              </h1>
              <p className="text-muted-foreground">
                {itinerary.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{itinerary.startDate} - {itinerary.endDate}</span>
            </div>
            <Badge variant="secondary">{itinerary.stops.length} điểm đến</Badge>
          </div>

          <Button onClick={onAddStop} className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm điểm đến
          </Button>
        </div>

        {/* Stops List */}
        <div className="space-y-6">
          {itinerary.stops.map((stop, index) => (
            <Card key={stop.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Image */}
                  <div className="lg:w-1/3">
                    <img
                      src={stop.image}
                      alt={stop.name}
                      className="w-full h-48 lg:h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Điểm {index + 1}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{stop.name}</h3>
                        
                        {/* Time Display/Edit */}
                        {editingStop === stop.id ? (
                          <div className="space-y-3 mb-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor={`start-${stop.id}`} className="text-xs">Giờ bắt đầu</Label>
                                <Input
                                  id={`start-${stop.id}`}
                                  type="time"
                                  value={editTimes.startedAt}
                                  onChange={(e) => setEditTimes(prev => ({ ...prev, startedAt: e.target.value }))}
                                  className="text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`end-${stop.id}`} className="text-xs">Giờ kết thúc</Label>
                                <Input
                                  id={`end-${stop.id}`}
                                  type="time"
                                  value={editTimes.endedAt}
                                  onChange={(e) => setEditTimes(prev => ({ ...prev, endedAt: e.target.value }))}
                                  className="text-sm"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSaveTime(stop.id)}>
                                Lưu
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                Hủy
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Bắt đầu: {formatTime(stop.startedAt || '')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Kết thúc: {formatTime(stop.endedAt || '')}</span>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleEditTime(stop)}
                                className="h-6 px-2"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span>Thời gian dự kiến: {stop.duration}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Challenges */}
                    {stop.challenges.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="w-4 h-4 text-primary" />
                          <span className="font-medium">Thử thách</span>
                          <Badge variant="secondary" className="text-xs">
                            {stop.challenges.filter(c => c.completed).length}/{stop.challenges.length}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {stop.challenges.map((challenge) => (
                            <button
                              key={challenge.id}
                              onClick={() => handleChallengeClick(stop, challenge.id)}
                              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                            >
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                challenge.completed 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'border-2 border-muted-foreground'
                              }`}>
                                {challenge.completed && '✓'}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{challenge.title}</div>
                                <div className="text-xs text-muted-foreground">{challenge.points} điểm</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePostClick(stop)}
                        className="gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Đăng bài
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {itinerary.stops.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gradient-nature mb-6 flex items-center justify-center mx-auto">
              <MapPin className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Chưa có điểm đến nào</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Thêm điểm đến đầu tiên để bắt đầu lên kế hoạch cho chuyến đi của bạn.
            </p>
            <Button onClick={onAddStop} className="gap-2">
              <Plus className="w-4 h-4" />
              Thêm điểm đến đầu tiên
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showChallengeModal && selectedStop && selectedChallengeId && (
        <ChallengeModal
          stop={selectedStop}
          challengeId={selectedChallengeId}
          onClose={() => setShowChallengeModal(false)}
        />
      )}

      {showPostModal && selectedStop && (
        <PostModal
          stop={selectedStop}
          onClose={() => setShowPostModal(false)}
        />
      )}
    </div>
  );
};

export default ItineraryDetails;