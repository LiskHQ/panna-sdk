import { useActiveAccount } from '@/hooks';
import { useCollectibles } from '@/hooks/use-collectibles';
import { cn } from '@/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Typography } from '../ui/typography';

type CollectiblesListProps = {
  className?: string;
};

export function CollectiblesList({ className }: CollectiblesListProps) {
  const account = useActiveAccount();
  const { isLoading, data, isError } = useCollectibles(
    {
      address: account?.address as string
    },
    {
      enabled: !!account?.address
    }
  );

  if (isLoading) {
    return (
      <section
        className="flex flex-col items-center justify-center gap-6"
        data-testid="collectibles-list-loading"
      >
        <CollectiblesListLoading />
      </section>
    );
  }

  if (isError) {
    return (
      <section
        className={cn(
          'flex flex-col items-center justify-center gap-2 text-center',
          className
        )}
      >
        <Typography variant="muted">
          Error fetching collectibles. Please try again later.
        </Typography>
      </section>
    );
  }

  if (!data) {
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

  return (
    <section>
      {data.collectibles.map((item, index) => (
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={`item-${item.instances[0].id}-${index}`}
          key={`item-${item.token.symbol}-${index}`}
        >
          <AccordionItem value={`item-${item.instances[0].id}-${index}`}>
            <AccordionTrigger className="flex items-center justify-between hover:cursor-pointer hover:no-underline">
              <div className="flex items-center gap-3">
                <img
                  src={item.instances[0].image}
                  alt={item.instances[0].name}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex items-center gap-1">
                  <Typography variant="small">
                    {item.instances[0].name}
                  </Typography>
                  <Typography variant="muted">
                    ({item.instances.length})
                  </Typography>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-2 gap-4">
              {item.instances.map((item, index) => (
                <Card key={index} className="p-0">
                  <CardContent className="p-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-52 w-full rounded-xl"
                    />
                  </CardContent>
                </Card>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </section>
  );
}

function CollectiblesListLoading() {
  return (
    <div className="flex w-full items-center gap-4">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 w-28" />
            </div>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-52 w-full" />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
