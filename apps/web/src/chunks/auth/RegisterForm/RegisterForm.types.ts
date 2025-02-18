import * as Yup from 'yup';

import { TextboxProps } from '@/components/Textbox/Textbox.types.ts';
import { User } from '@/lib/auth/auth.types.ts';

import { registerSchema } from './RegisterForm.config.ts';

export type RegisterFormField = TextboxProps & {
  fieldName: keyof Yup.InferType<typeof registerSchema>;
};

export type RegisterRes = {
  user: User;
  token: string;
};
