import { AuthResponse, Item, Transaction, User } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "";

const getHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      const resp = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || "Login failed");
      return data;
    },
    register: async (userData: Partial<User> & { password?: string }): Promise<AuthResponse> => {
      const resp = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || "Registration failed");
      return data;
    },
  },
  user: {
    getProfile: async (email: string): Promise<{ success: boolean, payload: User }> => {
      const resp = await fetch(`${API_BASE}/api/user/${email}`, {
        headers: getHeaders(),
      });
      if (!resp.ok) throw new Error("Failed to fetch profile");
      return resp.json();
    },
    updateProfile: async (data: Partial<User>): Promise<{ success: boolean, message: string }> => {
      const resp = await fetch(`${API_BASE}/api/user/update`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!resp.ok) throw new Error("Failed to update profile");
      return resp.json();
    }
  },
  items: {
    list: async (): Promise<{ success: boolean, payload: Item[] }> => {
      const resp = await fetch(`${API_BASE}/api/items`, {
        headers: getHeaders(),
      });
      if (!resp.ok) throw new Error("Failed to fetch items");
      return resp.json();
    }
  },
  transactions: {
    create: async (data: { item_id: number; quantity: number; description: string }): Promise<{ success: boolean, message: string }> => {
      const resp = await fetch(`${API_BASE}/api/transaction/create`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!resp.ok) throw new Error("Failed to create transaction");
      return resp.json();
    },
    list: async (): Promise<{ success: boolean, payload: Transaction[] }> => {
      const resp = await fetch(`${API_BASE}/api/transactions`, {
        headers: getHeaders(),
      });
      if (!resp.ok) throw new Error("Failed to fetch transactions");
      return resp.json();
    }
  }
};
