import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_please_change';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export interface TokenPayload {
  id: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
}

/**
 * Generates a signed JWT access token containing user parameters.
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any,
  });
};

/**
 * Verifies a JWT access token signature and returns the decoded payload.
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
