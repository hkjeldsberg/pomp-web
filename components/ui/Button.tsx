'use client';

import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary:
    'bg-accent text-bg-base font-semibold hover:bg-accent-muted focus-visible:ring-accent',
  secondary:
    'border border-border-teal text-text-primary hover:bg-bg-card focus-visible:ring-accent',
  ghost: 'text-text-primary hover:bg-bg-card focus-visible:ring-accent',
  danger: 'bg-red-700 text-white hover:bg-red-600 focus-visible:ring-red-500',
};

const sizeClass: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm min-w-[44px]',
  md: 'h-11 px-4 text-base min-w-[44px]',
  lg: 'h-12 px-6 text-lg min-w-[44px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClass[variant],
        sizeClass[size],
        className,
      ].join(' ')}
    >
      {loading && (
        <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
