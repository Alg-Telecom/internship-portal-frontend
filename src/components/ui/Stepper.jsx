import { Check } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

/**
 * Generic numbered/connected step indicator. `steps`: [{ key, label }].
 * `currentIndex` is 0-based. Steps before it render as done (checkmark),
 * the current step is highlighted, later steps are upcoming/dim.
 */
export default function Stepper({ steps, currentIndex }) {
  return (
    <ol className="flex items-center" aria-label="Progress">
      {steps.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <li key={step.key} className={cn('flex items-center', index < steps.length - 1 && 'flex-1')}>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                  isDone && 'bg-accent text-accent-foreground',
                  isCurrent && 'bg-primary text-primary-foreground',
                  !isDone && !isCurrent && 'bg-muted text-muted-foreground'
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isDone ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
              </span>
              <span className={cn('hidden text-sm font-medium sm:inline', isCurrent ? 'text-foreground' : 'text-muted-foreground')}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span className={cn('mx-3 h-px flex-1', isDone ? 'bg-accent' : 'bg-border')} aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
