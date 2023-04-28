import { createContext, useState, ReactNode } from "react";

interface Auth {
  username: string;
  email: string;
  pwd: string;
  roles: string[];
  accessToken: string;
  roomId: string; 
}

interface AuthContextType {
  auth: Auth | null;
  setAuth: (auth: Auth) => void;
  username?: string;
}

const AuthContext = createContext<AuthContextType>({
  auth: null,
  setAuth: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<Auth | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
