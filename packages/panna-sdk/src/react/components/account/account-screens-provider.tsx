import React, { ReactNode } from 'react';
import { CollectiblesProvider } from '../collectibles/collectibles-provider';

type AccountScreensProviderProps = {
  children: ReactNode;
};

/**
 * Provides context providers required by different account screens.
 *
 * This component wraps its children with all necessary context providers,
 * such as `CollectiblesProvider`, to ensure that account-related screens
 * have access to shared state and functionality.
 *
 * Use this component to house and manage contexts that are needed across
 * multiple account screens in the application.
 *
 * @param children - The React nodes that will be rendered within the context providers.
 */
export const AccountScreensProvider: React.FC<AccountScreensProviderProps> = ({
  children
}) => {
  return <CollectiblesProvider>{children}</CollectiblesProvider>;
};
