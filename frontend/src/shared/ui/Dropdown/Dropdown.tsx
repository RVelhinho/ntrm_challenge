import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import { cn } from '../../utils/utils';

export function DropdownRoot(props: ComponentPropsWithoutRef<typeof DropdownMenu.Root>) {
  return <DropdownMenu.Root {...props} />;
}

export function DropdownTrigger({
  children,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenu.Trigger>) {
  return (
    <DropdownMenu.Trigger asChild {...props}>
      {children}
    </DropdownMenu.Trigger>
  );
}

export function DropdownContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenu.Content>) {
  const focusProps = {
    onEntryFocus: (event: { currentTarget: HTMLElement; preventDefault: () => void }) => {
      const selectedItem = event.currentTarget.querySelector<HTMLElement>(
        '[data-dropdown-selected="true"]',
      );
      if (selectedItem) {
        event.preventDefault();
        selectedItem.focus();
      }
    },
  } as unknown as ComponentPropsWithoutRef<typeof DropdownMenu.Content>;

  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        sideOffset={4}
        className={cn(
          'z-50 min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-hidden rounded-card border-border bg-surface p-1 shadow-panel outline-none',
          className,
        )}
        {...focusProps}
        {...props}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}

export function DropdownItem({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenu.Item>) {
  return (
    <DropdownMenu.Item
      className={cn(
        'my-1 cursor-default rounded-control px-3 py-2 text-sm outline-none focus:bg-primary-soft',
        className,
      )}
      {...props}
    />
  );
}

export function DropdownLabel({
  children,
  ...props
}: PropsWithChildren<ComponentPropsWithoutRef<typeof DropdownMenu.Label>>) {
  return <DropdownMenu.Label {...props}>{children}</DropdownMenu.Label>;
}
