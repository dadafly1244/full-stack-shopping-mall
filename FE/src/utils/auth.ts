export interface JwtPayload {
  userId: string;
  userRole: string;
  exp: number;
}

export const JWT_SECRET = process.env.REACT_APP_JWT_SECRET || "";
