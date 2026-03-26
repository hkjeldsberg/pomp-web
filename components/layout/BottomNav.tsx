'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const tabs = [
  { href: '/', label: 'History', icon: '🏋️' },
  { href: '/routines', label: 'Routines', icon: '📋' },
  { href: '/exercises', label: 'Exercises', icon: '💪' },
  { href: '/statistics', label: 'Statistics', icon: '📊' },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

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
      <button
        onClick={handleSignOut}
        aria-label="Sign out"
        className={[
          'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px]',
          'text-xs font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
          'text-text-primary/50 hover:text-text-primary',
        ].join(' ')}
      >
        <span className="text-xl leading-none" aria-hidden="true">↩</span>
        <span>Sign out</span>
      </button>
    </nav>
  );
}
