import * as Yup from 'yup';

import { loginSchema } from '@/chunks/auth/LoginForm/LoginForm.config.ts';
import { TextboxProps } from '@/components/Textbox/Textbox.types.ts';
import { User } from '@/lib/auth/auth.types.ts';

export type LoginFormField = TextboxProps & {
  fieldName: keyof Yup.InferType<typeof loginSchema>;
};

export type LoginRes = {
  user: User;
  token: string;
};
