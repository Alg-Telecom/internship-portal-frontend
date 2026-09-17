import { cn } from '../../lib/utils';
import { initials } from '../../lib/utils';

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
};

/** Falls back to initials whenever there's no `photoUrl` — which is every user until Settings lets them set one. */
export default function Avatar({ firstName, lastName, photoUrl, size = 'md', className }) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        className={cn('shrink-0 rounded-full object-cover', SIZES[size], className)}
        aria-hidden="true"
      />
    );
  }

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
