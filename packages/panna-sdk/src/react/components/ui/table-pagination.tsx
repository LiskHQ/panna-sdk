import { Table } from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from './pagination';
import { Typography } from './typography';

type Props<TData> = {
  table: Table<TData>;
  isFetching?: boolean;
};

export function TablePagination<TData>({ table, isFetching }: Props<TData>) {
  return (
    <div className="flex items-center justify-center px-2">
      {isFetching ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2Icon
            size={16}
            className="text-muted-foreground animate-spin"
          />
          <Typography
            as="p"
            className="text-foreground leading-none font-medium"
            variant="small"
          >
            Loading...
          </Typography>
        </div>
      ) : (
        <div className="flex items-center space-x-6 lg:space-x-32">
          <Pagination className="flex items-center gap-1">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="h-9 w-9 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon className="h-8 w-8" />
                </PaginationPrevious>
              </PaginationItem>
              <PaginationItem className="bg-card text-foreground inline-flex h-9 w-9 items-center justify-center p-0">
                {table.getState().pagination.pageIndex + 1}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className="h-9 w-9 p-0"
                  onClick={() =>
                    table.options.meta?.hasNextPage
                      ? table.nextPage()
                      : undefined
                  }
                  disabled={!table.options.meta?.hasNextPage}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="h-8 w-8" />
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
