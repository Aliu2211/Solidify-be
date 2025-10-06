import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config/environment';
import { JWTPayload } from '../types';

export class JWTService {
  /**
   * Generate access token
   */
  static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    } as SignOptions);
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    } as SignOptions);
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, config.JWT_SECRET as string) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, config.JWT_REFRESH_SECRET as string) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate both tokens
   */
  static generateTokens(payload: JWTPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Decode token without verification (for debugging)
   */
  static decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }
}
