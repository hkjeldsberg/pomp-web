interface BadgeProps {
  label: string;
  className?: string;
}

export function Badge({ label, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
        'bg-accent/10 text-accent border border-accent/20',
        className,
      ].join(' ')}
    >
      {label}
    </span>
  );
}
