import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const CreateProfileSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    // Accept UH addresses that end with hawaii.edu or uh.edu (subdomains allowed), case-insensitive
    .matches(/@([A-Za-z0-9-]+\.)*(hawaii|uh)\.edu$/i, 'Email must be a valid UH email')
    .required('Email is required'),
  bio: Yup.string().max(500, 'Bio must be at most 500 characters').required('Bio is required'),
  image: Yup.string().url('Image must be a valid URL').nullable(),
  clean: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required('Please select a cleanliness level'),
  // Match Prisma enum values (Budget: Low | Medium | High)
  budget: Yup.string().oneOf(['Low', 'Medium', 'High']).required('Please select a budget level'),
  // Match Prisma enum values (Social: Introvert | Ambivert | Extrovert | Unsure)
  social: Yup.string().oneOf(['Introvert', 'Ambivert', 'Extrovert', 'Unsure']).required('Please select a social level'),
  // Match Prisma enum values (Study: Cramming | Regular | None)
  study: Yup.string().oneOf(['Cramming', 'Regular', 'None']).required('Please select a study level'),
  // Match Prisma enum values (Sleep: Early_Bird | Night_Owl | Flexible)
  sleep: Yup.string().oneOf(['Early_Bird', 'Night_Owl', 'Flexible']).required('Please select a sleep level'),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});
