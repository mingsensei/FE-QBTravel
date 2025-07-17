import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, Text } from '@react-three/drei';
import { TerrainMesh } from './TerrainMesh';
import { LocationMarker } from './LocationMarker';
import { allLocations } from '@/data/locations';
import { LocationPoint } from '@/types/map';

interface Map3DProps {
  selectedLocation: LocationPoint | null;
  onLocationSelect: (location: LocationPoint | null) => void;
}

// Loading fallback component
const MapLoading = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-300 to-emerald-100">
    <div className="text-center text-primary">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
      <p>Loading 3D Map...</p>
    </div>
  </div>
);

export const Map3D: React.FC<Map3DProps> = ({ 
  selectedLocation, 
  onLocationSelect 
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay and then mark as ready
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  console.log('Map3D component rendering, isLoading:', isLoading);

  if (isLoading) {
    return <MapLoading />;
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-sky-300 to-emerald-100">
      <Canvas
        shadows
        camera={{ 
          position: [6, 8, 6], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        onCreated={(state) => {
          console.log('Canvas created successfully', state);
        }}
        onError={(error) => {
          console.error('Canvas error:', error);
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 20, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[0, 10, 0]} intensity={0.3} color={0x90EE90} />

          {/* Simple environment - remove complex Sky for now */}
          <color attach="background" args={['#87CEEB']} />

          {/* Simplified Terrain - reduce segments for better performance */}
          <TerrainMesh size={12} segments={32} heightScale={2} />

          {/* Rivers effect - blue ribbons */}
          <mesh position={[0, 0.02, -1]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
            <planeGeometry args={[8, 0.3]} />
            <meshStandardMaterial
              color={0x4FC3F7}
              transparent
              opacity={0.8}
              emissive={0x1976D2}
              emissiveIntensity={0.1}
            />
          </mesh>

          {/* Forest areas - darker green patches */}
          <mesh position={[-2, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2, 32]} />
            <meshStandardMaterial
              color={0x2E7D32}
              transparent
              opacity={0.6}
            />
          </mesh>

          {/* Location markers */}
          {allLocations.map((location) => (
            <LocationMarker
              key={location.id}
              location={location}
              isSelected={selectedLocation?.id === location.id}
              onSelect={onLocationSelect}
            />
          ))}

          {/* Simple title text */}
          <mesh position={[0, 6, 0]}>
            <boxGeometry args={[4, 0.5, 0.1]} />
            <meshStandardMaterial color={0x2E7D32} />
          </mesh>

          {/* Interactive controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};