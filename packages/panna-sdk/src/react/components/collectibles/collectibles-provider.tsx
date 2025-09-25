import React, { createContext, ReactNode, useContext, useState } from 'react';
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
  const [activeCollectible, setActiveCollectible] = useState<
    TokenInstance | undefined
  >();
  const [activeToken, setActiveToken] = useState<Token | undefined>();

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
