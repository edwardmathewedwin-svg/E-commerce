import { CheckCircle2, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export default function Toast({ message, show, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[70] animate-slide-up">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass-panel border border-neon-green/30 shadow-glow-green">
        <CheckCircle2 className="w-5 h-5 text-neon-green flex-shrink-0" />
        <span className="text-sm text-white font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
