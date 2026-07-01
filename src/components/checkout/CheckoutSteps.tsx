import { Check } from 'lucide-react';
import { CHECKOUT_STEPS, type CheckoutStep } from '@/types/checkout';
import { classNames } from '@/utils/format';

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
  completedSteps: CheckoutStep[];
}

export function CheckoutSteps({ currentStep, completedSteps }: CheckoutStepsProps) {
  const currentIndex = CHECKOUT_STEPS.findIndex((s) => s.key === currentStep);

  return (
    <ol className="flex items-center justify-between" aria-label="Progresso da compra">
      {CHECKOUT_STEPS.map((step, i) => {
        const isCompleted = completedSteps.includes(step.key);
        const isCurrent = step.key === currentStep;
        const isPast = i < currentIndex;

        return (
          <li key={step.key} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span
                aria-current={isCurrent ? 'step' : undefined}
                className={classNames(
                  'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors',
                  isCompleted || isPast
                    ? 'border-ink-900 bg-ink-900 text-cream-50'
                    : isCurrent
                    ? 'border-gold-500 bg-gold-500 text-ink-950'
                    : 'border-ink-200 bg-cream-50 text-ink-400'
                )}
              >
                {isCompleted || isPast ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={classNames(
                  'hidden text-2xs font-medium uppercase tracking-wide sm:block',
                  isCurrent ? 'text-ink-900' : 'text-ink-400'
                )}
              >
                {step.label}
              </span>
            </div>
            {i < CHECKOUT_STEPS.length - 1 && (
              <div
                className={classNames(
                  'mx-1.5 h-px flex-1',
                  isPast || isCompleted ? 'bg-ink-900' : 'bg-ink-200'
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
