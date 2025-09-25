import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Token, TokenInstance } from 'src/core';

type CollectiblesContextType = {
  activeCollectible: TokenInstance | null;
  setActiveCollectible: (collectible: TokenInstance | null) => void;
  activeToken: Token | null;
  setActiveToken: (token: Token | null) => void;
};

const CollectiblesContext = createContext<CollectiblesContextType | undefined>(
  undefined
);

export const useCollectiblesInfo = () => {
  const context = useContext(CollectiblesContext);
  if (!context) {
    throw new Error(
      'useCollectiblesInfo must be used within a CollectiblesProvider'
    );
  }
  return context;
};

type CollectiblesProviderProps = {
  children: ReactNode;
};

export const CollectiblesProvider: React.FC<CollectiblesProviderProps> = ({
  children
}) => {
  const [activeCollectible, setActiveCollectible] =
    useState<TokenInstance | null>(null);
  const [activeToken, setActiveToken] = useState<Token | null>(null);

  return (
    <CollectiblesContext.Provider
      value={{
        activeCollectible,
        setActiveCollectible,
        activeToken,
        setActiveToken
      }}
    >
      {children}
    </CollectiblesContext.Provider>
  );
};
