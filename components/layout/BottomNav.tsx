'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Historikk', icon: '🏋️' },
  { href: '/routines', label: 'Rutiner', icon: '📋' },
  { href: '/exercises', label: 'Øvelser', icon: '💪' },
  { href: '/statistics', label: 'Statistikk', icon: '📊' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex border-t border-border-teal bg-bg-base/95 backdrop-blur-sm safe-b">
      {tabs.map(({ href, label, icon }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={[
              'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px]',
              'text-xs font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
              isActive ? 'text-accent' : 'text-text-primary/50 hover:text-text-primary',
            ].join(' ')}
          >
            <span className="text-xl leading-none" aria-hidden="true">{icon}</span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
