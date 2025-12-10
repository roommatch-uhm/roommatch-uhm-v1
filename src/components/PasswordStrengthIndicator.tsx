'use client';

import React from 'react';

/**
 * Simple inline SVG icon components to avoid dependency on 'lucide-react'.
 * These mirror the usage of CheckCircle and XCircle in the component and accept
 * standard SVG props (including className for styling).
 */
export const CheckCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const XCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path d="M15 9l-6 6M9 9l6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Strength Meter with Segments */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
          <span style={{ color: '#6b7280' }}>Password Strength:</span>
          <span
            style={{ color: strength.color, fontWeight: 600 }}
          >
            {strength.label}
          </span>
        </div>

        {/* Segmented Meter Bar */}
        <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
          {[0, 1, 2, 3, 4].map((segment) => (
            <div
              key={segment}
              style={{
                height: '8px',
                flex: 1,
                borderRadius: '9999px',
                transition: 'all 0.3s ease-in-out',
                backgroundColor: segment < Math.ceil(strength.score)
                  ? strength.color
                  : '#e5e7eb',
              }}
            />
          ))}
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p style={{ fontSize: '14px', fontWeight: 500, color: '#374151', margin: 0 }}>Password must contain:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {requirements.map((req) => (
              <li
                key={req.id}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
              >
                {req.met ? (
                  <CheckCircle style={{ width: '16px', height: '16px', color: '#16a34a', flexShrink: 0 }} />
                ) : (
                  <XCircle style={{ width: '16px', height: '16px', color: '#9ca3af', flexShrink: 0 }} />
                )}
                <span style={{ color: req.met ? '#15803d' : '#4b5563' }}>
                  {req.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Security Tips */}
      {password.length >= 8 && !validationResult.isValid && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          backgroundColor: '#fefce8',
          border: '1px solid #fde047',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#854d0e'
        }}>
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
