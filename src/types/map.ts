export interface LocationPoint {
  id: string;
  name: string;
  type: 'attraction' | 'craft-village';
  position: [number, number, number]; // x, y, z coordinates for 3D positioning
  coordinates: [number, number]; // Real lat, lng coordinates for Mapbox
  description: string;
  images: string[];
  rating: number;
  reviews: Review[];
  checkIns: number;
  category: string;
  highlights: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface MapCamera {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface TerrainData {
  heightMap: number[][];
  rivers: River[];
  mountains: Mountain[];
  forests: Forest[];
}

export interface River {
  id: string;
  name: string;
  path: [number, number, number][];
  width: number;
}

export interface Mountain {
  id: string;
  name: string;
  peak: [number, number, number];
  radius: number;
  height: number;
}

export interface Forest {
  id: string;
  boundary: [number, number][];
  density: number;
  type: 'tropical' | 'bamboo' | 'mangrove';
}