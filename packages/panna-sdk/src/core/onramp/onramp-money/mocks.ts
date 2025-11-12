import {
  OnrampMoneySessionStatusEnum,
  type SessionStatusResult
} from './types';

export const mockSessionStatusCreated: SessionStatusResult = {
  session_id: 'test-session-created-123',
  status: OnrampMoneySessionStatusEnum.Created
};

export const mockSessionStatusPending: SessionStatusResult = {
  session_id: 'test-session-pending-456',
  status: OnrampMoneySessionStatusEnum.Pending,
  quoted_crypto_amount: 100,
  quoted_rate: 0.001
};

export const mockSessionStatusCompleted: SessionStatusResult = {
  session_id: 'test-session-completed-789',
  status: OnrampMoneySessionStatusEnum.Completed,
  transaction_hash:
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  quoted_crypto_amount: 100,
  actual_crypto_amount: 99.5,
  quoted_rate: 0.001,
  completed_at: '2024-01-15T10:30:00Z'
};

export const mockSessionStatusFailed: SessionStatusResult = {
  session_id: 'test-session-failed-101',
  status: OnrampMoneySessionStatusEnum.Failed,
  error_message: 'Payment verification failed'
};

export const mockSessionStatusCancelled: SessionStatusResult = {
  session_id: 'test-session-cancelled-303',
  status: OnrampMoneySessionStatusEnum.Cancelled
};

export const mockSessionStatusExpired: SessionStatusResult = {
  session_id: 'test-session-expired-404',
  status: OnrampMoneySessionStatusEnum.Expired,
  quoted_crypto_amount: 100,
  quoted_rate: 0.001
};
