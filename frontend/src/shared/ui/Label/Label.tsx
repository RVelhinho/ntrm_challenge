import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/utils';

type LabelProps = HTMLAttributes<HTMLSpanElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-full border border-primary-border bg-primary-soft px-2 py-1 text-sm font-medium text-primary-text',
        className,
      )}
      {...props}
    />
  );
}
