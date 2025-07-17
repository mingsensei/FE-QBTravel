import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, PlaneGeometry, MeshStandardMaterial } from 'three';

interface TerrainMeshProps {
  size: number;
  segments: number;
  heightScale: number;
}

// Simple noise function to replace SimplexNoise
const simpleNoise = (x: number, y: number, scale: number = 1): number => {
  const n = Math.sin(x * scale) * Math.cos(y * scale) + 
           Math.sin(x * scale * 2) * Math.cos(y * scale * 2) * 0.5 +
           Math.sin(x * scale * 4) * Math.cos(y * scale * 4) * 0.25;
  return n / 1.75; // Normalize
};

export const TerrainMesh: React.FC<TerrainMeshProps> = ({ 
  size = 10, 
  segments = 64, 
  heightScale = 2 
}) => {
  const meshRef = useRef<Mesh>(null);
  
  const { geometry, material } = useMemo(() => {
    const geo = new PlaneGeometry(size, size, segments, segments);
    
    // Generate height map for terrain
    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      
      // Create varied terrain with mountains, valleys, and rivers
      let height = 0;
      
      // Base terrain noise
      height += simpleNoise(x, y, 0.1) * heightScale;
      
      // Add mountain ranges (Phong Nha-Ke Bang area)
      if (x < 0) {
        height += Math.max(0, simpleNoise(x, y, 0.05) * heightScale * 2);
      }
      
      // River valleys (lower elevation)
      const riverNoise = simpleNoise(x, y, 0.2) * 0.5;
      if (Math.abs(riverNoise) < 0.2) {
        height -= heightScale * 0.5;
      }
      
      // Coastal area (eastern side - lower elevation)
      if (x > 1) {
        height *= 0.3;
      }
      
      positions.setZ(i, height);
    }
    
    geo.computeVertexNormals();
    
    const mat = new MeshStandardMaterial({
      color: 0x4a7c59,
      roughness: 0.8,
      metalness: 0.1,
      wireframe: false,
    });
    
    return { geometry: geo, material: mat };
  }, [size, segments, heightScale]);

  useFrame(() => {
    if (meshRef.current) {
      // Subtle animation for natural feel
      meshRef.current.rotation.z = Math.sin(Date.now() * 0.0001) * 0.001;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      castShadow
    />
  );
};