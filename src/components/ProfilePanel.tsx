import { User as UserIcon, Mail, Shield, LogOut, Clock, Receipt } from 'lucide-react';
import type { UserProfile, OrderHistoryItem } from '@/types';

interface ProfilePanelProps {
  user: UserProfile;
  orders: OrderHistoryItem[];
  ordersLoading: boolean;
  onLogout: () => void;
}

export default function ProfilePanel({
  user,
  orders,
  ordersLoading,
  onLogout,
}: ProfilePanelProps) {
  return (
    <div className="space-y-5">
      {/* Profile header */}
      <div className="text-center">
        <div className="relative inline-block mb-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center shadow-glow-pink overflow-hidden mx-auto">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-7 h-7 text-white" />
            )}
          </div>
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-neon-green border-2 border-base-dark animate-pulse-dot" />
        </div>
        <h2 className="text-lg font-bold text-white">{user.name}</h2>
        <p className="text-xs text-gray-500 mt-0.5">Online</p>
      </div>

      {/* Profile details */}
      <div className="space-y-2.5 p-4 rounded-xl bg-base-cardSolid border border-base-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neon-pink/10 flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-4 h-4 text-neon-pink" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-wider text-gray-600">Name</p>
            <p className="text-sm text-white truncate">{user.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neon-purple/10 flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-neon-purple" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-wider text-gray-600">Email</p>
            <p className="text-sm text-white truncate">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neon-orange/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-neon-orange" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-wider text-gray-600">Role</p>
            <p className="text-sm text-white capitalize truncate">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Activity feed / Order history */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-neon-pink" />
          <h3 className="text-sm font-semibold text-white">Activity Feed</h3>
        </div>

        {ordersLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl skeleton" />
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Receipt className="w-10 h-10 text-gray-800 mb-2" strokeWidth={1.2} />
            <p className="text-xs text-gray-600">No orders yet</p>
            <p className="text-[10px] text-gray-700 mt-0.5">Your purchase history will show here</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {orders.map((order, i) => {
              // Safe number formatting check to prevent toFixed undefined crashes
              const rawTotal = (order as any).total ?? (order as any).price ?? 0;
              const numericTotal = typeof rawTotal === 'number' ? rawTotal : parseFloat(rawTotal) || 0;

              return (
                <div
                  key={order.id ?? i}
                  className="flex items-center justify-between p-3 rounded-xl bg-base-cardSolid border border-base-border hover:border-neon-pink/20 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">{order.product_name || 'Order #' + order.id}</p>
                    <p className="text-[10px] text-gray-600 font-mono mt-0.5">
                      {order.date ? new Date(order.date).toLocaleDateString() : 'Recent'}
                      {order.status && ` · ${order.status}`}
                    </p>
                  </div>
                  <p className="text-sm font-bold gradient-text font-mono ml-2">
                    ${numericTotal.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full py-2.5 rounded-lg text-sm font-medium text-gray-400 border border-base-border hover:border-neon-pink/40 hover:text-neon-pink hover:shadow-glow-sm-pink transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}