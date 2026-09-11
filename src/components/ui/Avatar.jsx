import { cn } from '../../lib/utils';
import { initials } from '../../lib/utils';

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
};

export default function Avatar({ firstName, lastName, size = 'md', className }) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground',
        SIZES[size],
        className
      )}
      aria-hidden="true"
    >
      {initials(firstName, lastName)}
    </div>
  );
}
