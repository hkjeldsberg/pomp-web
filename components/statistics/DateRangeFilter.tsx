'use client';

import type { DateRange } from '@/lib/db/statistics';

const OPTIONS: { value: DateRange; label: string }[] = [
  { value: '4w', label: '4 uker' },
  { value: '3m', label: '3 mnd' },
  { value: '1y', label: '1 år' },
  { value: 'all', label: 'Alt' },
];

interface DateRangeFilterProps {
  selected: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangeFilter({ selected, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex gap-1.5">
      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={[
            'flex-1 min-h-[44px] px-3 rounded-lg border text-sm transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            selected === value
              ? 'bg-accent border-accent text-bg-base font-bold'
              : 'border-border-teal text-accent-muted hover:border-accent hover:text-accent',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
