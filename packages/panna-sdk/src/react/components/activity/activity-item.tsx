import { ArrowDownIcon, SendIcon, StarIcon, RepeatIcon } from 'lucide-react';
import {
  Activity,
  ERC1155Amount,
  ERC20Amount,
  ERC721Amount,
  EtherAmount,
  TokenERC,
  TransactionActivity,
  TransactionAmount
} from 'src/core';
import { currencyMap } from '@/consts/currencies';
import { tokenIconMap } from '@/mocks/token-balances';
import { Typography } from '../ui/typography';

const DECIMAL_PLACES = 5;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;
const SECONDS_PER_WEEK = 7 * SECONDS_PER_DAY;

/**
 * Format timestamp to relative time or absolute date
 * @param timestamp ISO timestamp string
 * @returns Formatted time string
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < SECONDS_PER_MINUTE) {
    // Less than a minute ago
    return 'Just now';
  } else if (diffInSeconds < SECONDS_PER_HOUR) {
    // Less than an hour ago
    const minutes = Math.floor(diffInSeconds / SECONDS_PER_MINUTE);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < SECONDS_PER_DAY) {
    // Less than a day ago
    const hours = Math.floor(diffInSeconds / SECONDS_PER_HOUR);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInSeconds < SECONDS_PER_WEEK) {
    // Less than a week ago
    const days = Math.floor(diffInSeconds / SECONDS_PER_DAY);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    // For older dates, show formatted date
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
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
          <SendIcon size={10} />
        </div>
      );
    case TransactionActivity.RECEIVED:
      return (
        <div className="text-primary-foreground border-background absolute top-0 left-0 rounded-full border bg-green-300 p-0.75">
          <ArrowDownIcon size={10} />
        </div>
      );
    case TransactionActivity.MINTED:
      return (
        <div className="text-primary-foreground border-background absolute top-0 left-0 rounded-full border bg-purple-300 p-0.75">
          <StarIcon size={10} />
        </div>
      );
    case TransactionActivity.SELF_TRANSFER:
      return (
        <div className="text-primary-foreground border-background absolute top-0 left-0 rounded-full border bg-blue-300 p-0.75">
          <RepeatIcon size={10} />
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
  const tokenSymbol =
    (activity.amount as EtherAmount | ERC20Amount).tokenInfo?.symbol ||
    (activity.amount as ERC721Amount | ERC1155Amount)?.instance?.tokenInfo
      ?.symbol;

  const icon = tokenSymbol ? tokenIconMap[tokenSymbol] : null;

  switch (activity.amount.type) {
    case TokenERC.ETH:
      return (
        <div className="relative py-1">
          {icon ? (
            <img
              src={icon}
              alt={activity.amount.tokenInfo?.symbol}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <Typography variant="muted" className="text-xs">
                {tokenSymbol?.[0]}
              </Typography>
            </div>
          )}
          {renderTransactionIcon(activity)}
        </div>
      );
    case TokenERC.ERC20:
      return (
        <div className="relative py-1">
          {icon ? (
            <img
              src={icon}
              alt={activity.amount.tokenInfo?.symbol}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <Typography variant="muted" className="text-xs">
                {tokenSymbol?.[0]}
              </Typography>
            </div>
          )}
          {renderTransactionIcon(activity)}
        </div>
      );
    case TokenERC.ERC721:
      {
        /* TODO: Implement NFT icons on API update */
      }
      return (
        <div className="bg-muted relative flex h-10 w-10 items-center justify-center rounded-full">
          <Typography variant="muted" className="text-xs">
            {tokenSymbol?.[0]}
          </Typography>
          {renderTransactionIcon(activity)}
        </div>
      );
    case TokenERC.ERC1155:
      return (
        <div className="bg-muted relative flex h-10 w-10 items-center justify-center rounded-full">
          <Typography variant="muted" className="text-xs">
            {tokenSymbol?.[0]}
          </Typography>
          {renderTransactionIcon(activity)}
        </div>
      );
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

function renderActivityFiatValue(activity: Activity) {
  const amount = activity.amount as EtherAmount | ERC20Amount | ERC1155Amount;

  if (!amount.fiatValue) {
    return <Typography variant="muted">-</Typography>;
  }

  return (
    <Typography variant="muted">
      {currencyMap[amount.fiatValue.currency]}
      {amount.fiatValue.amount.toFixed(2)}
    </Typography>
  );
}

export function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <section className="flex w-full justify-between">
      <header className="flex items-center gap-3">
        {renderActivityTokenIcon(activity)}
        <div className="flex flex-col">
          <Typography variant="small">{activity.activityType}</Typography>
          {renderActivitySymbol(activity)}
          <Typography variant="muted" className="text-xs">
            {formatTimestamp(activity.timestamp)}
          </Typography>
        </div>
      </header>
      <div className="flex flex-col justify-center text-right">
        <Typography variant="small">
          {renderActivityNameOrSymbol(activity)}
        </Typography>
        {renderActivityFiatValue(activity)}
      </div>
    </section>
  );
}
