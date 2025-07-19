import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Phone, Mail, Star, Zap, Leaf, Shield, Truck } from 'lucide-react';
import productImage from '@/assets/product-image.jpg';

// TypeScript interfaces for simplified product data structure
interface SellerInfo {
  name: string;
  phone: string;
  email: string;
}

interface Product {
  image: string;
  name: string;
  description: string;
  price: number;
  type: string;
  village: string;
  featured: boolean;
  seller: SellerInfo;
}

// Demo product data - simplified for end users
const demoProduct: Product = {
  image: productImage,
  name: "EcoFlow Bamboo Wireless Charger",
  description: "Premium eco-friendly wireless charger crafted from sustainable bamboo. Fast charging technology meets environmental consciousness in this beautifully designed charging pad.",
  price: 79.99,
  type: "Electronics",
  village: "Green Valley",
  featured: true,
  seller: {
    name: "GreenTech Solutions",
    phone: "+1 (555) 123-4567",
    email: "contact@greentech-solutions.com"
  }
};

/**
 * ProductDetailCard Component
 * 
 * A comprehensive, mobile-first product detail card that displays:
 * - Product image with interactive features
 * - Complete product information and specifications  
 * - Seller contact information and verification
 * - Responsive design optimized for all screen sizes
 * - Nature-inspired green color theme
 */
const ProductDetailCard: React.FC = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  // Handle contact seller action
  const handleContactSeller = (method: 'phone' | 'email') => {
    if (method === 'phone') {
      window.open(`tel:${demoProduct.seller.phone}`);
    } else {
      window.open(`mailto:${demoProduct.seller.email}?subject=Inquiry about ${demoProduct.name}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in">
      <Card className="overflow-hidden bg-gradient-card shadow-soft hover:shadow-hover transition-all duration-300 ease-spring">
        <CardContent className="p-0">
          {/* Mobile-first layout: stacked on mobile, side-by-side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            
            {/* Product Image Section */}
            <div className="relative bg-gradient-sage p-6 lg:p-8">
              <div className="relative group">
                {/* Main product image */}
                <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-soft">
                  <img
                    src={demoProduct.image}
                    alt={demoProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-spring"
                  />
                </div>
                
                {/* Action buttons overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-10 h-10 rounded-full shadow-soft bg-white/90 backdrop-blur-sm"
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-10 h-10 rounded-full shadow-soft bg-white/90 backdrop-blur-sm"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Featured badge */}
                {demoProduct.featured && (
                  <Badge className="absolute bottom-4 left-4 bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Information Section */}
            <div className="p-6 lg:p-8 space-y-6">
              
              {/* Header: Type and Village */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {demoProduct.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {demoProduct.village}
                  </Badge>
                </div>
                
                {/* Product name */}
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                    {demoProduct.name}
                  </h1>
                </div>
              </div>

              {/* Price Section */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  ${demoProduct.price}
                </span>
              </div>

              {/* Product Description */}
              <p className="text-muted-foreground leading-relaxed">
                {demoProduct.description}
              </p>
            </div>
          </div>

          {/* Seller Information & Contact Section */}
          <div className="border-t bg-gradient-sage p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Seller Info */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{demoProduct.seller.name}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-nature hover:bg-primary-hover shadow-nature"
                  onClick={() => handleContactSeller('phone')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Seller
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => handleContactSeller('email')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>

            {/* Contact Details */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{demoProduct.seller.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{demoProduct.seller.email}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailCard;