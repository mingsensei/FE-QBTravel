import React, {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";
import { RealMap3D } from "@/components/map/RealMap3D";
import { LocationPoint } from "@/types/map";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Info, Menu, Loader2, AlertCircle } from "lucide-react";
import heroImage from "@/assets/quang-binh-hero.jpg";
import { LocationPanel } from "@/components/ui/location-panel";

/** 4 trạng thái để đồng bộ cả 2 chiều */
type PanelState = "closed" | "opening" | "open" | "closing";

const ANIM_DURATION = 320;           // tổng thời gian fade/slide
const SHOW_SIDEBAR_DELAY = 60;       // delay nhỏ khi *xuất hiện* (ms) để mắt dễ theo (0 nếu không muốn)
const HIDE_SIDEBAR_ADVANCE = 40;     // sidebar bắt đầu biến mất hơi sớm hơn (ms) trong pha closing

// API Response Interface
interface ApiLocation {
  id: number;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  description: string;
  imageUrl?: string;
  rating: string;
  checkIns: string;
  category: string;
}

// Transform API data to LocationPoint format
const transformApiLocation = (apiLoc: ApiLocation): LocationPoint => {
  // Convert API type to our type system
  const getLocationTypeAndCategory = (apiType: string) => {
    switch (apiType) {
      case 'SCENIC':
        return { type: 'attraction' as const, category: 'Natural Wonder' };
      case 'HISTORICAL':
        return { type: 'attraction' as const, category: 'Historical Site' };
      case 'VILLAGE':
        return { type: 'craft-village' as const, category: 'Traditional Craft' };
      default:
        return { type: 'attraction' as const, category: 'Other' };
    }
  };

  const { type, category } = getLocationTypeAndCategory(apiLoc.type);
  
  // Generate approximate 3D position based on lat/lng (simplified)
  const position: [number, number, number] = [
    (apiLoc.longitude - 106.5) * 4, // Scale and center longitude
    Math.random() * 0.3 + 0.1, // Random height between 0.1 and 0.4
    (apiLoc.latitude - 17.5) * 4   // Scale and center latitude
  ];

  return {
    id: apiLoc.id.toString(),
    name: apiLoc.name,
    type,
    position,
    coordinates: [apiLoc.longitude, apiLoc.latitude],
    description: apiLoc.description,
    images: apiLoc.imageUrl 
      ? [apiLoc.imageUrl]
      : ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'], // Default image
    rating: parseFloat(apiLoc.rating) || 4.5,
    reviews: [], // Empty for now, could be expanded later
    checkIns: parseInt(apiLoc.checkIns) || 0,
    category,
    highlights: getDefaultHighlights(type, category)
  };
};

// Generate default highlights based on type and category
const getDefaultHighlights = (type: 'attraction' | 'craft-village', category: string): string[] => {
  if (type === 'attraction') {
    switch (category) {
      case 'Natural Wonder':
        return ['Natural Beauty', 'Photography', 'Sightseeing', 'Adventure'];
      case 'Historical Site':
        return ['Historical Significance', 'Cultural Heritage', 'Architecture', 'Education'];
      default:
        return ['Sightseeing', 'Photography', 'Tourism', 'Experience'];
    }
  } else {
    return ['Traditional Craft', 'Cultural Experience', 'Handmade Products', 'Local Culture'];
  }
};

export const ThreeDMap = () => {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationPoint | null>(null);
  const [filterType, setFilterType] = useState<
    "all" | "attraction" | "craft-village"
  >("all");
  const [showInfo, setShowInfo] = useState(false);
  const [panelState, setPanelState] = useState<PanelState>("open");

  // API state
  const [allLocations, setAllLocations] = useState<LocationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const topPanelRef = useRef<HTMLDivElement>(null);
  const [topPanelHeight, setTopPanelHeight] = useState(0);

  // Fetch data from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:8081/api/locations');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiData: ApiLocation[] = await response.json();
        const transformedLocations = apiData.map(transformApiLocation);
        
        setAllLocations(transformedLocations);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch locations');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Derived data
  const famousPlaces = allLocations.filter(loc => loc.type === 'attraction');
  const craftVillages = allLocations.filter(loc => loc.type === 'craft-village');
  
  const filteredLocations = allLocations.filter(
    (l) => filterType === "all" || l.type === filterType
  );

  /* Đo chiều cao top panel (open hoặc opening) */
  useLayoutEffect(() => {
    if ((panelState === "open" || panelState === "opening") && topPanelRef.current) {
      setTopPanelHeight(topPanelRef.current.offsetHeight);
    }
  }, [panelState, filterType, allLocations.length]);

  /* Quản lý chuyển đổi opening -> open / closing -> closed */
  useEffect(() => {
    if (panelState === "opening") {
      const t = setTimeout(
        () => setPanelState("open"),
        ANIM_DURATION + SHOW_SIDEBAR_DELAY
      );
      return () => clearTimeout(t);
    }
    if (panelState === "closing") {
      const t = setTimeout(
        () => setPanelState("closed"),
        ANIM_DURATION
      );
      return () => clearTimeout(t);
    }
  }, [panelState]);

  const handleHide = useCallback(() => {
    if (panelState === "open") setPanelState("closing");
  }, [panelState]);

  const handleShow = useCallback(() => {
    if (panelState === "closed") setPanelState("opening");
  }, [panelState]);

  const handleLocationSelect = (loc: LocationPoint | null) => {
    setSelectedLocation(loc);
  };

  const handleRetry = () => {
    window.location.reload(); // Simple retry by reloading
  };

  /* Helpers */
  const showing = panelState === "opening" || panelState === "open";
  const hiding = panelState === "closing";
  const visible = panelState !== "closed";

  /* Tính class cho TopPanel */
  const topPanelClass =
    panelState === "open"
      ? "opacity-100 translate-y-0"
      : panelState === "opening"
      ? "opacity-100 translate-y-0 animate-[topPanelIn_var(--dur)_ease-out]"
      : panelState === "closing"
      ? "opacity-0 -translate-y-3 pointer-events-none"
      : "opacity-0 -translate-y-3 pointer-events-none";

  /* Sidebar animation logic */
  const sidebarBase =
    "absolute left-4 z-30 w-80 bottom-6 transition-[transform,opacity,top] ease-out";
  const sidebarTiming = `duration-[${ANIM_DURATION}ms]`;

  let sidebarClass = "";
  if (panelState === "open") {
    sidebarClass = "translate-x-0 opacity-100";
  } else if (panelState === "opening") {
    // xuất hiện (delay nhỏ)
    sidebarClass = `translate-x-0 opacity-100 animate-[sidebarIn_var(--dur)_ease-out_forwards]`;
  } else if (panelState === "closing") {
    // biến mất trượt nhẹ + fade
    sidebarClass = "-translate-x-3 opacity-0";
  } else {
    sidebarClass = "-translate-x-[120%] opacity-0 pointer-events-none";
  }

  // Sidebar top vị trí giữ cố định trong lúc closing để không nhảy
  const sidebarTop =
    (showing || hiding) && topPanelHeight
      ? topPanelHeight + 24
      : 0;

  // Loading state
  if (loading) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gradient-forest flex items-center justify-center">
        <div className="bg-card/90 backdrop-blur-sm rounded-2xl shadow-floating p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-foreground font-medium">Loading Quang Binh locations...</p>
          <p className="text-sm text-muted-foreground">Fetching data from server</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gradient-forest flex items-center justify-center">
        <div className="bg-card/90 backdrop-blur-sm rounded-2xl shadow-floating p-8 flex flex-col items-center gap-4 max-w-md">
          <AlertCircle className="w-8 h-8 text-destructive" />
          <p className="text-foreground font-medium">Failed to load locations</p>
          <p className="text-sm text-muted-foreground text-center">{error}</p>
          <Button onClick={handleRetry} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-forest">
      {/* Background overlay */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Nút mở lại */}
      {panelState === "closed" && (
        <button
          onClick={handleShow}
          className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg
                     animate-[panelBtnIn_.35s_ease] hover:scale-105 transition"
          title="Show panels"
          aria-label="Show panels"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Top Panel */}
      {visible && (
        <div
          ref={topPanelRef}
          className={`
            absolute left-4 top-4 z-40 flex flex-col gap-3
            w-[calc(20rem+32px)] max-w-[92vw]
            ${topPanelClass}
            transition-all duration-[${ANIM_DURATION}ms]
          `}
          style={{
            // Giữ chiều cao khi closing để sidebar không bật lên
            height: hiding ? topPanelHeight : "auto",
            ["--dur" as string]: `${ANIM_DURATION}ms`,
          }}
        >
          {/* Header */}
          <div
            onClick={handleHide}
            className="bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-nature cursor-pointer select-none transition hover:ring-1 hover:ring-primary/40"
            title="Click to hide panels"
          >
            <h3 className="text-sm font-semibold text-primary mb-1">
              🏔️ Quang Binh Province
            </h3>
            <p className="text-xs text-muted-foreground">
              Real 3D terrain • {allLocations.length} locations
            </p>
            <p className="text-[10px] mt-1 text-muted-foreground">
              Shortcuts: <b>R</b> rotate • <b>P</b> pitch • <b>O</b> orbit •{" "}
              <b>Esc</b> stop
            </p>
            <p className="text-[10px] italic text-muted-foreground mt-1">
              Click to hide
            </p>
          </div>

          {/* Filter bar */}
          <div
            className={`
              flex items-center gap-2 p-2 bg-card/90 backdrop-blur-sm rounded-xl shadow-nature
              transition-opacity duration-[${ANIM_DURATION}ms]
              ${
                panelState === "closing"
                  ? "opacity-0"
                  : panelState === "opening"
                  ? "opacity-100 animate-[fadeIn_var(--dur)_ease-out]"
                  : "opacity-100"
              }
            `}
            style={{ ["--dur" as keyof React.CSSProperties]: `${ANIM_DURATION - 60}ms` }}
          >
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Button
              variant={filterType === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterType("all")}
              className="text-xs"
            >
              All ({allLocations.length})
            </Button>
            <Button
              variant={filterType === "attraction" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterType("attraction")}
              className="text-xs"
            >
              Attractions ({famousPlaces.length})
            </Button>
            <Button
              variant={filterType === "craft-village" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterType("craft-village")}
              className="text-xs"
            >
              Craft Villages ({craftVillages.length})
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInfo(true)}
              className="ml-auto"
              title="Info"
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`${sidebarBase} ${sidebarTiming} ${sidebarClass}`}
        style={{
          top: sidebarTop,
          // Delay khi APPEAR để sau header một nhịp
          transitionDelay:
            panelState === "opening"
              ? `${SHOW_SIDEBAR_DELAY}ms`
              : panelState === "closing"
              ? `${Math.max(0, ANIM_DURATION - HIDE_SIDEBAR_ADVANCE - ANIM_DURATION)}ms`
              : "0ms",
          ["--dur" as any]: `${ANIM_DURATION}ms`,
        }}
      >
        {(panelState === "open" ||
          panelState === "opening" ||
          panelState === "closing") && (
          <div className="h-full bg-card/90 backdrop-blur-sm rounded-xl shadow-floating p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Explore Locations
            </h3>
            <div className="space-y-3">
              {filteredLocations.map((location, idx) => (
                <div
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-nature ${
                    selectedLocation?.id === location.id
                      ? "bg-primary/20 border-2 border-primary shadow-glow"
                      : "bg-background/50 hover:bg-primary/10 border border-border"
                  }`}
                  style={{
                    // Stagger nhẹ khi opening (tuỳ chọn)
                    transitionDelay:
                      panelState === "opening"
                        ? `${SHOW_SIDEBAR_DELAY + idx * 12}ms`
                        : "0ms",
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-foreground line-clamp-1">
                      {location.name}
                    </h4>
                    <Badge
                      variant={
                        location.type === "attraction" ? "default" : "secondary"
                      }
                      className="text-xs shrink-0 ml-2"
                    >
                      {location.type === "attraction" ? "Attraction" : "Craft"}
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
        )}
      </div>

      {/* Map */}
      <div className="absolute inset-0">
        <RealMap3D
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          locations={filteredLocations}
        />
      </div>

      {/* Location detail panel */}
      <LocationPanel
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        className={selectedLocation ? "translate-x-0" : "translate-x-full"}
      />

      {/* Info overlay */}
      {showInfo && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="max-w-xl bg-card rounded-2xl shadow-floating p-8 relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-xs px-2 py-1 rounded bg-muted hover:bg-muted/70"
            >
              Close
            </button>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Quang Binh Vista Explorer
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Explore caves, beaches & craft villages in 3D. Use filters,
              click markers or list items. Shortcuts: R / P / O / Esc.
            </p>
            <p className="text-xs text-muted-foreground">
              Data loaded from: http://localhost:8081/api/locations
            </p>
          </div>
        </div>
      )}

      {/* Keyframes */}
      <style>
        {`
          @keyframes panelBtnIn {
            0% { transform: scale(.6); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes topPanelIn {
            0% { opacity:0; transform: translateY(-8px); }
            100% { opacity:1; transform: translateY(0); }
          }
          @keyframes sidebarIn {
            0% { opacity:0; transform: translateX(-12px); }
            100% { opacity:1; transform: translateX(0); }
          }
          @keyframes fadeIn {
            0% { opacity:0; }
            100% { opacity:1; }
          }
        `}
      </style>
    </div>
  );
};