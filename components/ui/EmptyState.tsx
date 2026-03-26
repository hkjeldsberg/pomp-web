import { Card } from './Card';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, subtitle, action }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-text-primary text-lg font-semibold mb-2">{title}</p>
      {subtitle && <p className="text-accent-muted text-sm mb-4">{subtitle}</p>}
      {action && (
        <Button onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </Card>
  );
}
