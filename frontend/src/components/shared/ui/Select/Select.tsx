import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../../../shared/utils/class-names';

export function Select(props: ComponentPropsWithoutRef<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />;
}

export function SelectValue(props: ComponentPropsWithoutRef<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value {...props} />;
}

export function SelectTrigger({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        'inline-flex max-w-full items-center gap-1 rounded-control bg-transparent text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-soft',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronDown aria-hidden="true" className="size-4" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={4}
        className={cn(
          'z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-card border border-border bg-surface p-1 shadow-panel',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'relative flex cursor-default select-none items-center rounded-control py-2 pl-8 pr-3 text-sm outline-none focus:bg-primary-soft data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemIndicator className="absolute left-2">
        <Check aria-hidden="true" className="size-4" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
