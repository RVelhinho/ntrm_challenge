import { Slot } from '@radix-ui/react-slot';
import {
  Children,
  cloneElement,
  forwardRef,
  type ButtonHTMLAttributes,
  type ForwardedRef,
  type MouseEvent,
  type ReactElement,
} from 'react';
import { useTranslation } from 'react-i18next';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '../../../../shared/utils/class-names';

const buttonClasses = tv({
  base: 'shadow-lg inline-flex items-center justify-center gap-2 rounded-control border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-border focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer',
  variants: {
    variant: {
      primary: 'border-primary bg-primary text-on-primary hover:bg-primary-hover',
      secondary: 'border-border bg-surface text-text hover:bg-surface-subtle',
      accent: 'border-transparent bg-accent-soft text-accent-text hover:bg-accent-soft-hover',
      search: 'border-accent-action bg-accent-action text-on-accent hover:bg-accent-action-hover',
      soft: 'border-transparent bg-primary-soft text-primary-text hover:bg-primary-soft-hover',
      danger: 'border-transparent bg-danger-soft text-danger-text hover:brightness-95',
      ghost: 'border-transparent text-primary-text hover:bg-primary-soft',
    },
    size: {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4',
      lg: 'h-11 px-5 text-sm',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonClasses> & { asChild?: boolean; loading?: boolean };

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { asChild = false, className, children, loading, disabled, variant, size, onClick, ...props },
  ref,
) {
  const { t } = useTranslation();
  const unavailable = disabled || loading;

  if (asChild) {
    const child = Children.only(children) as ReactElement<{
      onClick?: (event: MouseEvent<HTMLElement>) => void;
    }>;
    const slottedChild = unavailable
      ? cloneElement(child, {
          onClick: (event) => {
            event.preventDefault();
            event.stopPropagation();
          },
        })
      : child;

    return (
      <Slot
        ref={ref}
        className={cn(buttonClasses({ variant, size }), className)}
        aria-busy={loading || undefined}
        aria-disabled={unavailable || undefined}
        onClick={(event) => {
          if (unavailable) {
            event.preventDefault();
            return;
          }
          onClick?.(event as unknown as MouseEvent<HTMLButtonElement>);
        }}
        {...props}
      >
        {slottedChild}
      </Slot>
    );
  }

  return (
    <button
      ref={ref as ForwardedRef<HTMLButtonElement>}
      className={cn(buttonClasses({ variant, size }), className)}
      disabled={unavailable}
      aria-busy={loading || undefined}
      onClick={onClick}
      {...props}
    >
      {loading ? t('common.loading') : children}
    </button>
  );
});
