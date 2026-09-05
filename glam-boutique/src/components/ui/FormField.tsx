import type { InputHTMLAttributes } from 'react';
import { classNames } from '@/utils/format';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export function FormField({ label, error, containerClassName, id, className, ...rest }: FormFieldProps) {
  const fieldId = id ?? rest.name;

  return (
    <div className={classNames('flex flex-col gap-1.5', containerClassName)}>
      <label htmlFor={fieldId} className="text-xs font-semibold uppercase tracking-wider text-ink-700">
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={classNames(
          'border bg-cream-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-gold-500',
          error ? 'border-danger' : 'border-ink-300',
          className
        )}
        {...rest}
      />
      {error && (
        <span id={`${fieldId}-error`} role="alert" className="text-2xs text-danger">
          {error}
        </span>
      )}
    </div>
  );
}
