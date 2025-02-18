import * as Yup from 'yup';

import Textarea from '@/components/Textarea/Textarea.tsx';

import { CreateMeetingField } from './CreateMeeting.types.ts';

export const createMeetingSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: Yup.string().optional().max(500, 'Description must not exceed 500 characters'),
});

export const createMeetingFields: CreateMeetingField[] = [
  {
    fieldName: 'title',
    placeholder: 'Meeting Headline',
  },
  {
    fieldName: 'description',
    placeholder: 'Meeting Description',
    component: Textarea,
  },
];
