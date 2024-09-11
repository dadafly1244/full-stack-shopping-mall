export interface JwtPayload {
  userId: string;
  userRole: string;
  exp: number;
}
