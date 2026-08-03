import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '../../utils/utils';

const button = tv({
  base: 'shadow-lg inline-flex items-center justify-center gap-2 rounded-control border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-border focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
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
  VariantProps<typeof button> & { loading?: boolean };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, children, loading, disabled, variant, size, ...props },
  ref,
) {
  const { t } = useTranslation();
  return (
    <button
      ref={ref}
      className={cn(button({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? t('common.loading') : children}
    </button>
  );
});
