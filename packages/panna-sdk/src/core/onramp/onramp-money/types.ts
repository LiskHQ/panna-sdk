import type { PannaClient } from '../../client';

/**
 * Status of an onramp.money session
 */
export type OnrampMoneySessionStatus =
  | 'created'
  | 'pending'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'expired';

/**
 * Result structure for onramp.money session status
 */
export interface SessionStatusResult {
  session_id: string;
  status: OnrampMoneySessionStatus;
  transaction_id?: string;
  transaction_hash?: string;
  quoted_crypto_amount?: number;
  actual_crypto_amount?: number;
  quoted_rate?: number;
  completed_at?: string;
  error_message?: string;
}

/**
 * Parameters for getting onramp.money session status
 */
export interface GetSessionStatusParams {
  sessionId: string;
  client: PannaClient;
  authToken?: string;
}
