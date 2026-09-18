import {
  Gamepad2,
  Store,
  Library,
  LayoutGrid,
  ShoppingCart,
  Settings,
  User,
} from 'lucide-react';
import type { UserProfile } from '@/types';

interface LeftSidebarProps {
  activeNav: string;
  onNavClick: (item: string) => void;
  cartCount: number;
  user: UserProfile | null;
}

const navItems = [
  { id: 'store', label: 'Store', icon: Store },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'categories', label: 'Categories', icon: LayoutGrid },
  { id: 'cart', label: 'Cart', icon: ShoppingCart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function LeftSidebar({
  activeNav,
  onNavClick,
  cartCount,
  user,
}: LeftSidebarProps) {
  return (
    <aside className="w-[230px] flex-shrink-0 h-screen sticky top-0 glass border-r border-base-border flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-base-border">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center shadow-glow-pink">
            <Gamepad2 className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-base font-bold leading-none">
              <span className="neon-text-pink">NEXUS</span>
            </h1>
            <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mt-0.5">
              Game Store
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group relative ${
                active
                  ? 'bg-gradient-to-r from-neon-pink/15 to-transparent text-white'
                  : 'text-gray-500 hover:text-white hover:bg-base-hover/50'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-neon-pink shadow-glow-sm-pink" />
              )}
              <Icon
                className={`w-4.5 h-4.5 transition-all ${
                  active ? 'text-neon-pink' : 'text-gray-600 group-hover:text-neon-pink/70'
                }`}
                size={18}
              />
              <span>{item.label}</span>
              {item.id === 'cart' && cartCount > 0 && (
                <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-neon-pink text-white text-[10px] font-bold shadow-glow-sm-pink">
                  {cartCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User snippet at bottom - clicking opens the profile panel */}
      <div className="px-3 py-4 border-t border-base-border">
        {user ? (
          <div 
            onClick={() => onNavClick('profile')}
            className={`flex items-center gap-3 px-2 py-2 rounded-xl transition-colors cursor-pointer group ${
              activeNav === 'profile' ? 'bg-neon-pink/15 text-white' : 'hover:bg-base-hover/50 text-gray-400'
            }`}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center overflow-hidden">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-neon-green border-2 border-base-dark animate-pulse-dot" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-[10px] text-neon-green font-mono">Online</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-base-border flex items-center justify-center">
              <User className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Guest</p>
              <p className="text-[10px] text-gray-700 font-mono">Offline</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}