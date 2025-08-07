import type { PannaClient } from '../client';

// Onramp transaction status types
export type OnrampStatus = 'CREATED' | 'PENDING' | 'COMPLETED';

// Transaction details for completed onramps
export interface OnrampTransaction {
  chainId: number;
  transactionHash: string;
}

// Purchase data included with onramp status
export type OnrampPurchaseData = Record<string, unknown>;

// Parameters for getting onramp status
export interface OnrampStatusParams {
  id: string; // Onramp session identifier
  client: PannaClient;
}

// Base result structure for all statuses
interface BaseOnrampStatusResult {
  status: OnrampStatus;
  transactions: OnrampTransaction[];
  purchaseData: OnrampPurchaseData;
}

// Created status result
export interface OnrampCreatedResult extends BaseOnrampStatusResult {
  status: 'CREATED';
  transactions: []; // Always empty for created status
}

// Pending status result
export interface OnrampPendingResult extends BaseOnrampStatusResult {
  status: 'PENDING';
  transactions: []; // Always empty for pending status
}

// Completed status result
export interface OnrampCompletedResult extends BaseOnrampStatusResult {
  status: 'COMPLETED';
}

// Union type for all possible status results
export type OnrampStatusResult =
  | OnrampCreatedResult
  | OnrampPendingResult
  | OnrampCompletedResult;

// Onramp providers list
export type OnRampProvider = 'stripe' | 'coinbase' | 'transak';

// Parameters for preparing an onramp
export interface OnrampPrepareParams {
  client: PannaClient;
  onRampProvider: OnRampProvider;
  chainId?: number;
  tokenAddress: string;
  receiver: string;
  amount: string;
  purchaseData?: OnrampPurchaseData;
  country: string;
}

// OnRamp intent to hold provider info
export interface OnRampIntent {
  onRampProvider: OnRampProvider;
  chainId: number;
  tokenAddress: string;
  receiver: string;
  amount: string;
}

// Result structure for prepared onramps
export interface OnrampPrepareResult {
  id: string;
  link: string;
  currency: string;
  currencyAmount: string;
  destinationAmount: string;
  timestamp?: number;
  expiration?: number;
  intent?: OnRampIntent;
}
