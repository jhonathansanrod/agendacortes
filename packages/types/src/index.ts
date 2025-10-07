export interface UserSession {
  id: string;
  email: string;
  name: string;
  orgId: string;
  role: string;
  iat: number;
  exp: number;
}

