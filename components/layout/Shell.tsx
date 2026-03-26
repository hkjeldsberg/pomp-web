import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-svh flex flex-col">
      <Navbar />
      {/* Main content — offset for desktop top nav and mobile bottom nav */}
      <main className="flex-1 md:pt-14 pb-16 md:pb-0">
        <div className="max-w-content mx-auto px-4 md:px-6 py-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
