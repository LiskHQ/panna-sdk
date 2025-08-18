import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon
} from 'lucide-react';
import * as React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils';

type PaginationNavProps = React.ComponentProps<typeof PaginationLink> &
  Pick<React.ComponentProps<'button'>, 'disabled'>;

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>;

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  showPreviousText = false,
  previousText = 'Previous',
  ...props
}: PaginationNavProps & {
  showPreviousText?: boolean;
  previousText?: string;
}) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      aria-disabled={props.disabled}
      size="default"
      className={cn(
        'gap-1 rounded-md px-4 py-2 sm:pl-4',
        props.disabled
          ? 'bg-card text-primary/50 cursor-not-allowed'
          : 'bg-muted text-foreground',
        className
      )}
      {...props}
    >
      <ChevronLeftIcon />
      {showPreviousText && (
        <span className="hidden sm:block">{previousText}</span>
      )}
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  showNextText = false,
  nextText = 'Next',
  ...props
}: PaginationNavProps & {
  showNextText?: boolean;
  nextText?: string;
}) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      aria-disabled={props.disabled}
      size="default"
      className={cn(
        'gap-1 rounded-md px-4 py-2 sm:pr-4',
        props.disabled
          ? 'bg-card text-primary/50 cursor-not-allowed'
          : 'bg-muted text-foreground',
        className
      )}
      {...props}
    >
      {showNextText && <span className="hidden sm:block">{nextText}</span>}
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
};
