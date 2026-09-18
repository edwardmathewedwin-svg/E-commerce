import { PackageSearch } from 'lucide-react';
import type { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
}

/**
 * Renders an array of products into the grid.
 * Each card includes:
 *   - <img>  for the product image
 *   - <h3>   for the product name
 *   - <p>    for the price
 *   - "Add to Cart" button
 *
 * The grid starts EMPTY — no mock data. Products arrive via
 * the fetchProducts() call in App.tsx.
 */
export default function renderProducts({ products, loading, onAddToCart }: ProductGridProps) {
  if (loading) {
    return (
      <div
        id="product-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="gradient-border overflow-hidden rounded-2xl">
            <div className="aspect-square skeleton-shimmer rounded-t-2xl" />
            <div className="p-4 space-y-3">
              <div className="h-3 w-20 skeleton-shimmer rounded" />
              <div className="h-4 w-full skeleton-shimmer rounded" />
              <div className="h-4 w-2/3 skeleton-shimmer rounded" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 w-16 skeleton-shimmer rounded" />
                <div className="h-8 w-24 skeleton-shimmer rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        id="product-grid"
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-neon-cyan/20 blur-3xl rounded-full" />
          <PackageSearch className="w-20 h-20 text-neon-cyan/40 relative z-10" strokeWidth={1.2} />
        </div>
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No products available</h3>
        <p className="text-sm text-gray-600 max-w-sm">
          Products will appear here once the backend is connected.
        </p>
      </div>
    );
  }

  return (
    <div
      id="product-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          index={index}
        />
      ))}
    </div>
  );
}
