import { forwardRef, type InputHTMLAttributes } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '../../../../shared/utils/class-names';

const input = tv({
  base: 'h-10 w-full rounded-control border-border bg-surface px-3 text-sm text-text-strong shadow-input outline-none transition placeholder:text-text-subtle focus:border-primary-border focus:ring-2 focus:ring-primary-soft disabled:bg-surface-subtle',
  variants: {
    invalid: {
      true: 'border-danger-text focus:border-danger-text focus:ring-danger-soft',
    },
  },
});
export type InputProps = InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof input>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(input({ invalid }), className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
});
