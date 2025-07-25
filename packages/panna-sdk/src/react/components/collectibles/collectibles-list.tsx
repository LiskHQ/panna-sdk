import { cn } from '@/react/utils';
import { Typography } from '../ui/typography';

type CollectiblesListProps = {
  className?: string;
};

// @todo - Add collectibles/NFTs list UI and logic
export function CollectiblesList({ className }: CollectiblesListProps) {
  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center gap-2 text-center',
        className
      )}
    >
      <Typography variant="h6">Nothing here yet</Typography>
      <Typography variant="muted">
        When you receive collectibles, they'll show up here automatically.
      </Typography>
    </section>
  );
}
