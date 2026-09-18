import { X, Plus, Minus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { CartItem } from '@/types';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onPlaceOrder: () => void;
}

export default function CartDrawer({
  open,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
}: CartDrawerProps) {
  const [placing, setPlacing] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    await onPlaceOrder();
    setPlacing(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-base-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass-panel border-l border-base-border flex flex-col transition-transform duration-400 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-base-border">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-neon-cyan" />
            <h2 className="text-lg font-bold text-white">
              Cart <span className="text-sm font-normal text-gray-500">({totalItems})</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-base-border hover:border-neon-pink/50 hover:text-neon-pink text-gray-400 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-neon-cyan/10 blur-3xl rounded-full" />
                <ShoppingBag className="w-16 h-16 text-gray-700 relative z-10" strokeWidth={1.2} />
              </div>
              <p className="text-gray-500 text-sm">Your cart is empty</p>
              <p className="text-gray-700 text-xs mt-1">Add products to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="flex gap-3 p-3 rounded-xl bg-base-card border border-base-border hover:border-neon-cyan/20 transition-all duration-300 animate-slide-up"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-base-black flex-shrink-0">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{item.product.name}</h4>
                    <p className="text-sm font-mono text-neon-cyan mt-0.5">
                      ${item.product.price.toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(index, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md border border-base-border hover:border-neon-cyan/50 text-gray-400 hover:text-neon-cyan transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-mono text-white w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md border border-base-border hover:border-neon-cyan/50 text-gray-400 hover:text-neon-cyan transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="ml-auto w-7 h-7 flex items-center justify-center rounded-md border border-base-border hover:border-neon-pink/50 text-gray-500 hover:text-neon-pink transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-base-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Total</span>
              <span className="text-2xl font-bold gradient-text font-mono">
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full py-3.5 rounded-xl font-semibold text-base-black bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-glow-cyan transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {placing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <span>Place Order</span>
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
