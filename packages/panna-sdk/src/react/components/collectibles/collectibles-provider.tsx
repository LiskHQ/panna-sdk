import { createContext, ReactNode, use, useState } from 'react';
import { Token, TokenInstance } from 'src/core';

type CollectiblesContextType = {
  activeCollectible: TokenInstance | undefined;
  setActiveCollectible: (collectible: TokenInstance | undefined) => void;
  activeToken: Token | undefined;
  setActiveToken: (token: Token | undefined) => void;
};

const CollectiblesContext = createContext<CollectiblesContextType | undefined>(
  undefined
);

export function useCollectiblesInfo() {
  const context = use(CollectiblesContext);
  if (!context) {
    throw new Error(
      'useCollectiblesInfo must be used within a CollectiblesProvider'
    );
  }
  return context;
}

type CollectiblesProviderProps = {
  children: ReactNode;
};

export function CollectiblesProvider({ children }: CollectiblesProviderProps) {
  const [activeCollectible, setActiveCollectible] = useState<TokenInstance>();
  const [activeToken, setActiveToken] = useState<Token>();

  return (
    <CollectiblesContext
      value={{
        activeCollectible,
        setActiveCollectible,
        activeToken,
        setActiveToken
      }}
    >
      {children}
    </CollectiblesContext>
  );
}
