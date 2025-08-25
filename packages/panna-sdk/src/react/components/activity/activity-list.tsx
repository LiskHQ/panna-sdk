import {
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable
} from '@tanstack/react-table';
import { CircleAlertIcon } from 'lucide-react';
import { useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useActivities } from '@/hooks/use-activities';
import { cn } from '@/utils';
import { Skeleton } from '../ui/skeleton';
import { TablePagination } from '../ui/table-pagination';
import { Typography } from '../ui/typography';
import { ActivityItem } from './activity-item';

const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

type ActivityListProps = {
  className?: string;
};

export function ActivityList({ className }: ActivityListProps) {
  const account = useActiveAccount();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_OFFSET,
    pageSize: DEFAULT_LIMIT
  });
  const { data, isLoading, isFetching, isError } = useActivities(
    {
      address: account?.address as string,
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize
    },
    {
      enabled: !!account?.address
    }
  );

  const activitiesData = data?.activities || [];
  const totalCount = data?.metadata.count || 0;

  const table = useReactTable({
    columns: [],
    data: activitiesData,
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

  console.log({ data, activitiesData, isLoading, isFetching, isError });

  if (isLoading) {
    return (
      <section
        className="flex flex-col items-center justify-center gap-6"
        data-testid="activities-list-loading"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <ActivitiesListLoading key={index} />
        ))}
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
        <CircleAlertIcon className="h-10 w-10 stroke-amber-300" />
        <Typography variant="small">Failed to get activity</Typography>
        <Typography variant="muted">
          There was an error attempting to load your activity. Please refresh or
          check again soon.
        </Typography>
      </section>
    );
  }

  if (!data?.activities.length) {
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

  return (
    <section className="flex flex-col gap-6">
      {activitiesData.map((activity) => (
        <ActivityItem key={activity.transactionID} activity={activity} />
      ))}
      <TablePagination table={table} isFetching={isFetching} />
    </section>
  );
}

function ActivitiesListLoading() {
  return (
    <section className="flex w-full justify-between">
      <header className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-10 rounded-sm" />
          <Skeleton className="h-6 w-10 rounded-sm" />
        </div>
      </header>
      <div className="flex flex-col gap-2 text-right">
        <Skeleton className="h-6 w-25 rounded-sm" />
        <Skeleton className="h-6 w-10 rounded-sm" />
      </div>
    </section>
  );
}
