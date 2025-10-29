export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}