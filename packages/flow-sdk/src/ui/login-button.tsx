import React, { useMemo } from 'react';
import { createThirdwebClient } from 'thirdweb';
import { ConnectButton, ConnectButtonProps } from 'thirdweb/react';

export type LoginButtonProps = Omit<ConnectButtonProps, 'client'>;

export function LoginButton(props: LoginButtonProps) {
  const client = useMemo(
    () =>
      createThirdwebClient({
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
