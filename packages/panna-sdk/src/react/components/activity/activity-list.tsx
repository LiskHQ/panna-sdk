import { keepPreviousData } from '@tanstack/react-query';
import {
  getCoreRowModel,
  PaginationState,
  useReactTable
} from '@tanstack/react-table';
import { CircleAlertIcon } from 'lucide-react';
import { useState } from 'react';
import { Activity } from 'src/core';
import { useActiveAccount } from 'thirdweb/react';
import { useActivities, usePanna } from '@/hooks';
import { cn, getEnvironmentChain } from '@/utils';
import { Skeleton } from '../ui/skeleton';
import { TablePagination } from '../ui/table-pagination';
import { Typography } from '../ui/typography';
import { ActivityItem } from './activity-item';

const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

/**
 * Format a timestamp to "DD MMM, YYYY" format (e.g., "9 Oct, 2025")
 */
export function getDateKey(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Group activities by date
 */
export function groupActivitiesByDate(
  activities: Activity[]
): Map<string, Activity[]> {
  const grouped = new Map<string, Activity[]>();

  activities.forEach((activity) => {
    const dateKey = getDateKey(activity.timestamp);
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(activity);
  });

  return grouped;
}

type ActivityListProps = {
  className?: string;
};

export function ActivityList({ className }: ActivityListProps) {
  const account = useActiveAccount();
  const { chainId, client } = usePanna();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_OFFSET,
    pageSize: DEFAULT_LIMIT
  });

  const { data, isLoading, isFetching, isError } = useActivities(
    {
      address: account?.address as string,
      client: client!,
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
      chain: getEnvironmentChain(chainId)
    },
    {
      enabled: !!account?.address && !!client,
      placeholderData: keepPreviousData
    }
  );

  const activitiesData = data?.activities || [];

  const table = useReactTable({
    columns: [],
    data: activitiesData,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
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

  if (!data?.activities.length && pagination.pageIndex === 0) {
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

  const groupedActivities = groupActivitiesByDate(activitiesData);

  return (
    <section className="flex flex-col gap-6">
      {activitiesData.length > 0 ? (
        Array.from(groupedActivities.entries()).map(([dateKey, activities]) => {
          return (
            <div key={dateKey} className="flex flex-col gap-4">
              <Typography variant="muted" className="text-sm">
                {dateKey}
              </Typography>
              <div className="flex flex-col gap-6">
                {activities.map((activity) => (
                  <ActivityItem
                    key={activity.transactionID}
                    activity={activity}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <Typography variant="muted" className="text-center">
          No activities on this page
        </Typography>
      )}
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
