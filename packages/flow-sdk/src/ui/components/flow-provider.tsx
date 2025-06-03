import { ReactNode } from 'react';
import { ThirdwebProvider } from 'thirdweb/react';

export type FlowProviderProps = {
  children?: ReactNode;
};

export function FlowProvider(props: FlowProviderProps) {
  return <ThirdwebProvider>{props.children}</ThirdwebProvider>;
}
