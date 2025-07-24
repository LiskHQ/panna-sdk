import { createContext, use, useState } from 'react';

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
    <AuthContext value={{ userAddress, setUserAddress }}>
      {children}
    </AuthContext>
  );
};

export const useAuth = () => {
  const context = use(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
