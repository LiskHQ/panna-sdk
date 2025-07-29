import { cn } from '@/utils';
import { Typography } from '../ui/typography';

type TokensListProps = {
  className?: string;
};

// @todo - Add token list UI and logic
export function TokensList({ className }: TokensListProps) {
  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center gap-2 text-center',
        className
      )}
    >
      <Typography variant="h6">Nothing here yet</Typography>
      <Typography variant="muted">
        When you receive digital money, it'll show up here automatically.
      </Typography>
    </section>
  );
}
