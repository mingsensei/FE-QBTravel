import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, MapPin, Calendar, Target, Camera, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockItinerary } from '@/data/mockItinerary';
import { ItineraryStop } from '@/types/itinerary';
import ChallengeModal from './itinerary/ChallengeModal';
import PostModal from './itinerary/PostModal';

const Itinerary: React.FC = () => {
  const [selectedStop, setSelectedStop] = useState<ItineraryStop | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

  const handleChallengeClick = (stopId: string, challengeId: string) => {
    const stop = mockItinerary.stops.find(s => s.id === stopId);
    if (stop) {
      setSelectedStop(stop);
      setSelectedChallengeId(challengeId);
      setShowChallengeModal(true);
    }
  };

  const handlePostClick = (stop: ItineraryStop) => {
    setSelectedStop(stop);
    setShowPostModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-nature pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {mockItinerary.title}
              </h1>
              <p className="text-muted-foreground">
                {mockItinerary.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{mockItinerary.startDate} - {mockItinerary.endDate}</span>
            </div>
            <Badge variant="secondary">{mockItinerary.stops.length} điểm đến</Badge>
          </div>

          <Link to="/search">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Thêm điểm đến
            </Button>
          </Link>
        </div>

        {/* Itinerary Timeline */}
        <div className="space-y-6">
          {mockItinerary.stops.map((stop, index) => (
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
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Điểm {index + 1}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{stop.scheduledTime}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-1">{stop.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-3 h-3" />
                          <span>Thời gian: {stop.duration}</span>
                        </div>
                      </div>

                      <Link to={`/destination/${stop.destinationId}`}>
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                      </Link>
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
                              onClick={() => handleChallengeClick(stop.id, challenge.id)}
                              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                            >
                              {challenge.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-muted-foreground rounded-full" />
                              )}
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

export default Itinerary;
