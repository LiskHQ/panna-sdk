import { createThirdwebClient } from 'thirdweb';
import { ConnectButton, ConnectButtonProps } from 'thirdweb/react';

export type LoginButtonProps = Omit<ConnectButtonProps, 'client'>;

export const LoginButton = (props: LoginButtonProps) => {
  const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID || ''
  });

  return (
    <ConnectButton
      client={client}
      connectButton={{ label: 'Sign in' }}
      {...props}
    />
  );
};
