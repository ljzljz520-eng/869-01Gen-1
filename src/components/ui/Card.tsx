import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  glass?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow = false, glass = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border transition-all duration-300',
          glass && 'bg-slate-800/40 backdrop-blur-xl border-slate-700/50',
          glow && 'border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:border-cyan-500/50',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-4', className)} {...props} />
  )
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-semibold text-white tracking-wide', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-4 border-t border-slate-700/30', className)} {...props} />
  )
);

CardFooter.displayName = 'CardFooter';
