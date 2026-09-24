import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import LeftSidebar from '@/components/LeftSidebar';
import HeroSection from '@/components/HeroSection';
import ProductRow from '@/components/ProductRow';
import AuthPanel from '@/components/AuthPanel';
import ProfilePanel from '@/components/ProfilePanel';
import Toast from '@/components/Toast';

import {
  fetchProducts,
  fetchUserProfile,
  fetchOrderHistory,
  fetchCategories,
  fetchLibraryGames,
  deleteLibraryGame,
  apiLogin,
  apiSignup,
  apiResetPassword,
  apiLogout,
  supabase,
} from './api';
import type { Product, UserProfile, OrderHistoryItem, CartItem } from '@/types';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [libraryGames, setLibraryGames] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeNav, setActiveNav] = useState('store');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedGame, setSelectedGame] = useState<Product | null>(null);
  const [showAllGames, setShowAllGames] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Product | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', show: false });

  const loadLibrary = useCallback(async () => {
    try {
      const games = await fetchLibraryGames();
      setLibraryGames(games);
    } catch {
      setLibraryGames([]);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const data = await fetchOrderHistory();
      setOrders(data);
      loadLibrary();
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [loadLibrary]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setProductsLoading(true);
      try {
        const [prodData, catData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        if (mounted) {
          setProducts(prodData);
          setCategories(catData);
        }
      } catch {
        if (mounted) {
          setProducts([]);
          setCategories([]);
        }
      } finally {
        if (mounted) setProductsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const profile = await fetchUserProfile();
        if (mounted && profile) {
          setUser(profile);
          loadOrders();
        }
      } catch {
        // Not logged in
      } finally {
        if (mounted) setSessionLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [loadOrders]);

  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      const profile = await apiLogin(email, password);
      setUser(profile);
      setToast({ message: `Welcome back, ${profile.name}!`, show: true });
      loadOrders();
    } catch (err: any) {
      setToast({ message: `Login failed: ${err.message}`, show: true });
    }
  }, [loadOrders]);

  const handleSignup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const profile = await apiSignup(name, email, password);
      setUser(profile);
      setToast({ message: `Account created! Welcome, ${profile.name}.`, show: true });
    } catch (err: any) {
      setToast({ message: `Signup failed: ${err.message}`, show: true });
    }
  }, []);

  const handleResetPassword = useCallback(async (email: string) => {
    try {
      await apiResetPassword(email);
      setToast({ message: 'Password reset email sent!', show: true });
    } catch (err: any) {
      setToast({ message: `Reset failed: ${err.message}`, show: true });
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await apiLogout();
      setUser(null);
      setOrders([]);
      setLibraryGames([]);
      setActiveNav('store');
      setToast({ message: 'Signed out', show: true });
    } catch (err: any) {
      setToast({ message: `Logout failed: ${err.message}`, show: true });
    }
  }, []);

  const addToCart = useCallback((product: Product) => {
    const alreadyOwned = libraryGames.some((game) => game.id === product.id);
    if (alreadyOwned) {
      setToast({ message: `You already own ${product.name}! Check your Library.`, show: true });
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setToast({ message: `${product.name} added to cart`, show: true });
  }, [libraryGames]);

  const updateQuantity = useCallback((productId: string | number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  }, []);

  const confirmDeleteGame = useCallback(async () => {
    if (!gameToDelete) return;

    try {
      await deleteLibraryGame(gameToDelete.id);
      setLibraryGames((prev) => prev.filter((g) => g.id !== gameToDelete.id));
      setToast({ message: `${gameToDelete.name} removed from your library.`, show: true });
    } catch (err: any) {
      setToast({ message: `Failed to delete: ${err.message}`, show: true });
    } finally {
      setGameToDelete(null);
    }
  }, [gameToDelete]);

  const handleCheckout = useCallback(async () => {
    if (cart.length === 0 || !user) return;

    const validCartItems = cart.filter(
      (item) => !libraryGames.some((game) => game.id === item.product.id)
    );

    if (validCartItems.length === 0) {
      setCart([]);
      setToast({ message: 'You already own all the items in your cart!', show: true });
      setActiveNav('library');
      return;
    }

    const totalAmount = validCartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    try {
      // 1. Insert into orders table (saving customer reference)
      const { data: orderData, error: orderError } = await supabase.from('orders').insert([
        {
          customer_id: user.id || null,
          order_date: new Date().toISOString(),
          total_amount: totalAmount,
          status: 'Completed'
        }
      ]).select().single();

      if (orderError) throw orderError;

      // 2. Insert into order_details table (saving game name & customer name)
      const orderDetailsPayload = validCartItems.map(item => ({
        order_id: orderData.order_id,
        product_id: item.product.id,
        product_name: item.product.name,
        customer_name: user.name || user.email,
        quantity: item.quantity,
        unit_price: item.product.price
      }));

      const { error: detailsError } = await supabase.from('order_details').insert(orderDetailsPayload);
      if (detailsError) throw detailsError;

      // 3. Insert into payments table with "Payment Completed" status
      const { error: paymentError } = await supabase.from('payments').insert([
        {
          order_id: orderData.order_id,
          payment_date: new Date().toISOString(),
          amount: totalAmount,
          payment_method: 'Online Card',
          payment_status: 'Payment Completed'
        }
      ]);

      if (paymentError) throw paymentError;

      setCart([]);
      setToast({ message: 'Purchase successful! Games added to your Library.', show: true });
      loadOrders();
      setActiveNav('library');
    } catch (err: any) {
      setToast({ message: `Checkout failed: ${err.message}`, show: true });
    }
  }, [cart, libraryGames, loadOrders, user]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filtered = products.filter((p: any) => {
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesCategory = selectedCategory !== null
      ? Number(p.category_id) === Number(selectedCategory)
      : true;

    return matchesSearch && matchesCategory;
  });

  if (sessionLoading) {
    return (
      <div className="h-screen w-screen bg-base-black flex items-center justify-center text-white">
        <div className="animate-pulse text-neon-pink font-semibold">Loading NEXUS...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen bg-base-black text-white relative flex items-center justify-center overflow-hidden">
        <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
        <div className="glow-dot w-[600px] h-[600px] bg-neon-pink/10 top-[-100px] left-[100px]" />
        <div className="glow-dot w-[700px] h-[700px] bg-neon-purple/8 bottom-[-150px] right-[-100px]" />

        <div className="relative z-10 w-full max-w-md p-8 rounded-2xl glass-card border border-base-border shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">NEXUS</h1>
            <p className="text-sm text-gray-400">Sign in or create an account to access the gaming store.</p>
          </div>
          <AuthPanel
            onLogin={handleLogin}
            onSignup={handleSignup}
            onResetPassword={handleResetPassword}
          />
        </div>

        <Toast
          message={toast.message}
          show={toast.show}
          onClose={() => setToast({ message: '', show: false })}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-base-black text-white flex relative">
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
      <div className="glow-dot w-[500px] h-[500px] bg-neon-pink/8 top-[-100px] left-[200px]" />
      <div className="glow-dot w-[600px] h-[600px] bg-neon-purple/6 bottom-[-200px] right-[-100px]" />

      <div className="h-screen flex-shrink-0 sticky top-0 z-20">
        <LeftSidebar
          activeNav={activeNav}
          onNavClick={(nav) => {
            setActiveNav(nav);
            setSelectedGame(null);
            setShowAllGames(false);
          }}
          cartCount={cartCount}
          user={user}
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
      </div>

      <main className="flex-1 h-screen overflow-y-auto px-4 sm:px-12 py-6 z-10">
        {/* Mobile Header Bar with Hamburger Menu Trigger */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl glass-card border border-base-border text-neon-pink cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold tracking-wider neon-text-pink">NEXUS</span>
          <div className="w-10" />
        </div>

        {activeNav === 'store' && (
          <>
            {selectedGame ? (
              <div className="space-y-6 w-full animate-fade-in">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="text-sm font-mono text-gray-400 hover:text-white transition-colors mb-2 cursor-pointer"
                >
                  ← Back to Store
                </button>

                <div className="relative h-[380px] sm:h-[450px] rounded-2xl overflow-hidden glass-card border border-base-border">
                  <img
                    src={selectedGame.banner_url || selectedGame.image_url}
                    alt={selectedGame.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-black via-base-black/50 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-4">
                    <h1 className="text-3xl sm:text-5xl font-bold text-white">{selectedGame.name}</h1>
                    <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
                      {selectedGame.description || 'Immerse yourself in an epic gaming experience with breathtaking visuals and thrilling gameplay.'}
                    </p>

                    <div className="flex items-center gap-6 pt-2">
                      <span className="text-2xl sm:text-3xl font-bold gradient-text font-mono">
                        ${typeof selectedGame.price === 'number' ? selectedGame.price.toFixed(2) : selectedGame.price}
                      </span>
                      <button
                        onClick={() => {
                          addToCart(selectedGame);
                          setSelectedGame(null);
                        }}
                        className="btn-primary px-8 py-3.5 rounded-xl font-semibold text-base flex items-center gap-2 shadow-glow-pink cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : showAllGames ? (
              <div className="space-y-6 w-full animate-fade-in">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowAllGames(false)}
                    className="text-sm font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    ← Back to Featured Store
                  </button>
                  <span className="text-xs font-mono text-neon-pink bg-neon-pink/10 px-3 py-1 rounded-full border border-neon-pink/30">
                    Full Catalog ({products.length} Games)
                  </span>
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">All Available Games</h1>
                  <p className="text-gray-400 text-sm mt-1">Browse and discover every title in the NEXUS catalog.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
                  {products.map((product) => (
                    <div key={product.id} className="p-4 rounded-2xl glass-card border border-base-border space-y-3 group hover:border-neon-pink/40 transition-all">
                      <img src={product.image_url || product.image} alt={product.name} className="w-full h-44 object-cover rounded-xl group-hover:scale-[1.02] transition-transform" />
                      <div>
                        <h3 className="font-semibold text-white truncate">{product.name}</h3>
                        <p className="text-sm font-mono text-neon-pink mt-1">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setSelectedGame(product)}
                          className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-base-border text-xs font-semibold text-gray-300 transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => addToCart(product)}
                          className="btn-primary flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search the store..."
                      className="w-full pl-12 pr-4 py-3 rounded-xl glass-card border border-base-border text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-neon-pink/40 focus:shadow-glow-sm-pink transition-all duration-300"
                    />
                  </div>

                  {selectedCategory !== null && (
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-neon-pink/10 border border-neon-pink/30 text-sm">
                      <span className="text-gray-300">
                        Filtered by category: <strong className="text-neon-pink">
                          {categories.find(c => Number(c.category_id) === Number(selectedCategory))?.category_name || 'Collection'}
                        </strong>
                      </span>
                      <button 
                        onClick={() => setSelectedCategory(null)}
                        className="text-xs font-mono text-neon-pink hover:underline font-semibold cursor-pointer"
                      >
                        Clear Filter
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <HeroSection
                    products={products}
                    loading={productsLoading}
                    onBuy={(product) => setSelectedGame(product)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight text-white">Recommended for you</h2>
                    <button
                      onClick={() => setShowAllGames(true)}
                      className="text-xs font-mono text-neon-pink hover:underline cursor-pointer"
                    >
                      View All &gt;
                    </button>
                  </div>

                  <ProductRow
                    products={filtered.slice(0, 4)}
                    loading={productsLoading}
                    onAddToCart={addToCart}
                  />
                </div>
              </>
            )}
          </>
        )}

        {activeNav === 'cart' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight">Your Cart</h1>
            {cart.length === 0 ? (
              <p className="text-gray-400">Your cart is currently empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between p-4 rounded-xl glass-card border border-base-border">
                    <div className="flex items-center space-x-4">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div>
                        <h3 className="font-medium text-white">{item.product.name}</h3>
                        <p className="text-sm text-gray-400">${item.product.price} each</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2 bg-base-card border border-base-border rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-7 h-7 flex items-center justify-center rounded bg-white/5 hover:bg-neon-pink/20 hover:text-neon-pink transition-colors text-white font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-mono font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded bg-white/5 hover:bg-neon-pink/20 hover:text-neon-pink transition-colors text-white font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-semibold text-neon-pink min-w-[80px] text-right font-mono">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                
                <div className="pt-6 border-t border-base-border flex flex-col sm:flex-row justify-between items-center px-2 gap-4">
                  <div>
                    <span className="text-gray-400 text-sm">Total Amount: </span>
                    <span className="text-2xl font-bold text-neon-pink font-mono">
                      ${cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="btn-primary w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2 shadow-glow-pink cursor-pointer"
                  >
                    Complete Purchase
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeNav === 'library' && (
          <div className="space-y-6 w-full animate-fade-in relative">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Your Library</h1>
              <p className="text-gray-400 text-sm mt-1">Access and download your purchased games.</p>
            </div>

            {libraryGames.length === 0 ? (
              <div className="p-12 rounded-2xl glass-card border border-base-border text-center space-y-3">
                <p className="text-gray-400">Your library is empty. Purchase a game from the store to unlock it here!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {libraryGames.map((game) => (
                  <div key={game.id} className="p-4 rounded-2xl glass-card border border-base-border space-y-4 group">
                    <img src={game.image_url || game.image} alt={game.name} className="w-full h-48 object-cover rounded-xl" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{game.name}</h3>
                      <p className="text-xs text-neon-pink font-mono mt-1">Ready to install</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setToast({ message: `Downloading ${game.name}...`, show: true })}
                        className="btn-primary flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => setGameToDelete(game)}
                        className="px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-sm font-semibold transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {gameToDelete && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="glass-card border border-base-border p-6 rounded-2xl max-w-sm w-full space-y-4 text-center">
                  <h3 className="text-lg font-bold text-white">Are you sure to delete this game?</h3>
                  <p className="text-sm text-gray-400">
                    This will remove <span className="text-white font-semibold">{gameToDelete.name}</span> from your library collection.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setGameToDelete(null)}
                      className="flex-1 py-2.5 rounded-xl bg-white/5 border border-base-border text-gray-300 hover:bg-white/10 text-sm font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteGame}
                      className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold shadow-lg cursor-pointer"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeNav === 'categories' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
              <p className="text-gray-400 text-sm mt-1">Browse product collections by category.</p>
            </div>

            {categories.length === 0 ? (
              <p className="text-gray-500">No categories found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div 
                    key={cat.category_id} 
                    onClick={() => {
                      setSelectedCategory(cat.category_id);
                      setActiveNav('store');
                      setSelectedGame(null);
                    }}
                    className="p-6 rounded-2xl glass-card border border-base-border hover:border-neon-pink/40 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center text-neon-pink font-bold mb-4 group-hover:scale-110 transition-transform">
                      {cat.category_name.charAt(0)}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neon-pink transition-colors">
                      {cat.category_name}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {cat.description || 'Explore items in this collection.'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeNav === 'settings' && (
          <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
              <p className="text-gray-400 text-sm mt-1">Manage your store preferences and system configuration.</p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl glass-card border border-base-border space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">Appearance & Theme</h3>
                
                <div className="flex items-center justify-between py-2 border-b border-base-border">
                  <div>
                    <p className="text-sm text-gray-200 font-medium">Neon Contrast Glow</p>
                    <p className="text-xs text-gray-500">Enhance high-contrast deep black futuristic borders</p>
                  </div>
                  <span className="text-xs font-mono text-neon-pink bg-neon-pink/10 px-2.5 py-1 rounded-lg border border-neon-pink/30">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm text-gray-200 font-medium">Interface Accent</p>
                    <p className="text-xs text-gray-500">Cyberpunk Pink & Blue Theme</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-neon-pink shadow-glow-sm-pink cursor-pointer" />
                    <div className="w-6 h-6 rounded-full bg-neon-purple cursor-pointer" />
                    <div className="w-6 h-6 rounded-full bg-neon-blue cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl glass-card border border-base-border space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">Store Preferences</h3>

                <div className="flex items-center justify-between py-2 border-b border-base-border">
                  <div>
                    <p className="text-sm text-gray-200 font-medium">Library Auto-Download</p>
                    <p className="text-xs text-gray-500">Automatically queue game installers after purchase</p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-neon-pink w-4 h-4 cursor-pointer" />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm text-gray-200 font-medium">Desktop Notifications</p>
                    <p className="text-xs text-gray-500">Receive alerts for sales, updates, and library changes</p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-neon-pink w-4 h-4 cursor-pointer" />
                </div>
              </div>

              <div className="p-5 rounded-2xl glass-card border border-base-border space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">Database & Session</h3>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm text-gray-200 font-medium">Active Database Connection</p>
                    <p className="text-xs text-gray-500">Supabase PostgreSQL Schema (Connected)</p>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-neon-green animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeNav === 'profile' && (
          <div className="space-y-6 max-w-xl mx-auto animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Profile & Orders</h1>
              <p className="text-gray-400 text-sm mt-1">Manage your account details and view purchase history.</p>
            </div>

            {user ? (
              <ProfilePanel
                user={user}
                orders={orders || []}
                ordersLoading={ordersLoading}
                onLogout={handleLogout}
              />
            ) : (
              <div className="p-8 rounded-2xl glass-card border border-base-border text-center">
                <p className="text-gray-400">Please sign in to view your profile.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ message: '', show: false })}
      />
    </div>
  );
}

export default App;
