import slugify from 'slugify';
import crypto from 'crypto';

export class Helpers {
  /**
   * Generate a unique slug from a title
   * @param title - The title to slugify
   * @param suffixBytes - Number of random bytes to append (default 6 -> 12 hex chars)
   */
  static generateSlug(title: string, suffixBytes: number = 6): string {
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });
    const randomString = crypto.randomBytes(suffixBytes).toString('hex');
    return `${baseSlug}-${randomString}`;
  }

  /**
   * Generate a random verification token
   */
  static generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate a random 6-digit OTP
   */
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Calculate pagination
   */
  static getPagination(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return { skip, limit };
  }

  /**
   * Sanitize user object (remove sensitive data)
   */
  static sanitizeUser(user: any) {
    const { password, __v, ...sanitized } = user.toObject ? user.toObject() : user;
    return sanitized;
  }

  /**
   * Calculate CO2 equivalent
   */
  static calculateCO2Equivalent(quantity: number, emissionFactor: number): number {
    return Number((quantity * emissionFactor).toFixed(2));
  }

  /**
   * Calculate progress percentage
   */
  static calculateProgress(completed: number, total: number): number {
    if (total === 0) return 0;
    return Number(((completed / total) * 100).toFixed(2));
  }

  /**
   * Format date to YYYY-MM-DD
   */
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Check if string is valid email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if string is strong password
   * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
   */
  static isStrongPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }

  /**
   * Generate random user ID
   */
  static generateUserId(prefix: string = 'SME'): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Get sustainability level name
   */
  static getSustainabilityLevelName(level: 1 | 2 | 3): string {
    const levels = {
      1: 'Foundation & Measurement',
      2: 'Efficiency & Integration',
      3: 'Transformation & Net Zero Leadership'
    };
    return levels[level];
  }

  /**
   * Parse query string boolean
   */
  static parseBoolean(value: any): boolean {
    return value === 'true' || value === true || value === 1 || value === '1';
  }

  /**
   * Safe JSON parse
   */
  static safeJSONParse(str: string, defaultValue: any = null): any {
    try {
      return JSON.parse(str);
    } catch {
      return defaultValue;
    }
  }
}
