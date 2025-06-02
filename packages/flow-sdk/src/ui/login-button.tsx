import { useMemo } from 'react';
import { ConnectButton, ConnectButtonProps } from 'thirdweb/react';
import { createFlowClient } from '../core';

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
      {...props}
    />
  );
}
