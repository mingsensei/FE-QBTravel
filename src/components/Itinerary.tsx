import React, { useState } from 'react';
import { Itinerary as ItineraryType, ItineraryStop } from '@/types/itinerary';
import { mockItinerary } from '@/data/mockItinerary';
import ItineraryList from './ItineraryList';
import ItineraryDetails from './ItineraryDetails';
import AddStopFlow from './AddStopFlow';
import TravelPlannerAI from './chatbot/TravelPlanAI';
import { Sparkles } from 'lucide-react';

const Itinerary: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'details' | 'addStop' | 'aiPlanner'>('list');
  const [selectedItinerary, setSelectedItinerary] = useState<ItineraryType | null>(null);
  const [itineraries, setItineraries] = useState<ItineraryType[]>([mockItinerary]);

  const handleSelectItinerary = async (itinerary: ItineraryType) => {
    try {
      const res = await fetch(`http://localhost:8081/api/itinerary-stop/by-itinerary/${itinerary.id}`);
      if (!res.ok) throw new Error('Failed to fetch stops');
      const stops: ItineraryStop[] = await res.json();

      const itineraryWithStops = { ...itinerary, stops };
      setSelectedItinerary(itineraryWithStops);
      setCurrentView('details');
    } catch (error) {
      console.error('Error fetching stops:', error);
      alert('Không thể tải chi tiết hành trình');
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedItinerary(null);
  };

  const handleAddStop = () => {
    setCurrentView('addStop');
  };

  const handleBackToDetails = () => {
    setCurrentView('details');
  };

  const handleCreateNewItinerary = () => {
    console.log('Create new itinerary');
  };

  const handleOpenAIPlanner = () => {
    setCurrentView('aiPlanner');
  };

  const handleAddStopToItinerary = (stop: Omit<ItineraryStop, 'id' | 'challenges' | 'posts'>) => {
    if (!selectedItinerary) return;
    const newStop: ItineraryStop = {
      ...stop,
      id: `stop-${Date.now()}`,
      challenges: [],
      posts: []
    };
    const updatedItinerary = {
      ...selectedItinerary,
      stops: [...selectedItinerary.stops, newStop]
    };
    setItineraries(prev =>
      prev.map(itin => (itin.id === selectedItinerary.id ? updatedItinerary : itin))
    );
    setSelectedItinerary(updatedItinerary);
    setCurrentView('details');
  };

  const handleUpdateStop = (stopId: string, updates: Partial<ItineraryStop>) => {
    if (!selectedItinerary) return;
    const updatedItinerary = {
      ...selectedItinerary,
      stops: selectedItinerary.stops.map(stop =>
        stop.id === stopId ? { ...stop, ...updates } : stop
      )
    };
    setItineraries(prev =>
      prev.map(itin => (itin.id === selectedItinerary.id ? updatedItinerary : itin))
    );
    setSelectedItinerary(updatedItinerary);
  };

  /**
   * Nút mở AI Planner chỉ hiển thị ở view 'list' hoặc 'details'
   * Bạn có thể đổi style (fixed, absolute, v.v.)
   */
  const AIPlannerButton = (
    <button
      onClick={handleOpenAIPlanner}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl shadow-lg hover:from-blue-500 hover:to-indigo-500 active:scale-[0.97] transition font-medium"
    >
      <Sparkles className="w-5 h-5" />
      AI Planner
    </button>
  );

  // Render theo currentView
  switch (currentView) {
    case 'list':
      return (
        <>
          <ItineraryList
            onSelectItinerary={handleSelectItinerary}
            onCreateNew={handleCreateNewItinerary}
          />
          {AIPlannerButton}
        </>
      );

    case 'details':
      return selectedItinerary ? (
        <>
          <ItineraryDetails
            itinerary={selectedItinerary}
            onBack={handleBackToList}
            onAddStop={handleAddStop}
            onUpdateStop={handleUpdateStop}
          />
          {AIPlannerButton}
        </>
      ) : null;

    case 'addStop':
      return (
        <AddStopFlow
          onBack={handleBackToDetails}
          onAddStop={handleAddStopToItinerary}
        />
      );

    case 'aiPlanner':
      return (
        <TravelPlannerAI
          onBack={handleBackToList}
        />
      );

    default:
      return null;
  }
};

export default Itinerary;
