import { ShoppingBag, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Product } from '@/types';

interface HeroSectionProps {
  products: Product[];
  loading: boolean;
  onBuy: (product: Product) => void;
}

export default function HeroSection({ products, loading, onBuy }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically cycle through products every 3 seconds
  useEffect(() => {
    if (!products || products.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [products]);

  if (loading) {
    return (
      <div className="relative h-[400px] sm:h-[460px] rounded-2xl overflow-hidden skeleton" />
    );
  }

  const featured = products.length > 0 ? products[currentIndex] : null;

  if (!featured) {
    return (
      <div className="relative h-[300px] sm:h-[360px] rounded-2xl overflow-hidden gradient-border flex flex-col items-center justify-center text-center px-6">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-neon-pink/15 blur-3xl rounded-full" />
          <Sparkles className="w-14 h-14 text-neon-pink/30 relative z-10" strokeWidth={1.2} />
        </div>
        <h2 className="text-xl font-semibold text-gray-500">No featured product</h2>
        <p className="text-sm text-gray-700 mt-1 max-w-sm">
          A featured banner will appear here once products are loaded from the backend.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] sm:h-[460px] rounded-2xl overflow-hidden group animate-fade-in">
      {/* Background image with smooth transition */}
      <img
        key={featured.id}
        src={featured.banner_url || featured.image_url}
        alt={featured.name}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 animate-fade-in"
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-base-black via-base-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-base-black/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        {featured.tag && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-pink/20 border border-neon-pink/30 mb-4">
            <Sparkles className="w-3 h-3 text-neon-pink" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-neon-pink">
              {featured.tag}
            </span>
          </div>
        )}
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2 max-w-2xl leading-tight">
          {featured.name}
        </h1>
        {featured.description && (
          <p className="text-sm sm:text-base text-gray-400 mb-6 max-w-xl line-clamp-2">
            {featured.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onBuy(featured)}
              className="btn-primary px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              Buy Now
            </button>
            <span className="text-2xl sm:text-3xl font-bold gradient-text font-mono">
              ${typeof featured.price === 'number' ? featured.price.toFixed(2) : featured.price}
            </span>
          </div>

          {/* Slide indicators / Dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {products.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-neon-pink' : 'w-1.5 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}