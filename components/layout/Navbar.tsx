'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const navLinks = [
  { href: '/', label: 'Historikk' },
  { href: '/routines', label: 'Rutiner' },
  { href: '/exercises', label: 'Øvelser' },
  { href: '/statistics', label: 'Statistikk' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <nav className="hidden md:flex fixed top-0 inset-x-0 z-40 h-14 items-center border-b border-border-teal bg-bg-base/90 backdrop-blur-sm px-6 gap-8">
      <span className="text-accent font-bold text-lg tracking-tight mr-4">pomp</span>
      <div className="flex gap-1 flex-1">
        {navLinks.map(({ href, label }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-primary/70 hover:text-text-primary hover:bg-bg-card',
              ].join(' ')}
            >
              {label}
            </Link>
          );
        })}
      </div>
      <button
        onClick={handleSignOut}
        className="text-sm text-accent-muted hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-2 py-1"
      >
        Logg ut
      </button>
    </nav>
  );
}
