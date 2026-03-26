import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-bg-base px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
        <p className="text-text-primary text-lg mb-2">Siden finnes ikke</p>
        <p className="text-accent-muted text-sm mb-8">Beklager, vi fant ikke siden du lette etter.</p>
        <Link href="/" className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
          Gå til forsiden
        </Link>
      </div>
    </div>
  );
}
