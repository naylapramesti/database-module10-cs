export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  balance: number;
}

export interface Item {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  image_url?: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  item_id: number;
  quantity: number;
  total: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  created_at: string;
  item?: Item;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  payload: {
    token: string;
    user: User;
  };
}
