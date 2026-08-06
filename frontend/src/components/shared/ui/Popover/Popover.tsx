/* eslint-disable react-refresh/only-export-components */
import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import { cn } from '../../../../shared/utils/class-names';

export const Popover = PopoverPrimitive.Root;
export const PopoverAnchor = PopoverPrimitive.Anchor;

export function PopoverContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={4}
        align="start"
        className={cn(
          'z-50 w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-card border-border bg-surface p-1 shadow-panel outline-none',
          className,
        )}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

export function PopoverEmpty({ children }: PropsWithChildren) {
  return <p className="px-3 py-2 text-xs text-text-muted">{children}</p>;
}
