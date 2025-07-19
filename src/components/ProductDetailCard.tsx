import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Phone, Mail, Star } from 'lucide-react';
import productImage from '@/assets/product-image.jpg';

// ────────────────────────────────────────────────────────────────────────────
// Kiểu dữ liệu
// ────────────────────────────────────────────────────────────────────────────
export interface SellerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface Product {
  image: string;
  name: string;
  description: string;
  price: number;
  type: string;
  village: string;
  featured: boolean;
  seller: SellerInfo;
}

// Demo product (fallback nếu không truyền props)
const demoProduct: Product = {
  image: productImage,
  name: 'EcoFlow Bamboo Wireless Charger',
  description:
    'Premium eco-friendly wireless charger crafted from sustainable bamboo. Fast charging technology meets environmental consciousness in this beautifully designed charging pad.',
  price: 79.99,
  type: 'Electronics',
  village: 'Green Valley',
  featured: true,
  seller: {
    name: 'GreenTech Solutions',
    phone: '+1 (555) 123-4567',
    email: 'contact@greentech-solutions.com',
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────
interface Props {
  product?: Product; // ← truyền từ modal (nếu không có sẽ dùng demo)
}

const ProductDetailCard: React.FC<Props> = ({ product }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  // Sử dụng props nếu có, ngược lại fallback demo
  const p = product ?? demoProduct;

  // Hành động liên hệ người bán
  const handleContactSeller = (method: 'phone' | 'email') => {
    if (method === 'phone') {
      window.open(`tel:${p.seller.phone}`);
    } else {
      window.open(`mailto:${p.seller.email}?subject=Inquiry about ${p.name}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in">
      <Card className="overflow-hidden bg-gradient-card shadow-soft hover:shadow-hover transition-all duration-300 ease-spring">
        <CardContent className="p-0">
          {/* ── Ảnh + Thông tin ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Ảnh sản phẩm */}
            <div className="relative bg-gradient-sage p-6 lg:p-8">
              <div className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-soft">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-spring"
                  />
                </div>

                {/* Nút hành động */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-10 h-10 rounded-full shadow-soft bg-white/90 backdrop-blur-sm"
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    <Heart
                      className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-10 h-10 rounded-full shadow-soft bg-white/90 backdrop-blur-sm"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Huy hiệu Featured */}
                {p.featured && (
                  <Badge className="absolute bottom-4 left-4 bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="p-6 lg:p-8 space-y-6">
              {/* Tiêu đề & badge */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {p.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {p.village}
                  </Badge>
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{p.name}</h1>
              </div>

              {/* Giá */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">${p.price}</span>
              </div>

              {/* Mô tả */}
              <p className="text-muted-foreground leading-relaxed">{p.description}</p>
            </div>
          </div>

          {/* ── Thông tin người bán & liên hệ ─────────────────────────── */}
          <div className="border-t bg-gradient-sage p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Người bán */}
              <div className="lg:col-span-2">
                <h3 className="font-semibold text-foreground">{p.seller.name}</h3>
              </div>

              {/* Nút liên hệ */}
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

            {/* Chi tiết liên hệ */}
            <div className="mt-6 pt-6 border-t border-border/50 grid gap-4 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{p.seller.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{p.seller.email}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailCard;
