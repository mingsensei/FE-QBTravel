import React from 'react';
import { Search, Filter } from 'lucide-react';
import { ProductType, PRODUCT_TYPES } from '../types/Product';

interface ProductFilterProps {
  selectedTypes: ProductType[];
  onTypeChange: (types: ProductType[]) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  selectedTypes,
  onTypeChange,
  searchTerm,
  onSearchChange
}) => {
  const handleTypeToggle = (type: ProductType) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  const clearFilters = () => {
    onTypeChange([]);
    onSearchChange('');
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md border border-green-200 p-6 mb-8 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <Filter size={20} className="text-emerald-600" />
        <h3 className="text-lg font-semibold text-emerald-800">Filter Products</h3>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white"
        />
      </div>

      {/* Category Filters */}
      <div className="space-y-4">
        <h4 className="font-medium text-emerald-800">Product Categories</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PRODUCT_TYPES.map((type) => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeToggle(type)}
                className="w-4 h-4 text-emerald-600 bg-green-50 border-green-300 rounded focus:ring-emerald-500 focus:ring-2 transition-colors"
              />
              <span className="text-sm text-emerald-700 group-hover:text-emerald-800 transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedTypes.length > 0 || searchTerm) && (
        <button
          onClick={clearFilters}
          className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-300 hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};