import { Plus, Check, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/types';

interface ProductRowProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
}

function ProductCard({ product, onAddToCart, index }: {
  product: Product;
  onAddToCart: (p: Product) => void;
  index: number;
}) {
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="flex-shrink-0 w-[180px] sm:w-[200px] group cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
    >
      {/* Portrait cover */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-base-cardSolid mb-3 gradient-border">
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        {/* Add button on hover */}
        <button
          onClick={handleAdd}
          className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            added
              ? 'bg-neon-green/20 border border-neon-green/50 text-neon-green shadow-glow-sm-green'
              : 'btn-primary opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
          }`}
        >
          {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* Info */}
      <h3 className="text-sm font-medium text-white truncate group-hover:text-neon-pink transition-colors">
        {product.name}
      </h3>
      {product.category && (
        <p className="text-[10px] font-mono text-gray-600 uppercase tracking-wider mt-0.5">
          {product.category}
        </p>
      )}
      <p className="text-sm font-bold gradient-text font-mono mt-1">
        ${product.price.toFixed(2)}
      </p>
    </div>
  );
}

export default function ProductRow({ products, loading, onAddToCart }: ProductRowProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Recommended for you</h2>

      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[180px] sm:w-[200px]">
              <div className="aspect-[3/4] rounded-xl skeleton mb-3" />
              <div className="h-4 w-3/4 skeleton rounded mb-2" />
              <div className="h-3 w-1/2 skeleton rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-neon-purple/10 blur-3xl rounded-full" />
            <ShoppingBagEmpty />
          </div>
          <p className="text-sm text-gray-600">No products available yet</p>
          <p className="text-xs text-gray-700 mt-1">Products will appear here once the backend is connected.</p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-1 px-1">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ShoppingBagEmpty() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gray-700 relative z-10">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
