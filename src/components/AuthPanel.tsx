import { useState } from 'react';
import { Mail, Lock, User as UserIcon, Loader2, KeyRound, Gamepad2 } from 'lucide-react';
import type { UserProfile } from '@/types';

interface AuthPanelProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (name: string, email: string, password: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<void>;
}

type Tab = 'signin' | 'signup' | 'forgot';

export default function AuthPanel({ onLogin, onSignup, onResetPassword }: AuthPanelProps) {
  const [tab, setTab] = useState<Tab>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      if (tab === 'signin') {
        await onLogin(email, password);
      } else if (tab === 'signup') {
        await onSignup(name, email, password);
      } else {
        await onResetPassword(email);
        setInfo('Reset link sent! Check your email.');
      }
    } catch {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (newTab: Tab) => {
    setTab(newTab);
    setError('');
    setInfo('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center shadow-glow-pink mx-auto mb-3">
          <Gamepad2 className="w-6 h-6 text-white" strokeWidth={2.2} />
        </div>
        <h2 className="text-lg font-bold text-white">Welcome to NEXUS</h2>
        <p className="text-xs text-gray-500 mt-1">Sign in to access your library</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-base-cardSolid border border-base-border">
        {([
          { id: 'signin', label: 'Sign In' },
          { id: 'signup', label: 'Sign Up' },
          { id: 'forgot', label: 'Reset' },
        ] as { id: Tab; label: string }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => switchTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
              tab === t.id
                ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-glow-sm-pink'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {tab === 'signup' && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-base-cardSolid border border-base-border text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-neon-pink/40 focus:shadow-glow-sm-pink transition-all"
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-base-cardSolid border border-base-border text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-neon-pink/40 focus:shadow-glow-sm-pink transition-all"
            />
          </div>
        </div>

        {tab !== 'forgot' && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-base-cardSolid border border-base-border text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-neon-pink/40 focus:shadow-glow-sm-pink transition-all"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-neon-pink bg-neon-pink/10 border border-neon-pink/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {info && (
          <p className="text-xs text-neon-green bg-neon-green/10 border border-neon-green/20 rounded-lg px-3 py-2">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg btn-primary font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Please wait...</span>
            </>
          ) : tab === 'signin' ? (
            <span>Sign In</span>
          ) : tab === 'signup' ? (
            <span>Create Account</span>
          ) : (
            <span className="flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              Send Reset Link
            </span>
          )}
        </button>
      </form>

      {/* Switch links */}
      <div className="text-center text-xs text-gray-600">
        {tab === 'signin' && (
          <>
            <button onClick={() => switchTab('signup')} className="text-neon-pink hover:underline">
              Create an account
            </button>
            <span className="mx-2">·</span>
            <button onClick={() => switchTab('forgot')} className="text-gray-500 hover:text-neon-pink">
              Forgot password?
            </button>
          </>
        )}
        {tab === 'signup' && (
          <button onClick={() => switchTab('signin')} className="text-neon-pink hover:underline">
            Already have an account? Sign in
          </button>
        )}
        {tab === 'forgot' && (
          <button onClick={() => switchTab('signin')} className="text-neon-pink hover:underline">
            Back to sign in
          </button>
        )}
      </div>
    </div>
  );
}

// Re-export for type consistency
export type { UserProfile };
