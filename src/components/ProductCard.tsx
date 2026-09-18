import { Plus, Check } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  index: number;
}

export default function ProductCard({ product, onAddToCart, index }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="group relative gradient-border overflow-hidden transition-all duration-500 hover:scale-[1.02] animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms`, opacity: 0 }}
    >
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-base-card rounded-t-2xl">
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton-shimmer" />
        )}
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Product info */}
      <div className="p-4 space-y-3">
        {product.category && (
          <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-neon-cyan/70 px-2 py-0.5 rounded border border-neon-cyan/20">
            {product.category}
          </span>
        )}
        <h3 className="text-base font-semibold text-white leading-snug line-clamp-2 group-hover:text-neon-cyan transition-colors duration-300">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          <p className="text-lg font-bold gradient-text font-mono">
            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
          </p>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              added
                ? 'bg-neon-green/20 text-neon-green border border-neon-green/40 shadow-glow-green'
                : 'bg-gradient-to-r from-neon-cyan to-neon-blue text-base-black hover:shadow-glow-cyan hover:scale-105'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" strokeWidth={2.5} />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
