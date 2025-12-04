export enum OnrampMoneySessionStatusEnum {
  Created = 'created',
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed',
  Cancelled = 'cancelled',
  Expired = 'expired'
}

/**
 * Status of an onramp.money session
 */
export type OnrampMoneySessionStatus = `${OnrampMoneySessionStatusEnum}`;

/**
 * Result structure for onramp.money session status
 */
interface BaseSessionStatus {
  session_id: string;
  status: OnrampMoneySessionStatus;
}

export interface CreatedSessionStatus extends BaseSessionStatus {
  status: OnrampMoneySessionStatusEnum.Created;
}

export interface PendingSessionStatus extends BaseSessionStatus {
  status: OnrampMoneySessionStatusEnum.Pending;
  quoted_crypto_amount?: number;
  quoted_rate?: number;
}

export interface CompletedSessionStatus extends BaseSessionStatus {
  status: OnrampMoneySessionStatusEnum.Completed;
  transaction_hash: string;
  quoted_crypto_amount?: number;
  quoted_rate?: number;
  actual_crypto_amount: number;
  completed_at: string;
}

export interface FailedSessionStatus extends BaseSessionStatus {
  status: OnrampMoneySessionStatusEnum.Failed;
  error_message: string;
}

export interface CancelledSessionStatus extends BaseSessionStatus {
  status: OnrampMoneySessionStatusEnum.Cancelled;
}

export interface ExpiredSessionStatus extends BaseSessionStatus {
  status: OnrampMoneySessionStatusEnum.Expired;
  quoted_crypto_amount?: number;
  quoted_rate?: number;
}

export type SessionStatusResult =
  | CreatedSessionStatus
  | PendingSessionStatus
  | CompletedSessionStatus
  | FailedSessionStatus
  | CancelledSessionStatus
  | ExpiredSessionStatus;

export type SessionStatusResponse = {
  success: boolean;
  data: SessionStatusResult;
};

/**
 * Parameters for getting onramp.money session status
 */
export interface GetSessionStatusParams {
  sessionId: string;
  authToken?: string;
}
