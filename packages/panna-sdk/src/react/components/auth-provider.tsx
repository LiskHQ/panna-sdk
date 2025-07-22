import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  userAddress: string | null;
  setUserAddress: (address: string | null) => void;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userAddress, setUserAddress] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ userAddress, setUserAddress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
