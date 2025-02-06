import api from "./api";

/**
 * UserService - API functions for user authentication and management.
 */

// TypeScript interface for user objects
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

// Register a new user
export const registerUser = async (userData: Partial<User>) => {
  const response = await api.post("/auth/signup", userData);
  return response.data;
};

// Login user
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await api.post("/auth/signin", credentials);
  return response.data;
};

// Fetch the current logged-in user
// Fetch a user by userId
export const fetchCurrentUser = async (userId: string) => {
    const response = await api.get(`/api/users/${userId}`);
    console.log(response.data);
    return response.data;
};
  

// Fetch all users (Admin only)
export const fetchUsers = async () => {
  const response = await api.get("/api/users");
  return response.data;
};

// Update user profile
export const updateUser = async (userId: string, updates: Partial<User>) => {
  const response = await api.put(`/users/${userId}`, updates);
  return response.data;
};

// Delete a user
export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};
