import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LocationPoint } from '@/types/map';

interface LocationMarkerProps {
  location: LocationPoint;
  isSelected: boolean;
  onSelect: (location: LocationPoint) => void;
}

export const LocationMarker: React.FC<LocationMarkerProps> = ({
  location,
  isSelected,
  onSelect,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const markerColor = location.type === 'attraction' ? 0x3b82f6 : 0xf59e0b;
  const glowColor = location.type === 'attraction' ? 0x60a5fa : 0xfbbf24;

  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const time = state.clock.elapsedTime;
      
      // Floating animation
      meshRef.current.position.y = location.position[1] + Math.sin(time * 2) * 0.1 + 0.2;
      
      // Pulsing glow effect
      const glowScale = 1 + Math.sin(time * 3) * 0.2;
      glowRef.current.scale.setScalar(glowScale);
      
      // Hover and selection effects
      if (isSelected || hovered) {
        meshRef.current.scale.setScalar(1.3);
        glowRef.current.scale.setScalar(glowScale * 1.5);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group position={[location.position[0], 0, location.position[2]]}>
      {/* Glow effect */}
      <mesh
        ref={glowRef}
        position={[0, location.position[1] + 0.2, 0]}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Main marker */}
      <mesh
        ref={meshRef}
        position={[0, location.position[1] + 0.2, 0]}
        onClick={() => onSelect(location)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={markerColor}
          emissive={markerColor}
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Floating label */}
      {(hovered || isSelected) && (
        <mesh position={[0, location.position[1] + 0.8, 0]}>
          <planeGeometry args={[2, 0.4]} />
          <meshBasicMaterial
            color={0x000000}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
    </group>
  );
};