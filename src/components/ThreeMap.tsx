import React, { useState } from 'react';
import { RealMap3D } from '@/components/map/RealMap3D';
import { LocationPanel } from '@/components/ui/location-panel';
import { LocationPoint } from '@/types/map';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { allLocations, famousPlaces, craftVillages } from '@/data/locations';
import { Map, Filter, Info } from 'lucide-react';
import heroImage from '@/assets/quang-binh-hero.jpg';

export const ThreeDMap = () => {
    const [selectedLocation, setSelectedLocation] = useState<LocationPoint | null>(null);
    const [filterType, setFilterType] = useState<'all' | 'attraction' | 'craft-village'>('all');
    const [showInfo, setShowInfo] = useState(false);
    const [use3DTest, setUse3DTest] = useState(false);

    const filteredLocations = allLocations.filter(location =>
        filterType === 'all' || location.type === filterType
    );

    const handleLocationSelect = (location: LocationPoint | null) => {
        setSelectedLocation(location);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gradient-forest pt-24">
            {/* Hero overlay */}
            <div
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />



            {/* Filter bar */}
            <div className="absolute top-20 left-6 z-40 mt-4">
                <div className="flex items-center gap-2 p-2 bg-card/90 backdrop-blur-sm rounded-xl shadow-nature">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Button
                        variant={filterType === 'all' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilterType('all')}
                        className="text-xs"
                    >
                        All ({allLocations.length})
                    </Button>
                    <Button
                        variant={filterType === 'attraction' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilterType('attraction')}
                        className="text-xs"
                    >
                        Attractions ({famousPlaces.length})
                    </Button>
                    <Button
                        variant={filterType === 'craft-village' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilterType('craft-village')}
                        className="text-xs"
                    >
                        Craft Villages ({craftVillages.length})
                    </Button>
                </div>
            </div>

            {/* Location list sidebar */}
            <div className="absolute left-6 top-40 bottom-6 w-80 z-30 overflow-hidden">
                <div className="h-full bg-card/90 backdrop-blur-sm rounded-xl shadow-floating p-4 overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">
                        Explore Locations
                    </h3>
                    <div className="space-y-3">
                        {filteredLocations.map((location) => (
                            <div
                                key={location.id}
                                onClick={() => handleLocationSelect(location)}
                                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-nature ${
                                    selectedLocation?.id === location.id
                                        ? 'bg-primary/20 border-2 border-primary shadow-glow'
                                        : 'bg-background/50 hover:bg-primary/10 border border-border'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-foreground line-clamp-1">
                                        {location.name}
                                    </h4>
                                    <Badge
                                        variant={location.type === 'attraction' ? 'default' : 'secondary'}
                                        className="text-xs shrink-0 ml-2"
                                    >
                                        {location.type === 'attraction' ? 'Attraction' : 'Craft'}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                    {location.description}
                                </p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    ⭐ {location.rating}
                  </span>
                                    <span>{location.checkIns.toLocaleString()} check-ins</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main 3D Map */}
            <div className="absolute inset-0 h-full w-full">
                <RealMap3D
                    selectedLocation={selectedLocation}
                    onLocationSelect={handleLocationSelect}
                    locations={filteredLocations}
                />
            </div>


            {/* Location Detail Panel */}
            <LocationPanel
                location={selectedLocation}
                onClose={() => setSelectedLocation(null)}
                className={selectedLocation ? 'translate-x-0' : 'translate-x-full'}
            />

            {/* Info Panel */}
            {showInfo && (
                <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="max-w-2xl bg-card rounded-2xl shadow-floating p-8 relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowInfo(false)}
                            className="absolute top-4 right-4"
                        >
                            <Info className="w-5 h-5" />
                        </Button>
                        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-forest bg-clip-text text-transparent">
                            Quang Binh Vista Explorer
                        </h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                Discover the breathtaking beauty of Quang Binh province through our immersive 3D map experience.
                                Explore UNESCO World Heritage caves, pristine beaches, and traditional craft villages.
                            </p>
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{famousPlaces.length}</div>
                                    <div className="text-sm">Famous Attractions</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{craftVillages.length}</div>
                                    <div className="text-sm">Craft Villages</div>
                                </div>
                            </div>
                            <p className="text-sm">
                                <strong>How to explore:</strong> Click and drag to rotate the 3D map, scroll to zoom,
                                and click on the glowing markers to learn more about each location. Filter by type
                                using the controls in the top-left corner.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
