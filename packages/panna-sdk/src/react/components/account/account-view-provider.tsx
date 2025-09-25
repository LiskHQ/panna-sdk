import React, { createContext, ReactNode, useContext, useState } from 'react';
import { type StringValues } from '../../../core/utils/types';

export enum AccountViewEnum {
  Main = 'main',
  Settings = 'settings',
  Buy = 'buy',
  Send = 'send'
}
export type AccountView = `${StringValues<typeof AccountViewEnum>}`;

type AccountViewContextProps = {
  activeView: AccountView;
  setActiveView: (screen: AccountView) => void;
};

const AccountViewContext = createContext<AccountViewContextProps | undefined>(
  undefined
);

export const useAccountView = () => {
  const context = useContext(AccountViewContext);
  if (!context) {
    throw new Error('useAccountView must be used within AccountViewProvider');
  }
  return context;
};

type AccountViewProviderProps = {
  children: ReactNode;
  initialView?: AccountView;
};

export const AccountViewProvider: React.FC<AccountViewProviderProps> = ({
  children,
  initialView = AccountViewEnum.Main
}) => {
  const [activeView, setActiveView] = useState<AccountView>(initialView);

  // TODO: In the future when we want to setup theming, we can add a ThemeProvider here
  // that uses the `theme` prop and wraps the children with it.
  return (
    <AccountViewContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </AccountViewContext.Provider>
  );
};
