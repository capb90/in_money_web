export interface IJwtPayload {
  sub: string;
  jti: string;
  tokenVersion: number;
}

export interface IJwtGenerate {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}
