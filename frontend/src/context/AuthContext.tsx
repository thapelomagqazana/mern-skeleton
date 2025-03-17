import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  signIn as signInService,
  signOut as signOutService,
  isAuthenticated,
  getToken,
  clearToken
} from "../utils/authService";
import { getUserById, UserProfile } from "../utils/userService";

// JWT payload type
interface JwtPayload {
  email: string;
  role: string;
  exp: number; // Expiration time in seconds
  iat: number;
  user_id: number;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuth: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  unAuthUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  // Check if token expired
  const isTokenExpired = (exp: number) => {
    const currentTime = Date.now() / 1000; // in seconds
    return exp < currentTime;
  };

  const loadUser = async () => {
    if (isAuthenticated()) {
      try {
        const token = getToken();
        if (!token) {
          await signOut();
          return;
        }

        const decoded = jwtDecode<JwtPayload>(token);

        if (isTokenExpired(decoded.exp)) {
          await signOut();
          return;
        }
        const userId = decoded.user_id.toString();
        const profile = await getUserById(userId);
        setUser(profile);
        setIsAuth(true);
      } catch (error) {
        console.error("Failed to load user:", error);
        await signOut();
      }
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInService(email, password);
    await loadUser();
  };

  const signOut = async () => {
    await signOutService();
    setUser(null);
    setIsAuth(false);
  };

  const unAuthUser = async () => {
    clearToken();
    setUser(null);
    setIsAuth(false);
  }

  return (
    <AuthContext.Provider value={{ user, isAuth, signIn, signOut, unAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
