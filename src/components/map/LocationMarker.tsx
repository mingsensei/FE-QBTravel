import React, { useState } from 'react';
import { Float, Billboard, Html } from '@react-three/drei';
import * as THREE from 'three';
import { LocationPoint } from '@/types/map';

interface LocationMarkerProps {
  location: LocationPoint;
  isSelected: boolean;
  onSelect: (l: LocationPoint) => void;
}

export const LocationMarker: React.FC<LocationMarkerProps> = ({
  location,
  isSelected,
  onSelect,
}) => {
  const [hovered, setHovered] = useState(false);

  const markerColor = location.type === 'attraction' ? '#3b82f6' : '#f59e0b';
  const glowColor   = location.type === 'attraction' ? '#60a5fa' : '#fbbf24';

  return (
    /* 👈 Đặt đủ [x,y,z] => không còn “dính” trục Y */
    <group position={location.position as [number, number, number]}>
      {/* Tạo chuyển động trôi nhẹ */}
      <Float speed={2} floatIntensity={1.5} rotationIntensity={0}>
        {/* Glow mờ (depthWrite=false để không chặn marker khác) */}
        <mesh scale={isSelected || hovered ? 1.9 : 1.6}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>

        {/* Marker chính */}
        <mesh
          scale={isSelected || hovered ? 1.3 : 1}
          onClick={() => onSelect(location)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={markerColor}
            emissive={markerColor}
            emissiveIntensity={0.35}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      </Float>

      {/* Tên địa điểm – luôn nhìn về camera */}
      {(hovered || isSelected) && (
        <Billboard position={[0, 0.65, 0]} follow>
          <Html
            center
            distanceFactor={6}
            style={{
              padding: '3px 6px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              fontSize: 12,
              borderRadius: 4,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {location.name}
          </Html>
        </Billboard>
      )}
    </group>
  );
};
