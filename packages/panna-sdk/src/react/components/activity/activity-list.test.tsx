import { DEFAULT_CURRENCY } from 'src/core';
import { Activity, TransactionActivity, TokenERC } from 'src/core';
import { getDateKey, groupActivitiesByDate } from './activity-list';

describe('ActivityList Helper Functions', () => {
  describe('getDateKey', () => {
    it('formats timestamp to "DD MMM, YYYY" format', () => {
      const timestamp = '2025-10-09T14:30:00.000000Z';
      const result = getDateKey(timestamp);

      // The result should be in format like "9 Oct, 2025"
      expect(result).toBe('9 Oct 2025');
    });

    it('handles different month formats correctly', () => {
      const timestamp = '2025-01-15T10:00:00.000000Z';
      const result = getDateKey(timestamp);

      expect(result).toBe('15 Jan 2025');
    });

    it('handles single-digit days correctly', () => {
      const timestamp = '2025-03-05T08:00:00.000000Z';
      const result = getDateKey(timestamp);

      expect(result).toBe('5 Mar 2025');
    });

    it('handles double-digit days correctly', () => {
      const timestamp = '2025-12-25T12:00:00.000000Z';
      const result = getDateKey(timestamp);

      expect(result).toBe('25 Dec 2025');
    });

    it('handles end of month correctly', () => {
      const timestamp = '2025-02-28T12:00:00.000000Z';
      const result = getDateKey(timestamp);

      expect(result).toBe('28 Feb 2025');
    });
  });

  describe('groupActivitiesByDate', () => {
    const createMockActivity = (
      transactionID: string,
      timestamp: string
    ): Activity => ({
      activityType: TransactionActivity.SENT,
      transactionID,
      amount: {
        type: TokenERC.ETH,
        value: '1000000000000000000',
        tokenInfo: {
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
          type: TokenERC.ETH,
          icon: null
        },
        fiatValue: {
          amount: 3000.5,
          currency: DEFAULT_CURRENCY
        }
      },
      status: 'success',
      timestamp
    });

    it('groups activities by date correctly', () => {
      const activities: Activity[] = [
        createMockActivity('0x1', '2025-10-09T14:30:00.000000Z'),
        createMockActivity('0x2', '2025-10-09T15:30:00.000000Z'),
        createMockActivity('0x3', '2025-10-10T10:00:00.000000Z')
      ];

      const grouped = groupActivitiesByDate(activities);

      expect(grouped.size).toBe(2);
      expect(grouped.get('9 Oct 2025')).toHaveLength(2);
      expect(grouped.get('10 Oct 2025')).toHaveLength(1);
    });

    it('handles activities from the same date', () => {
      const activities: Activity[] = [
        createMockActivity('0x1', '2025-10-09T08:00:00.000000Z'),
        createMockActivity('0x2', '2025-10-09T12:00:00.000000Z'),
        createMockActivity('0x3', '2025-10-09T20:00:00.000000Z')
      ];

      const grouped = groupActivitiesByDate(activities);

      expect(grouped.size).toBe(1);
      expect(grouped.get('9 Oct 2025')).toHaveLength(3);
      expect(grouped.get('9 Oct 2025')?.[0].transactionID).toBe('0x1');
      expect(grouped.get('9 Oct 2025')?.[1].transactionID).toBe('0x2');
      expect(grouped.get('9 Oct 2025')?.[2].transactionID).toBe('0x3');
    });

    it('handles activities from different dates', () => {
      const activities: Activity[] = [
        createMockActivity('0x1', '2025-10-09T14:30:00.000000Z'),
        createMockActivity('0x2', '2025-10-10T10:00:00.000000Z'),
        createMockActivity('0x3', '2025-10-11T08:00:00.000000Z')
      ];

      const grouped = groupActivitiesByDate(activities);

      expect(grouped.size).toBe(3);
      expect(grouped.get('9 Oct 2025')).toHaveLength(1);
      expect(grouped.get('10 Oct 2025')).toHaveLength(1);
      expect(grouped.get('11 Oct 2025')).toHaveLength(1);
    });

    it('handles empty activities array', () => {
      const activities: Activity[] = [];
      const grouped = groupActivitiesByDate(activities);

      expect(grouped.size).toBe(0);
    });

    it('handles activities spanning across months', () => {
      const activities: Activity[] = [
        createMockActivity('0x1', '2025-09-30T12:00:00.000000Z'),
        createMockActivity('0x2', '2025-10-01T12:00:00.000000Z'),
        createMockActivity('0x3', '2025-10-01T14:00:00.000000Z')
      ];

      const grouped = groupActivitiesByDate(activities);

      expect(grouped.size).toBe(2);
      expect(grouped.get('30 Sept 2025')).toHaveLength(1);
      expect(grouped.get('1 Oct 2025')).toHaveLength(2);
    });

    it('handles activities spanning across years', () => {
      const activities: Activity[] = [
        createMockActivity('0x1', '2024-12-31T12:00:00.000000Z'),
        createMockActivity('0x2', '2025-01-01T12:00:00.000000Z')
      ];

      const grouped = groupActivitiesByDate(activities);

      expect(grouped.size).toBe(2);
      expect(grouped.get('31 Dec 2024')).toHaveLength(1);
      expect(grouped.get('1 Jan 2025')).toHaveLength(1);
    });

    it('preserves activity order within the same date', () => {
      const activities: Activity[] = [
        createMockActivity('0x1', '2025-10-09T08:00:00.000000Z'),
        createMockActivity('0x2', '2025-10-09T12:00:00.000000Z'),
        createMockActivity('0x3', '2025-10-09T20:00:00.000000Z')
      ];

      const grouped = groupActivitiesByDate(activities);
      const groupedActivities = grouped.get('9 Oct 2025');

      expect(groupedActivities?.[0].transactionID).toBe('0x1');
      expect(groupedActivities?.[1].transactionID).toBe('0x2');
      expect(groupedActivities?.[2].transactionID).toBe('0x3');
    });
  });
});
