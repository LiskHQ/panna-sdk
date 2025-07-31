import { createContext, use, useState, useEffect } from 'react';
import {
  USER_ADDRESS,
  WALLET_TOKEN,
  USER_CONTACT,
  LAST_AUTH_PROVIDER
} from '@/consts';

type AuthContextType = {
  userAddress: string | null;
  setUserAddress: (address: string | null) => void;
  isHydrated: boolean;
  logout: () => void;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Initialize auth state from localStorage after component mounts
    const storedAddress = localStorage.getItem(USER_ADDRESS);
    if (storedAddress) {
      setUserAddress(storedAddress);
    }
    setIsHydrated(true);
  }, []);

  const logout = () => {
    // Clear all auth-related localStorage items
    localStorage.removeItem(USER_ADDRESS);
    localStorage.removeItem(WALLET_TOKEN);
    localStorage.removeItem(USER_CONTACT);
    localStorage.removeItem(LAST_AUTH_PROVIDER);

    // Clear context state
    setUserAddress(null);
  };

  return (
    <AuthContext value={{ userAddress, setUserAddress, isHydrated, logout }}>
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
