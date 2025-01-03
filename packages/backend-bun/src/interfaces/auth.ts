export interface AuthResult {
  user: {
    id: number;
    username: string;
    email: string;
  };
  token: string;
}

export interface AuthProvider {
  getType(): string;
  login(credentials: { username: string; password: string }): Promise<AuthResult>;
  register?(userData: { username: string; email: string; password: string }): Promise<AuthResult>;
  verify(token: string): Promise<boolean>;
} 