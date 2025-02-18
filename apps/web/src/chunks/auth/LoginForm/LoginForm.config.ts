import * as Yup from 'yup';

import { LoginFormField } from '@/chunks/auth/LoginForm/LoginForm.types.ts';

export const loginSchema = Yup.object({
  email: Yup.string().email().required().label('Email address'),
  password: Yup.string().required().label('Password'),
}).required();

export const loginFields: LoginFormField[] = [
  {
    fieldName: 'email',
    placeholder: 'Email address',
    type: 'email',
  },
  {
    fieldName: 'password',
    placeholder: 'Password',
    type: 'password',
  },
];
