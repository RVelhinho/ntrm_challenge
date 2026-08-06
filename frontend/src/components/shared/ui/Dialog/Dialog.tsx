/* eslint-disable react-refresh/only-export-components */
import * as DialogPrimitive from '@radix-ui/react-dialog';
import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import { cn } from '../../../../shared/utils/class-names';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogPortal({ children }: PropsWithChildren) {
  return <DialogPrimitive.Portal>{children}</DialogPrimitive.Portal>;
}

export function DialogOverlay({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-text-strong/25 data-[state=closed]:animate-out data-[state=open]:animate-in',
        className,
      )}
      {...props}
    />
  );
}

export function DialogContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-0 z-50 m-auto h-fit max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-panel border border-border bg-surface p-5 shadow-panel focus:outline-none sm:p-7',
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('mb-5 flex items-start justify-between gap-4', className)} {...props} />
  );
}

export function DialogFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
