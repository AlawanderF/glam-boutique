import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { classNames } from '@/utils/format';

type Variant = 'primary' | 'secondary' | 'gold' | 'ghost-light' | 'plain';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
}

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  gold: 'btn-gold',
  'ghost-light': 'btn-ghost-light',
  plain: 'inline-flex items-center justify-center gap-2 transition-colors duration-200',
};

const sizeClass: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: '',
  lg: 'px-9 py-4 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, fullWidth, className, children, disabled, ariaLabel, ...rest }, ref) => {
    const isIconOnly = !children && ariaLabel;

    return (
      <button
        ref={ref}
        className={classNames(variantClass[variant], sizeClass[size], fullWidth && 'w-full', className)}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        aria-disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...rest}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
        {isLoading && <span className="sr-only">Carregando...</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
