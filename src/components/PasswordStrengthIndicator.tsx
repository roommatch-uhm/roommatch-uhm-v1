'use client';

import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import {
  validatePassword,
  getPasswordRequirements,
  type PasswordValidationResult,
} from '@/lib/passwordValidator';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
  className?: string;
}

/**
 * Password strength indicator component that displays:
 * - Visual strength meter with color coding
 * - Strength label (Very Weak to Very Strong)
 * - List of requirements with check/x indicators
 */
export default function PasswordStrengthIndicator({
  password,
  showRequirements = true,
  className = '',
}: PasswordStrengthIndicatorProps) {
  const validationResult: PasswordValidationResult = validatePassword(password);
  const requirements = getPasswordRequirements(password);
  const { strength } = validationResult;

  // Don't show anything if password is empty
  if (!password || password.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Password Strength:</span>
          <span
            className="font-semibold"
            style={{ color: strength.color }}
          >
            {strength.label}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300 ease-in-out rounded-full"
            style={{
              width: `${strength.percentage}%`,
              backgroundColor: strength.color,
            }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-gray-700">Password must contain:</p>
          <ul className="space-y-1">
            {requirements.map((req) => (
              <li
                key={req.id}
                className="flex items-center gap-2 text-sm"
              >
                {req.met ? (
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                <span className={req.met ? 'text-green-700' : 'text-gray-600'}>
                  {req.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Security Tips */}
      {password.length >= 8 && !validationResult.isValid && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          <strong>Tip:</strong> Avoid common words, repeated characters, or sequential patterns for better security.
        </div>
      )}
    </div>
  );
}

/**
 * Compact version of the password strength indicator (just the meter, no requirements)
 */
export function PasswordStrengthMeter({ password }: { password: string }) {
  return (
    <PasswordStrengthIndicator
      password={password}
      showRequirements={false}
      className="mt-1"
    />
  );
}
