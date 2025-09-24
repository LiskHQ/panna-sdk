import {
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable
} from '@tanstack/react-table';
import { CircleAlertIcon } from 'lucide-react';
import { useState } from 'react';
import { ImageType, StringValues, Token, TokenInstance } from 'src/core';
import { useActiveAccount, useCollectibles, usePanna } from '@/hooks';
import { cn, getEnvironmentChain } from '@/utils';
import { DefaultNFTIcon } from '../icons/default-nft-icon';
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
import { SendCollectibleForm } from './send-collectible-form';

const DEFAULT_LIMIT = 5;
const DEFAULT_OFFSET = 0;

enum CollectibleViewEnum {
  Main = 'main',
  Details = 'details'
}

type CollectibleView = `${StringValues<typeof CollectibleViewEnum>}`;

type CollectiblesListProps = {
  className?: string;
};

export function CollectiblesList({ className }: CollectiblesListProps) {
  const account = useActiveAccount();
  const { chainId } = usePanna();
  const [activeView, setActiveView] = useState<CollectibleView>(
    CollectibleViewEnum.Main
  );
  const [selectedCollectible, setSelectedCollectible] =
    useState<TokenInstance | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_OFFSET,
    pageSize: DEFAULT_LIMIT
  });
  const { isLoading, isFetching, data, isError } = useCollectibles(
    {
      address: account?.address as string,
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
      chain: getEnvironmentChain(chainId)
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
        <CircleAlertIcon className="h-10 w-10 stroke-amber-300" />
        <Typography variant="small">Failed to get collectibles</Typography>
        <Typography variant="muted">
          There was an error attempting to load your collectibles. Please
          refresh or check again soon.
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

  const renderContent = (activeView: CollectibleView) => {
    switch (activeView) {
      case CollectibleViewEnum.Main:
        return (
          <>
            {table.getRowModel().rows.map((row, index) => {
              const item = row.original;
              if (!item.instances || item.instances.length === 0) {
                return null;
              }

              // @TODO: Use token.xyz and fallback to token instance
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
                        <CollectibleLogo instance={firstInstance} />
                        <div className="flex items-center gap-1">
                          <Typography variant="small">
                            {item.token.name}
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
                            <CollectibleImageRenderer
                              instance={instance}
                              token={item.token}
                              setActiveView={setActiveView}
                              setSelectedCollectible={setSelectedCollectible}
                              setSelectedToken={setSelectedToken}
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
          </>
        );
      case CollectibleViewEnum.Details:
        return (
          <SendCollectibleForm
            collectible={selectedCollectible!}
            token={selectedToken!}
            onClose={() => setActiveView(CollectibleViewEnum.Main)}
          />
        );
    }
  };

  return <section>{renderContent(activeView)}</section>;
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

function CollectibleLogo({ instance }: { instance: TokenInstance }) {
  return (
    <>
      {instance.imageType === ImageType.URL && (
        <img
          src={instance.image as string}
          alt={instance.name}
          className="h-10 w-10 rounded-full"
        />
      )}
      {instance.imageType === ImageType.SVG && (
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(instance.image as string)}`}
          alt={instance.name}
          className="h-10 w-10 rounded-full"
        />
      )}
      {instance.imageType === ImageType.UNKNOWN && (
        <div className="bg-input/30 h-10 w-10 rounded-full" />
      )}
    </>
  );
}

type CollectibleImageRendererProps = {
  instance: TokenInstance;
  token: Token;
  setActiveView: (view: CollectibleView) => void;
  setSelectedCollectible: (collectible: TokenInstance) => void;
  setSelectedToken: (token: Token) => void;
};

function CollectibleImageRenderer({
  instance,
  token,
  setActiveView,
  setSelectedCollectible,
  setSelectedToken
}: CollectibleImageRendererProps) {
  const handleClick = () => {
    setSelectedCollectible(instance);
    setSelectedToken(token);
    setActiveView(CollectibleViewEnum.Details);
  };

  return (
    <div onClick={handleClick}>
      <ImageRenderer instance={instance} />
    </div>
  );
}

export function ImageRenderer({ instance }: { instance: TokenInstance }) {
  return (
    <>
      {instance.imageType === ImageType.URL && (
        <CustomMediaRenderer
          src={instance.image as string}
          alt={instance.name}
          className="h-52 w-full rounded-xl object-cover!"
        />
      )}
      {instance.imageType === ImageType.SVG && (
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(instance.image as string)}`}
          alt={instance.name}
          className="h-52 w-full rounded-xl"
        />
      )}
      {instance.imageType === ImageType.UNKNOWN && (
        <div className="relative h-0 w-full p-0 pb-[100%]">
          <DefaultNFTIcon className="absolute top-0 left-0 h-full w-full rounded-xl" />
        </div>
      )}
    </>
  );
}
