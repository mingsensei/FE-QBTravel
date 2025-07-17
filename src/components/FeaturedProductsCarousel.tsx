import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types/Product';

interface FeaturedProductsCarouselProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export const FeaturedProductsCarousel: React.FC<FeaturedProductsCarouselProps> = ({
  products,
  onProductClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredProducts = products.filter(product => product.featured);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === featuredProducts.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? featuredProducts.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === featuredProducts.length - 1 ? 0 : currentIndex + 1);
  };

  if (featuredProducts.length === 0) return null;

  const currentProduct = featuredProducts[currentIndex];

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl mb-8 group shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-transparent z-10" />
        <img
        src={currentProduct.image}
        alt={currentProduct.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">

        <div className="max-w-2xl">

          <h2 className="text-3xl md:text-4xl font-bold mb-3">{currentProduct.name}</h2>
          <p className="text-lg mb-4 text-green-50">{currentProduct.description}</p>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-green-300">
              {currentProduct.price.toLocaleString('vi-VN')} VND
            </span>
            <button
              onClick={() => onProductClick(currentProduct)}
              className="bg-white text-emerald-800 px-6 py-3 rounded-lg font-medium hover:bg-green-50 hover:shadow-md transition-all duration-300 border border-green-200"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-emerald-600/30 hover:bg-emerald-600/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-20 shadow-lg"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-emerald-600/30 hover:bg-emerald-600/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-20 shadow-lg"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 right-4 flex gap-2 z-20">
        {featuredProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-green-300 shadow-md' : 'bg-white/60 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};