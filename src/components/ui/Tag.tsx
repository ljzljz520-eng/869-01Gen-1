import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

type Variant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'cyan';
type Size = 'sm' | 'md';

interface TagProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  size?: Size;
  closable?: boolean;
  onClose?: () => void;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-slate-700/50 text-slate-300 border-slate-600',
  primary: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  danger: 'bg-red-500/20 text-red-400 border-red-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-3 py-1 text-sm gap-1.5',
};

export const Tag = forwardRef<HTMLDivElement, TagProps>(
  ({ className, variant = 'default', size = 'md', closable = false, onClose, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium border backdrop-blur-sm transition-all duration-200',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
        {closable && (
          <button
            type="button"
            onClick={onClose}
            className="ml-1 p-0.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }
);

Tag.displayName = 'Tag';
