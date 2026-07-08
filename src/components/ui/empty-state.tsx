import type { ReactNode } from 'react';
import { InboxIcon } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className ?? ''}`}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        {icon ?? <InboxIcon className="h-6 w-6 text-muted-foreground" />}
      </div>
      <h3 className="text-sm font-medium">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {action && (
        <Button className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
