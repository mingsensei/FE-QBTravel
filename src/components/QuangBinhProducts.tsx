import React, { useState, useMemo, useEffect } from 'react';
import { FeaturedProductsCarousel } from './FeaturedProductsCarousel';
import { ProductFilter } from './ProductFilter';
import { ProductGrid } from './ProductGrid';
import { Product, ProductType } from '../types/Product';
import ProductDetailCard from "@/components/ProductDetailCard.tsx";

export const QuangBinhProducts: React.FC = () => {
  const [selectedTypes, setSelectedTypes] = useState<ProductType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products from API
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8081/api/products', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
        .then(res => {
          if (!res.ok) throw new Error('Failed to load products');
          return res.json();
        })
        .then(data => {
          setProducts(data);
          setError(null);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
          selectedTypes.length === 0 || selectedTypes.includes(product.type as ProductType);
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedTypes, products]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => setSelectedProduct(null);

  // Prevent scroll on body when modal open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProduct]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center text-xl text-primary">
          Đang tải sản phẩm...
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
          Lỗi: {error}
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 pt-24 relative">
        {/* Modal Overlay */}
        {selectedProduct && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                aria-modal="true"
                role="dialog"
            >
              {/* Backdrop */}
              <div
                  className="absolute inset-0 bg-black bg-opacity-40 transition-opacity"
                  onClick={handleCloseModal}
              />
              {/* Modal Card */}
              <div className="relative z-10 max-w-lg w-full mx-4">
                {/* Close button */}
                <button
                    onClick={handleCloseModal}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-lg border border-gray-200 text-gray-700 transition"
                    aria-label="Đóng"
                >
                  <svg width={22} height={22} viewBox="0 0 20 20" fill="none">
                    <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth={2} strokeLinecap="round"/>
                  </svg>
                </button>
                <ProductDetailCard  />
              </div>
            </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Quang Binh Traditional Products
              </h1>
              <p className="text-xl text-green-100 mb-8">
                Discover authentic handmade crafts and local specialties from the heart of Vietnam.
                Each product tells a story of tradition, skill, and cultural heritage.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-emerald-500/30 px-4 py-2 rounded-full backdrop-blur-sm border border-green-300/30">
                  <span className="text-sm font-medium">🏺 Traditional Crafts</span>
                </div>
                <div className="bg-emerald-500/30 px-4 py-2 rounded-full backdrop-blur-sm border border-green-300/30">
                  <span className="text-sm font-medium">🍯 Local Specialties</span>
                </div>
                <div className="bg-emerald-500/30 px-4 py-2 rounded-full backdrop-blur-sm border border-green-300/30">
                  <span className="text-sm font-medium">🎨 Handmade Art</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Featured Products Carousel */}
          <FeaturedProductsCarousel
              products={products}
              onProductClick={handleProductClick}
          />

          {/* Filter Component */}
          <ProductFilter
              selectedTypes={selectedTypes}
              onTypeChange={setSelectedTypes}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
          />

          {/* Results Summary */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-emerald-800 mb-2">
              {selectedTypes.length > 0 || searchTerm ? 'Filtered Products' : 'All Products'}
            </h2>
            <p className="text-emerald-600">
              Showing {filteredProducts.length} of {products.length} products
              {selectedTypes.length > 0 && (
                  <span className="ml-2">
                in {selectedTypes.join(', ')}
              </span>
              )}
              {searchTerm && (
                  <span className="ml-2">
                matching "{searchTerm}"
              </span>
              )}
            </p>
          </div>

          {/* Product Grid */}
          <ProductGrid
              products={filteredProducts}
              onProductClick={handleProductClick}
          />
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-900 text-white py-12 mt-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M20%2020c0%2011.046-8.954%2020-20%2020v20h40V20H20z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-4">Support Local Artisans</h3>
            <p className="text-green-200 max-w-2xl mx-auto mb-6">
              Every purchase supports local communities and helps preserve traditional crafts
              that have been passed down through generations in Quang Binh province.
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-300">{products.length}</div>
                <div className="text-green-200">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-300">8</div>
                <div className="text-green-200">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-300">15+</div>
                <div className="text-green-200">Villages</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
