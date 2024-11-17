import { createContext } from 'react';
import { Auth, Empresa, User } from '../interfaces/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: Auth) => void;
  logout: () => void;
  dataLogin: Auth | null;
  empresa: Empresa | null;
  user: User | null;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);