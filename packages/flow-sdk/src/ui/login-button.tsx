import { useMemo } from 'react';
import { ConnectButton, ConnectButtonProps } from 'thirdweb/react';
import { createFlowClient } from '../core';
import { liskTheme } from './theme';

export type LoginButtonProps = Omit<ConnectButtonProps, 'client'>;

export function LoginButton(props: LoginButtonProps) {
  const client = useMemo(
    () =>
      createFlowClient({
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID || ''
      }),
    [process.env.NEXT_PUBLIC_CLIENT_ID]
  );

  return (
    <ConnectButton
      client={client}
      connectButton={{ label: 'Sign in' }}
      theme={liskTheme}
      appMetadata={{
        name: 'Lisk Flow App',
        logoUrl: 'https://portal-assets.lisk.com/logo/lisk-profile-w.svg'
      }}
      connectModal={{
        titleIcon: 'https://portal-assets.lisk.com/logo/lisk-profile-w.svg'
      }}
      {...props}
    />
  );
}
