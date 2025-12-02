import * as Yup from 'yup';
import { validatePassword } from './passwordValidator';

/**
 * Maximum file size for profile pictures (5MB)
 */
export const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * Allowed image MIME types for profile pictures
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const CreateProfileSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string()
    .max(500, 'Description must be at most 500 characters')
    .required('Description is required'),
  image: Yup.string()
    .nullable()
    .notRequired()
    .test(
      'is-url-or-relative',
      'Image must be valid',
      (val) => !val || /^\/|^https?:\/\//.test(val),
    ),
  clean: Yup.string()
    .oneOf(['excellent', 'good', 'fair', 'poor'])
    .required('Please select a cleanliness level'),
  // allow zero budget; use min(0) instead of .positive()
  budget: Yup.number().min(0, 'Budget must be 0 or greater').nullable(),
  // Match Prisma enum values (Social: Introvert | Ambivert | Extrovert | Unsure)
  social: Yup.string()
    .oneOf(['Introvert', 'Ambivert', 'Extrovert', 'Unsure'])
    .required('Please select a social level'),
  // Match Prisma enum values (Study: Cramming | Regular | None)
  study: Yup.string()
    .oneOf(['Cramming', 'Regular', 'None'])
    .required('Please select a study level'),
  // Match Prisma enum values (Sleep: Early_Bird | Night_Owl | Flexible)
  sleep: Yup.string()
    .oneOf(['Early_Bird', 'Night_Owl', 'Flexible'])
    .required('Please select a sleep level'),
});

// reuse same rules for editing
export const EditProfileSchema = CreateProfileSchema;

const AddUserSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  UHemail: Yup.string().email('Invalid email').required('UH email is required'),
  password: Yup.string()
    .required('Password is required')
    .test('password-strength', function (value) {
      if (!value) return this.createError({ message: 'Password is required' });

      const result = validatePassword(value);

      if (!result.isValid) {
        return this.createError({
          message: result.errors[0] || 'Password does not meet security requirements',
        });
      }

      return true;
    }),
  roommateStatus: Yup.string()
    .oneOf(['Looking', 'Not Looking', 'Has Roommate'])
    .required('Roommate status is required'),
  budget: Yup.number().positive('Budget must be positive').nullable(),
  preferences: Yup.string().nullable(),
});

export default AddUserSchema;
