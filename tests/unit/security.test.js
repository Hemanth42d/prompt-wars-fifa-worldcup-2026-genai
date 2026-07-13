import { 
  verifyPassword, 
  getPasswordHash, 
  sanitize_input, 
  validate_input_length,
  validateEmail,
  checkPasswordStrength 
} from '../../server/utils/security.js';
import bcrypt from 'bcryptjs';

describe('Security Utilities', () => {
  describe('Password Hashing', () => {
    it('should hash password correctly', () => {
      const password = 'TestPassword123!';
      const hash = getPasswordHash(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should verify correct password', () => {
      const password = 'TestPassword123!';
      const hash = bcrypt.hashSync(password, 12);
      
      const isValid = verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', () => {
      const password = 'TestPassword123!';
      const hash = bcrypt.hashSync(password, 12);
      
      const isValid = verifyPassword('WrongPassword', hash);
      expect(isValid).toBe(false);
    });
  });

  describe('Input Sanitization', () => {
    it('should remove dangerous HTML characters', () => {
      const malicious = '<script>alert("xss")</script>';
      const sanitized = sanitize_input(malicious);
      
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
      expect(sanitized).toBe('scriptalert"xss"/script');
    });

    it('should handle SQL injection attempts', () => {
      const sqlInjection = "'; DROP TABLE users; --";
      const sanitized = sanitize_input(sqlInjection);
      
      expect(sanitized).not.toContain(';');
      expect(sanitized).not.toContain("'");
      expect(sanitized).toBe(' DROP TABLE users --');
    });

    it('should handle empty input', () => {
      expect(sanitize_input('')).toBe('');
      expect(sanitize_input(null)).toBe('');
      expect(sanitize_input(undefined)).toBe('');
    });
  });

  describe('Input Validation', () => {
    it('should accept valid length input', () => {
      const text = 'Valid input message';
      expect(validate_input_length(text, 100)).toBe(true);
    });

    it('should reject too long input', () => {
      const text = 'a'.repeat(1001);
      expect(validate_input_length(text, 1000)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validate_input_length('', 10)).toBe(false);
      expect(validate_input_length('a', 1)).toBe(true);
    });
  });

  describe('Email Validation', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validateEmail('notanemail')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('Password Strength', () => {
    it('should check strong password', () => {
      const result = checkPasswordStrength('Test1234!');
      expect(result.isStrong).toBe(true);
      expect(result.strength).toBe('strong');
      expect(result.score).toBeGreaterThanOrEqual(4);
    });

    it('should check weak password', () => {
      const result = checkPasswordStrength('weak');
      expect(result.isStrong).toBe(false);
      expect(result.strength).toBe('weak');
    });

    it('should check medium password', () => {
      const result = checkPasswordStrength('Test123');
      expect(result.strength).toBe('medium');
    });
  });
});
