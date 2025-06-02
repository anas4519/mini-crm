import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { googleLogout } from "@react-oauth/google";

type User = {
  credential: string;
  // Add other user properties as needed
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (credential: any) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedCredential = localStorage.getItem("googleCredential");
    if (storedCredential) {
      try {
        const parsedCredential = JSON.parse(storedCredential);
        setUser(parsedCredential);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored credential", error);
        localStorage.removeItem("googleCredential");
      }
    }
  }, []);

  const login = (credential: any) => {
    localStorage.setItem("googleCredential", JSON.stringify(credential));
    setUser(credential);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem("googleCredential");
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    
    // Call Google logout to clear Google's cookies
    googleLogout();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};