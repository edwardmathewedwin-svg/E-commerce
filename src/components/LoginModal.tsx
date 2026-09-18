import { X, Mail, Lock, Loader2, Zap } from 'lucide-react';
import { useState } from 'react';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
}

export default function LoginModal({ open, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password);
      setEmail('');
      setPassword('');
      onClose();
    } catch {
      setError('Invalid credentials. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-base-black/80 backdrop-blur-md animate-fade-in"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md gradient-border p-8 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg border border-base-border hover:border-neon-pink/50 text-gray-400 hover:text-neon-pink transition-all duration-300"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-glow-cyan mb-3">
            <Zap className="w-7 h-7 text-base-black" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold">
            <span className="neon-text-cyan">NEX</span>
            <span className="text-white">STORE</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-base-card border border-base-border text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-neon-cyan/50 focus:shadow-glow-sm-cyan transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-base-card border border-base-border text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-neon-cyan/50 focus:shadow-glow-sm-cyan transition-all duration-300"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-neon-pink bg-neon-pink/10 border border-neon-pink/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg font-semibold text-base-black bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-glow-cyan transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
