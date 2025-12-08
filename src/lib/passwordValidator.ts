/**
 * Password validation utility with comprehensive security requirements
 * and password strength calculation
 */

export interface PasswordRequirement {
  id: string;
  label: string;
  regex: RegExp;
  met: boolean;
}

export interface PasswordStrength {
  score: number; // 0-4 (weak to very strong)
  label: string;
  color: string;
  percentage: number;
}

export interface PasswordValidationResult {
  isValid: boolean;
  requirements: PasswordRequirement[];
  strength: PasswordStrength;
  errors: string[];
}

/**
 * Minimum password security requirements
 */
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  maxLength: 128, // Prevent DoS attacks
};

/**
 * Special characters allowed in passwords
 */
export const SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

/**
 * Defines the password requirements with their validation rules
 */
export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    {
      id: 'minLength',
      label: `At least ${PASSWORD_REQUIREMENTS.minLength} characters`,
      regex: new RegExp(`.{${PASSWORD_REQUIREMENTS.minLength},}`),
      met: password.length >= PASSWORD_REQUIREMENTS.minLength,
    },
    {
      id: 'uppercase',
      label: 'Contains uppercase letter (A-Z)',
      regex: /[A-Z]/,
      met: /[A-Z]/.test(password),
    },
    {
      id: 'lowercase',
      label: 'Contains lowercase letter (a-z)',
      regex: /[a-z]/,
      met: /[a-z]/.test(password),
    },
    {
      id: 'number',
      label: 'Contains a number (0-9)',
      regex: /[0-9]/,
      met: /[0-9]/.test(password),
    },
    {
      id: 'specialChar',
      label: `Contains special character (${SPECIAL_CHARS.slice(0, 10)}...)`,
      regex: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/,
      met: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password),
    },
  ];
}

/**
 * Calculate password strength based on various factors
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const requirements = getPasswordRequirements(password);

  // Base score from met requirements (each requirement = 1 point, max 5)
  const metRequirements = requirements.filter((req) => req.met).length;
  score += metRequirements;

  // Bonus points for length
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Bonus for character diversity
  const hasMultipleSpecialChars = (password.match(/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/g) || []).length >= 2;
  if (hasMultipleSpecialChars) score += 0.5;

  const hasMultipleNumbers = (password.match(/[0-9]/g) || []).length >= 2;
  if (hasMultipleNumbers) score += 0.5;

  // Penalty for common patterns
  const hasRepeatingChars = /(.)\1{2,}/.test(password); // aaa, bbb, etc.
  if (hasRepeatingChars) score -= 1;

  const hasSequentialChars = /abc|bcd|cde|123|234|345|456|567|678|789/i.test(password);
  if (hasSequentialChars) score -= 0.5;

  // Normalize score to 0-4 range
  score = Math.max(0, Math.min(4, score / 2));

  // Determine strength label and color
  let label: string;
  let color: string;

  if (score < 1) {
    label = 'Very Weak';
    color = '#dc2626'; // red-600
  } else if (score < 2) {
    label = 'Weak';
    color = '#f97316'; // orange-500
  } else if (score < 3) {
    label = 'Fair';
    color = '#eab308'; // yellow-500
  } else if (score < 4) {
    label = 'Strong';
    color = '#22c55e'; // green-500
  } else {
    label = 'Very Strong';
    color = '#16a34a'; // green-600
  }

  return {
    score,
    label,
    color,
    percentage: (score / 4) * 100,
  };
}

/**
 * Validate a password against all security requirements
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  const requirements = getPasswordRequirements(password);

  // Check if password is empty
  if (!password || password.trim().length === 0) {
    errors.push('Password is required');
    return {
      isValid: false,
      requirements,
      strength: { score: 0, label: 'Very Weak', color: '#dc2626', percentage: 0 },
      errors,
    };
  }

  // Check maximum length (prevent DoS)
  if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
    errors.push(`Password must not exceed ${PASSWORD_REQUIREMENTS.maxLength} characters`);
  }

  // Check each requirement
  requirements.forEach((req) => {
    if (!req.met) {
      errors.push(req.label);
    }
  });

  // Check for common weak passwords
  const commonPasswords = [
    'password', 'password123', 'password1', '12345678', 'qwerty123',
    'abc12345', 'welcome123', 'admin123', 'user1234', 'test1234',
  ];

  if (commonPasswords.some((common) => password.toLowerCase().includes(common))) {
    errors.push('Password contains common words or patterns');
  }

  const strength = calculatePasswordStrength(password);
  const isValid = errors.length === 0 && requirements.every((req) => req.met);

  return {
    isValid,
    requirements,
    strength,
    errors,
  };
}

/**
 * Check if two passwords match
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword && password.length > 0;
}

/**
 * Get user-friendly error message for password validation
 */
export function getPasswordErrorMessage(result: PasswordValidationResult): string {
  if (result.isValid) return '';

  if (result.errors.length === 1) {
    return result.errors[0];
  }

  return `Password must meet the following requirements: ${result.errors.join(', ')}`;
}
