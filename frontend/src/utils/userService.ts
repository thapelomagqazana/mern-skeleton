import axios from "axios";
import { getToken } from "./authService";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// Backend API base URL (from your .env)
const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;
const API_URL_AUTH = `${import.meta.env.VITE_API_URL}/auth`;

// Sign up new user
export const signUp = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL_AUTH}/signup`, {
    name,
    email,
    password,
  });
  return response.data;
};


// Get user by ID
export const getUserById = async (userId: string): Promise<UserProfile> => {
  const response = await axios.get<{ user: UserProfile }>(
    `${API_URL}/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return response.data.user;
};

export const updateUser = async (userId: string, userData: { name: string; email: string; role: string }) => {
  const response = await axios.put(`${API_URL}/${userId}`, userData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return response.data;
};

export const deleteUser = async (userId: string) => {
  await axios.delete(`${API_URL}/${userId}`, 
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
};
