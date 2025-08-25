import { ArrowDownIcon, SendIcon, StarIcon } from 'lucide-react';
import {
  Activity,
  TokenERC,
  TransactionActivity,
  TransactionAmount
} from 'src/core';
import { tokenIconMap } from '@/mocks/token-balances';
import { Skeleton } from '../ui/skeleton';
import { Typography } from '../ui/typography';

const DECIMAL_PLACES = 5;

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
      console.warn(
        `Unsupported activity type: ${(activity.amount as TransactionAmount).type}`,
        activity
      );
      return null;
  }
}

function renderTransactionIcon(activity: Activity) {
  switch (activity.activityType) {
    case TransactionActivity.SENT:
      return (
        <div className="text-primary-foreground border-background absolute top-0 left-0 rounded-full border bg-yellow-300 p-0.75">
          <SendIcon size={12} />
        </div>
      );
    case TransactionActivity.RECEIVED:
      return (
        <div className="text-primary-foreground border-background absolute top-0 left-0 rounded-full border bg-green-300 p-0.75">
          <ArrowDownIcon size={12} />
        </div>
      );
    case TransactionActivity.MINTED:
      return (
        <div className="text-primary-foreground border-background absolute top-0 left-0 rounded-full border bg-purple-300 p-0.75">
          <StarIcon size={12} />
        </div>
      );
    default:
      console.warn(
        `Unsupported activity type: ${activity.activityType}`,
        activity
      );
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
      console.warn(
        `Unsupported activity type: ${(activity.amount as TransactionAmount).type}`,
        activity
      );
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
          ).toFixed(DECIMAL_PLACES)}{' '}
          {activity.amount.tokenInfo?.symbol}
        </Typography>
      );
    case TokenERC.ERC20:
      return (
        <Typography variant="small">
          {(
            Number(activity.amount.value) /
            10 ** activity.amount.tokenInfo?.decimals
          ).toFixed(DECIMAL_PLACES)}{' '}
          {activity.amount.tokenInfo?.symbol}
        </Typography>
      );
    case TokenERC.ERC721:
      return <Typography variant="small">1 Collectible</Typography>;
    case TokenERC.ERC1155:
      return <Typography variant="small">1 Collectible</Typography>;
    default:
      console.warn(
        `Unsupported activity type: ${(activity.amount as TransactionAmount).type}`,
        activity
      );
      return null;
  }
}

export function ActivityItem({ activity }: ActivityItemProps) {
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
