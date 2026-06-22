import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ isOpen, onClose, children, title, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full mx-4 rounded-2xl overflow-hidden',
          'bg-slate-900/95 backdrop-blur-xl border border-slate-700/50',
          'shadow-2xl shadow-cyan-500/10',
          'animate-scale-in',
          sizeClasses[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  position?: 'right' | 'left';
}

export function Drawer({ isOpen, onClose, children, title, position = 'right' }: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          'absolute top-0 h-full w-full max-w-md',
          'bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50',
          'shadow-2xl shadow-black/50',
          position === 'right' ? 'right-0 animate-slide-in-right' : 'left-0 animate-slide-in-left'
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6 h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
