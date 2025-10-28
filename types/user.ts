export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'student' | 'parent';
  studentId?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'student' | 'parent';
}
