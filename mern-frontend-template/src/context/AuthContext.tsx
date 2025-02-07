import React, { createContext, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { logoutUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

// Define AuthContext type
interface AuthContextType {
  authUser: (data: any) => void;
  logout: () => void;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Type for decoded JWT token
interface DecodedToken {
  exp: number; // Expiration time in seconds
  id: string;
}

// AuthProvider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  /**
   * Function to check if the token is expired
   */
  const isTokenExpired = (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.exp * 1000 < Date.now(); // Convert exp to milliseconds
    } catch (error) {
      return true; // Assume expired if decoding fails
    }
  };


  /**
   * Retrieve credentials on app load
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId || isTokenExpired(token)) {
      logout(); // Expired or missing token → log out
      return;
    }
  }, []);


  /**
   * Save credentials on successful login
   */
  const authUser = (data: any) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user._id);
  };

  /**
   * Delete credentials on logout
   */
  const logout = () => {
    logoutUser();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/signin");
  };

  return <AuthContext.Provider value={{ authUser, logout }}>{children}</AuthContext.Provider>;
};

// Export AuthContext & useAuth properly
export { AuthContext };
