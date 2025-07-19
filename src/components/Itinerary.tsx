import React, { useState } from 'react';
import { Itinerary as ItineraryType, ItineraryStop } from '@/types/itinerary';
import { mockItinerary } from '@/data/mockItinerary';
import ItineraryList from './ItineraryList';
import ItineraryDetails from './ItineraryDetails';
import AddStopFlow from './AddStopFlow';

const Itinerary: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'details' | 'addStop'>('list');
  const [selectedItinerary, setSelectedItinerary] = useState<ItineraryType | null>(null);
  const [itineraries, setItineraries] = useState<ItineraryType[]>([mockItinerary]);

  const handleSelectItinerary = async (itinerary: ItineraryType) => {
  try {
    const res = await fetch(`http://localhost:8081/api/itinerary-stop/by-itinerary/${itinerary.id}`);
    if (!res.ok) throw new Error('Failed to fetch stops');

    const stops: ItineraryStop[] = await res.json();

    const itineraryWithStops = {
      ...itinerary,
      stops: stops
    };

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
    // TODO: Implement create new itinerary flow
    console.log('Create new itinerary');
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
      prev.map(itin => 
        itin.id === selectedItinerary.id ? updatedItinerary : itin
      )
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
      prev.map(itin => 
        itin.id === selectedItinerary.id ? updatedItinerary : itin
      )
    );
    
    setSelectedItinerary(updatedItinerary);
  };

  // Render based on current view
  switch (currentView) {
    case 'list':
      return (
        <ItineraryList
          onSelectItinerary={handleSelectItinerary}
          onCreateNew={handleCreateNewItinerary}
        />
      );
    
    case 'details':
      return selectedItinerary ? (
        <ItineraryDetails
          itinerary={selectedItinerary}
          onBack={handleBackToList}
          onAddStop={handleAddStop}
          onUpdateStop={handleUpdateStop}
        />
      ) : null;
    
    case 'addStop':
      return (
        <AddStopFlow
          onBack={handleBackToDetails}
          onAddStop={handleAddStopToItinerary}
        />
      );
    
    default:
      return null;
  }
};

export default Itinerary;
