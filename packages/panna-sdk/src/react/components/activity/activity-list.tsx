import {
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable
} from '@tanstack/react-table';
import { CircleAlertIcon } from 'lucide-react';
import { useState } from 'react';
import { Activity, TokenERC, TransactionActivity } from 'src/core';
import { useActiveAccount } from 'thirdweb/react';
import { useActivities } from '@/hooks/use-activities';
import { tokenIconMap } from '@/mocks/token-balances';
import { cn } from '@/utils';
import { MintedNFTTxnIcon } from '../icons/minted-nft-txn-icon';
import { ReceivedTxnIcon } from '../icons/received-txn-icon';
import { SentTxnIcon } from '../icons/sent-txn-icon';
import { Skeleton } from '../ui/skeleton';
import { TablePagination } from '../ui/table-pagination';
import { Typography } from '../ui/typography';

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

type ActivityItemProps = {
  activity: Activity;
};

function renderActivitySymbol(activity: Activity) {
  switch (activity.amount.type) {
    case TokenERC.ETH:
      return (
        <Typography variant="muted">
          {activity.amount.tokenInfo?.symbol}
        </Typography>
      );
    case TokenERC.ERC20:
      return (
        <Typography variant="muted">
          {activity.amount.tokenInfo?.symbol}
        </Typography>
      );
    case TokenERC.ERC721:
      return (
        <Typography variant="muted">
          {activity.amount.instance?.tokenInfo.name}
        </Typography>
      );
    case TokenERC.ERC1155:
      return (
        <Typography variant="muted">
          {activity.amount.instance?.tokenInfo.name}
        </Typography>
      );
    default:
      return null;
  }
}

function renderTransactionIcon(activity: Activity) {
  switch (activity.activityType) {
    case TransactionActivity.SENT:
      return <SentTxnIcon className="absolute top-0 left-0" />;
    case TransactionActivity.RECEIVED:
      return <ReceivedTxnIcon className="absolute top-0 left-0" />;
    case TransactionActivity.MINTED:
      return <MintedNFTTxnIcon className="absolute top-0 left-0" />;
    default:
      return null;
  }
}

function renderActivityTokenIcon(activity: Activity) {
  switch (activity.amount.type) {
    case TokenERC.ETH:
      return (
        <div className="relative py-1">
          {tokenIconMap[activity.amount.tokenInfo?.symbol] ? (
            <img
              src={tokenIconMap[activity.amount.tokenInfo?.symbol]}
              alt={activity.amount.tokenInfo?.symbol}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <Skeleton className="h-12 w-12 rounded-full" />
          )}
          {renderTransactionIcon(activity)}
        </div>
      );
    case TokenERC.ERC20:
      return (
        <div className="relative py-1">
          {tokenIconMap[activity.amount.tokenInfo?.symbol] ? (
            <img
              src={tokenIconMap[activity.amount.tokenInfo?.symbol]}
              alt={activity.amount.tokenInfo?.symbol}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <Skeleton className="h-12 w-12 rounded-full" />
          )}
          {renderTransactionIcon(activity)}
        </div>
      );
    case TokenERC.ERC721:
      {
        /* TODO: Implement NFT icons on API update */
      }
      return <Skeleton className="h-12 w-12 rounded-full" />;
    case TokenERC.ERC1155:
      return <Skeleton className="h-12 w-12 rounded-full" />;
    default:
      return null;
  }
}

function renderActivityNameOrSymbol(activity: Activity) {
  switch (activity.amount.type) {
    case TokenERC.ETH:
      return (
        <Typography variant="small">
          {(
            Number(activity.amount.value) /
            10 ** activity.amount.tokenInfo?.decimals
          ).toFixed(8)}{' '}
          {activity.amount.tokenInfo?.symbol}
        </Typography>
      );
    case TokenERC.ERC20:
      return (
        <Typography variant="small">
          {(
            Number(activity.amount.value) /
            10 ** activity.amount.tokenInfo?.decimals
          ).toFixed(8)}{' '}
          {activity.amount.tokenInfo?.symbol}
        </Typography>
      );
    case TokenERC.ERC721:
      return <Typography variant="small">1 Collectible</Typography>;
    case TokenERC.ERC1155:
      return <Typography variant="small">1 Collectible</Typography>;
    default:
      return null;
  }
}

function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <section className="flex w-full justify-between">
      <header className="flex items-center gap-3">
        {renderActivityTokenIcon(activity)}
        <div className="flex flex-col">
          <Typography variant="small">{activity.activityType}</Typography>
          {renderActivitySymbol(activity)}
        </div>
      </header>
      <div className="flex flex-col justify-center text-right">
        {/* @TODO: Implement pricing when API is updated */}
        <Typography variant="small">
          {renderActivityNameOrSymbol(activity)}
        </Typography>
        <Typography variant="muted">$0</Typography>
      </div>
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
