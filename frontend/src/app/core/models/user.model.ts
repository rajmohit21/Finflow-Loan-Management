export type UserRole = 'USER' | 'APPLICANT' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  token?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  createdAt?: string;
  active?: boolean;
}

export interface AuthRequest {
  email: string;
  password?: string;
}

export interface SignupRequest {
  name: string;
  fullName?: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
}
