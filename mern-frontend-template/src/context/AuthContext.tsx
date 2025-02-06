import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCurrentUser } from "../services/userService";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Define AuthContext type
interface AuthContextType {
  user: any;
  authUser: (data: any) => Promise<void>;
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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Function to check if the token is expired
  const isTokenExpired = (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.exp * 1000 < Date.now(); // Convert exp to milliseconds
    } catch (error) {
      return true; // Assume expired if decoding fails
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId || isTokenExpired(token)) {
      logout(); // Expired or missing token → log out
      return;
    }

    fetchCurrentUser(userId)
      .then(setUser)
      .catch(() => logout());
  }, []);

  /**
   * Authenticates the user and stores credentials
   */
  const authUser = async (data: any) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user._id); // Store userId
    setUser(data.user);
  };

  /**
   * Logs out the user
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId"); // Remove userId from storage
    setUser(null);
    navigate("/signin"); // Redirect to sign-in page
  };

  return <AuthContext.Provider value={{ user, authUser, logout }}>{children}</AuthContext.Provider>;
};

// ✅ Export AuthContext & useAuth properly
export { AuthContext };
