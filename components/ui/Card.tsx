import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      {...props}
      className={[
        'rounded-xl bg-bg-card border border-border-teal p-4',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
