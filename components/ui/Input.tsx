'use client';

import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorText?: string;
}

export function Input({ label, errorText, className = '', id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm text-accent-muted font-medium">
          {label}
        </label>
      )}
      <input
        id={id}
        {...props}
        className={[
          'min-h-[44px] w-full rounded-lg bg-bg-surface px-3.5 py-2.5 text-text-primary text-base',
          'border border-border-teal placeholder:text-accent-muted/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className,
        ].join(' ')}
      />
      {errorText && <span className="text-sm text-red-400">{errorText}</span>}
    </div>
  );
}
