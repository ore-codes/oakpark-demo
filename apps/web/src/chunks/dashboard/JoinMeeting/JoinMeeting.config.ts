import * as Yup from 'yup';

const joinMeetingSchema = Yup.object({
  code: Yup.string()
    .trim()
    .matches(
      /^[a-z0-9-]*$/i,
      'Meeting code can only contain letters, numbers, and hyphens (no spaces)'
    )
    .required('Meeting code is required')
    .transform((value) => value.replace(/-/g, '').toLowerCase()),
});

export default joinMeetingSchema;
