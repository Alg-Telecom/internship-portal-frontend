import Card from '../ui/Card';
import { cn } from '../../lib/utils';

export default function StatCard({ icon: Icon, label, value, tone = 'primary', className }) {
  return (
    <Card className={cn('flex items-center gap-4 px-5 py-4', className)}>
      <div
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-md',
          tone === 'accent' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
        )}
      >
        {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
      </div>
      <div>
        <p className="text-2xl font-semibold text-foreground leading-none">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}
