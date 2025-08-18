import {
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable
} from '@tanstack/react-table';
import { useState } from 'react';
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
import { CustomMediaRenderer } from '../ui/custom-media-renderer';
import { Skeleton } from '../ui/skeleton';
import { TablePagination } from '../ui/table-pagination';
import { Typography } from '../ui/typography';

type CollectiblesListProps = {
  className?: string;
};

export function CollectiblesList({ className }: CollectiblesListProps) {
  const account = useActiveAccount();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const { isLoading, isFetching, data, isError } = useCollectibles(
    {
      address: account?.address as string,
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize
    },
    {
      enabled: !!account?.address
    }
  );

  const collectiblesData = data?.collectibles || [];
  const totalCount = data?.metadata.count || 0;

  const table = useReactTable({
    columns: [],
    data: collectiblesData,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: totalCount,
    onPaginationChange: setPagination,
    state: {
      pagination
    },
    meta: data?.metadata
  });

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

  if (!data?.collectibles.length) {
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
      {table.getRowModel().rows.map((row, index) => {
        const item = row.original;
        if (!item.instances || item.instances.length === 0) {
          return null;
        }

        const firstInstance = item.instances[0];

        return (
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue={`item-${firstInstance.id}-${index}`}
            key={`item-${item.token.symbol}-${index}`}
          >
            <AccordionItem value={`item-${firstInstance.id}-${index}`}>
              <AccordionTrigger className="flex items-center justify-between hover:cursor-pointer hover:no-underline">
                <div className="flex items-center gap-3">
                  <CustomMediaRenderer
                    src={firstInstance.image}
                    alt={firstInstance.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex items-center gap-1">
                    <Typography variant="small">
                      {firstInstance.name}
                    </Typography>
                    <Typography variant="muted">
                      ({item.numInstancesOwned})
                    </Typography>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-2 gap-4">
                {item.instances.map((instance, instanceIndex) => (
                  <Card key={instanceIndex} className="p-0">
                    <CardContent className="p-0">
                      <CustomMediaRenderer
                        src={instance.image}
                        alt={instance.name}
                        className="h-52 w-full rounded-xl object-cover!"
                      />
                    </CardContent>
                  </Card>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
      <TablePagination table={table} isFetching={isFetching} />
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
