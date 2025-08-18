import { render, screen } from '@testing-library/react';
import React from 'react';
import { useActiveAccount, useCollectibles } from '@/hooks';
import { CollectiblesList } from './collectibles-list';

jest.mock('@/hooks', () => ({
  useActiveAccount: jest.fn(),
  useCollectibles: jest.fn()
}));
jest.mock('../ui/accordion', () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AccordionItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AccordionContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));
jest.mock('../ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));
jest.mock('../ui/custom-media-renderer', () => ({
  CustomMediaRenderer: ({ alt }: { alt: string }) => <img alt={alt} />
}));
jest.mock('../ui/skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton" />
}));
jest.mock('../ui/table-pagination', () => ({
  TablePagination: () => <div data-testid="table-pagination" />
}));
jest.mock('../ui/typography', () => ({
  Typography: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  )
}));
jest.mock('lucide-react', () => ({
  CircleAlertIcon: () => <svg data-testid="circle-alert-icon" />
}));

describe('CollectiblesList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    (useActiveAccount as jest.Mock).mockReturnValue({ address: '0x123' });
    (useCollectibles as jest.Mock).mockReturnValue({
      isLoading: true,
      isFetching: false,
      data: undefined,
      isError: false
    });

    render(<CollectiblesList />);
    expect(screen.getByTestId('collectibles-list-loading')).toBeVisible();
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
  });

  it('renders error state', () => {
    (useActiveAccount as jest.Mock).mockReturnValue({ address: '0x123' });
    (useCollectibles as jest.Mock).mockReturnValue({
      isLoading: false,
      isFetching: false,
      data: undefined,
      isError: true
    });

    render(<CollectiblesList />);
    expect(screen.getByTestId('circle-alert-icon')).toBeVisible();
    expect(screen.getByText(/Failed to get activity/i)).toBeVisible();
    expect(
      screen.getByText(
        /There was an error attempting to load your collectibles./i
      )
    ).toBeVisible();
  });

  it('renders empty state', () => {
    (useActiveAccount as jest.Mock).mockReturnValue({ address: '0x123' });
    (useCollectibles as jest.Mock).mockReturnValue({
      isLoading: false,
      isFetching: false,
      data: { collectibles: [], metadata: { count: 0 } },
      isError: false
    });

    render(<CollectiblesList />);
    expect(screen.getByText(/Nothing here yet/i)).toBeVisible();
    expect(screen.getByText(/When you receive collectibles/i)).toBeVisible();
  });

  it('renders collectibles list properly', () => {
    (useActiveAccount as jest.Mock).mockReturnValue({ address: '0x123' });
    (useCollectibles as jest.Mock).mockReturnValue({
      isLoading: false,
      isFetching: false,
      data: {
        collectibles: [
          {
            token: { symbol: 'COLL' },
            numInstancesOwned: 2,
            instances: [
              {
                id: '1',
                name: 'Collectible One',
                image: 'image1.png'
              },
              {
                id: '2',
                name: 'Collectible Two',
                image: 'image2.png'
              }
            ]
          }
        ],
        metadata: { count: 1 }
      },
      isError: false
    });

    render(<CollectiblesList />);
    expect(screen.getByText('Collectible One')).toBeVisible();
    expect(screen.getByText('(2)')).toBeVisible();
    expect(screen.getAllByAltText('Collectible One')[1]).toBeVisible();
    expect(screen.getByAltText('Collectible Two')).toBeVisible();
    expect(screen.getByTestId('table-pagination')).toBeVisible();
  });
});
