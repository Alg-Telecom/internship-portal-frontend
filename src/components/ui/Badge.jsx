import { cn } from '../../lib/utils';

const TONES = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-accent/10 text-accent',
  warning: 'bg-amber-100 text-amber-700',
  destructive: 'bg-destructive/10 text-destructive',
  info: 'bg-sky-100 text-sky-700',
  muted: 'bg-muted text-muted-foreground',
};

export default function Badge({ tone = 'muted', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium leading-none',
        TONES[tone] || TONES.muted,
        className
      )}
    >
      {children}
    </span>
  );
}
