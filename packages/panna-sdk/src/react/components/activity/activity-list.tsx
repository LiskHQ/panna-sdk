import { cn } from '@/react/utils';
import { Typography } from '../ui/typography';

type ActivityListProps = {
  className?: string;
};

// @todo - Add transaction history UI and logic
export function ActivityList({ className }: ActivityListProps) {
  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center gap-2 text-center',
        className
      )}
    >
      <Typography variant="h6">Nothing here yet</Typography>
      <Typography variant="muted">
        When you send or receive digital money, it'll show up here
        automatically.
      </Typography>
    </section>
  );
}
