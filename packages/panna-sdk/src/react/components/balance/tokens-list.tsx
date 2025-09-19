import { currencyMap } from '@/consts/currencies';
import { useActiveAccount } from '@/hooks';
import { useTokenBalances } from '@/hooks/use-token-balances';
import { TokenBalance } from '@/mocks/token-balances';
import { cn } from '@/utils';
import { Skeleton } from '../ui/skeleton';
import { Typography } from '../ui/typography';

type TokensListProps = {
  className?: string;
};

export function TokensList({ className }: TokensListProps) {
  const account = useActiveAccount();
  const {
    data: tokens,
    isLoading,
    isError
  } = useTokenBalances(
    { address: account?.address as string },
    {
      enabled: !!account?.address
    }
  );

  if (isLoading) {
    return (
      <section
        className="flex flex-col items-center justify-center gap-6"
        data-testid="token-list-loading"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <TokenListLoading key={index} />
        ))}
      </section>
    );
  }

  if (isError || !tokens) {
    return (
      <section className={cn('flex items-center justify-center', className)}>
        <Typography>Error loading tokens</Typography>
      </section>
    );
  }

  if (!tokens.length) {
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

  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center gap-6',
        className
      )}
    >
      {tokens.map((tokenData: TokenBalance) => (
        <TokenItem key={tokenData.token.name} token={tokenData} />
      ))}
    </section>
  );
}

type TokenItemProps = {
  token: TokenBalance;
};

function TokenItem({ token }: TokenItemProps) {
  return (
    <div className="flex w-full justify-between">
      <div className="flex gap-3">
        <div className="flex items-center justify-center">
          <img
            src={token.token.icon}
            alt={token.token.name}
            className="h-10 w-10"
          />
        </div>
        <div className="flex flex-col justify-center">
          <Typography variant="small">{token.token.name}</Typography>
          <Typography variant="muted">{token.token.symbol}</Typography>
        </div>
      </div>
      <div className="flex flex-col justify-center text-right">
        <Typography variant="small">
          {Number(token.tokenBalance.displayValue).toFixed(6)}
        </Typography>
        <Typography variant="muted">
          {currencyMap[token.fiatBalance.currency]}
          {Number(Math.floor(token.fiatBalance.amount * 100) / 100).toFixed(2)}
        </Typography>
      </div>
    </div>
  );
}

function TokenListLoading() {
  return (
    <section className="flex w-full justify-between">
      <header className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16 rounded-sm" />
          <Skeleton className="h-4 w-16 rounded-sm" />
        </div>
      </header>
      <div className="flex flex-col gap-2 text-right">
        <Skeleton className="h-4 w-16 rounded-sm" />
        <Skeleton className="h-4 w-20 rounded-sm" />
      </div>
    </section>
  );
}
