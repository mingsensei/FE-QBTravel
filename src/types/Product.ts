export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: ProductType;
  image: string;
  featured: boolean;
  village?: string;
}

export type ProductType = 'Pottery' | 'Embroidery' | 'Bamboo' | 'Food' | 'Honey' | 'Textiles' | 'Jewelry' | 'Woodwork';

export const PRODUCT_TYPES: ProductType[] = [
  'Pottery',
  'Embroidery', 
  'Bamboo',
  'Food',
  'Honey',
  'Textiles',
  'Jewelry',
  'Woodwork'
];