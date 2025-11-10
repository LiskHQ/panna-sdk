import type { SessionStatusResult } from './types';

/**
 * Mock session status for 'created' state
 * Session has been created but payment not yet received
 */
export const mockSessionStatusCreated: SessionStatusResult = {
  session_id: 'test-session-created-123',
  status: 'created',
  quoted_crypto_amount: 100,
  quoted_rate: 0.001
};

/**
 * Mock session status for 'pending' state
 * Payment received and onramp is being processed
 */
export const mockSessionStatusPending: SessionStatusResult = {
  session_id: 'test-session-pending-456',
  status: 'pending',
  transaction_id: 'tx-pending-789',
  quoted_crypto_amount: 100,
  quoted_rate: 0.001
};

/**
 * Mock session status for 'completed' state
 * Onramp completed successfully with transaction on chain
 */
export const mockSessionStatusCompleted: SessionStatusResult = {
  session_id: 'test-session-completed-789',
  status: 'completed',
  transaction_id: 'tx-completed-123',
  transaction_hash:
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  quoted_crypto_amount: 100,
  actual_crypto_amount: 99.5,
  quoted_rate: 0.001,
  completed_at: '2024-01-15T10:30:00Z'
};

/**
 * Mock session status for 'failed' state
 * Onramp failed with error message
 */
export const mockSessionStatusFailed: SessionStatusResult = {
  session_id: 'test-session-failed-101',
  status: 'failed',
  transaction_id: 'tx-failed-202',
  quoted_crypto_amount: 100,
  quoted_rate: 0.001,
  error_message: 'Payment verification failed'
};

/**
 * Mock session status for 'cancelled' state
 * Session was cancelled by user
 */
export const mockSessionStatusCancelled: SessionStatusResult = {
  session_id: 'test-session-cancelled-303',
  status: 'cancelled',
  quoted_crypto_amount: 100,
  quoted_rate: 0.001
};

/**
 * Mock session status for 'expired' state
 * Session expired before completion
 */
export const mockSessionStatusExpired: SessionStatusResult = {
  session_id: 'test-session-expired-404',
  status: 'expired',
  quoted_crypto_amount: 100,
  quoted_rate: 0.001
};
