import { FC } from 'react';
import * as Yup from 'yup';

import { TextareaProps } from '@/components/Textarea/Textarea.types.ts';
import { TextboxProps } from '@/components/Textbox/Textbox.types.ts';

import { createMeetingSchema } from './CreateMeeting.config.ts';

export type CreateMeetingField<T = TextboxProps & TextareaProps> = Partial<T> & {
  fieldName: keyof Yup.InferType<typeof createMeetingSchema>;
  component?: FC<any>;
};

export type CreateMeetingRes = {
  id: string;
  title: string;
  code: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  durationInSecs: number;
  description: string | null;
};
