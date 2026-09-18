import { ShoppingBag, LogIn, Zap } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
  isLoggedIn: boolean;
  userEmail: string | null;
  onLogout: () => void;
}

export default function Navbar({
  cartCount,
  onCartClick,
  onLoginClick,
  isLoggedIn,
  userEmail,
  onLogout,
}: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-base-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-glow-cyan transition-transform group-hover:scale-110">
                <Zap className="w-5 h-5 text-base-black" strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="neon-text-cyan">NEX</span>
              <span className="text-white">STORE</span>
            </span>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Cart button */}
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-base-card border border-base-border hover:border-neon-cyan/50 hover:shadow-glow-sm-cyan transition-all duration-300 group"
            >
              <ShoppingBag className="w-5 h-5 text-neon-cyan group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-white hidden sm:inline">Cart</span>
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue text-base-black text-xs font-bold shadow-glow-sm-cyan">
                {cartCount}
              </span>
            </button>

            {/* Login / User */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 hidden md:inline max-w-[160px] truncate">
                  {userEmail}
                </span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 border border-base-border hover:border-neon-purple/50 hover:text-neon-purple hover:shadow-glow-sm-purple transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-base-black bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-glow-cyan transition-all duration-300 hover:scale-105"
              >
                <LogIn className="w-4 h-4" strokeWidth={2.5} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
