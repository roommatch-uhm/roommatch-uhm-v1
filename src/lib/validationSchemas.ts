import * as Yup from 'yup';

const AddUserSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  UHemail: Yup.string().email('Invalid email').required('UH email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  roommateStatus:
  Yup.string().oneOf(['Looking', 'Not Looking', 'Has Roommate']).required('Roommate status is required'),
  budget: Yup.number().positive('Budget must be positive').nullable(),
  preferences: Yup.string().nullable(),
});

export default AddUserSchema;
