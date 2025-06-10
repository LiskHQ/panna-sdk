// Enum for allowed ecosystem IDs
export enum EcosystemId {
  LISK = 'ecosystem.lisk'
}

// Base ecosystem configuration
export interface EcosystemConfig {
  id: EcosystemId;
  partnerId: string;
}
