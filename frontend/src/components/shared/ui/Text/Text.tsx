import type { ElementType, HTMLAttributes } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '../../../../shared/utils/class-names';

const text = tv({
  variants: {
    tone: {
      default: 'text-text',
      muted: 'text-text-muted',
      danger: 'text-danger-text',
      success: 'text-success-text',
    },
    size: { xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl' },
    weight: { regular: 'font-normal', medium: 'font-medium', semibold: 'font-semibold' },
  },
  defaultVariants: { tone: 'default', size: 'base', weight: 'regular' },
});
type TextProps = HTMLAttributes<HTMLElement> & VariantProps<typeof text> & { as?: ElementType };
export function Text({ className, tone, size, weight, as: Component = 'p', ...props }: TextProps) {
  return <Component className={cn(text({ tone, size, weight }), className)} {...props} />;
}
