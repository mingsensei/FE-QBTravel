import React from 'react';
import { MapPin, Star } from 'lucide-react';
import { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
      <div
          onClick={() => onClick(product)}
          className="
        bg-gradient-to-br from-white to-green-50/30 rounded-xl shadow-md border border-green-200
        overflow-hidden cursor-pointer group hover:shadow-xl hover:shadow-green-200/50
        transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300
        w-full max-w-xs min-h-[410px] aspect-[3/4] flex flex-col
      "
      >
        {/* Image area - always same aspect ratio */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {product.featured && (
              <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-md">
              <Star size={12} fill="currentColor" />
              Featured
            </span>
              </div>
          )}
          <div className="absolute top-3 right-3">
          <span className="bg-green-100/90 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-green-200/50">
            {product.type}
          </span>
          </div>
        </div>

        {/* Info area */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-emerald-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
              {product.name}
            </h3>
            <p className="text-emerald-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            {product.village && (
                <div className="flex items-center gap-1 mb-3">
                  <MapPin size={14} className="text-green-500" />
                  <span className="text-xs text-green-600">{product.village}</span>
                </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-bold text-emerald-700">
            {product.price.toLocaleString('vi-VN')} VND
          </span>
            <button className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg">
              View Details
            </button>
          </div>
        </div>
      </div>
  );
};
