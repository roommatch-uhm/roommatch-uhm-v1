import * as Yup from 'yup';

export const CreateProfileSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string()
    .max(500, 'Description must be at most 500 characters')
    .required('Description is required'),
  image: Yup.string().url('Image must be a valid URL').nullable(),
  clean: Yup.string()
    .oneOf(['excellent', 'good', 'fair', 'poor'])
    .required('Please select a cleanliness level'),
  // Match Prisma enum values (Budget: Low | Medium | High)
  budget: Yup.number().positive('Budget must be positive').nullable(),
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

const AddUserSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  UHemail: Yup.string().email('Invalid email').required('UH email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  roommateStatus: Yup.string()
    .oneOf(['Looking', 'Not Looking', 'Has Roommate'])
    .required('Roommate status is required'),
  budget: Yup.number().positive('Budget must be positive').nullable(),
  preferences: Yup.string().nullable(),
});

export default AddUserSchema;
