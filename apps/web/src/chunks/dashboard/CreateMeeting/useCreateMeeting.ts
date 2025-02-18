import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { apiClient } from '@/lib/api/axios.ts';
import { useApiRequest } from '@/lib/api/useApiRequest.ts';

import { createMeetingSchema } from './CreateMeeting.config.ts';
import { CreateMeetingRes } from './CreateMeeting.types.ts';

export default function useCreateMeeting() {
  const form = useForm({ resolver: yupResolver(createMeetingSchema) });
  const apiRequest = useApiRequest<CreateMeetingRes>();
  const [createdMeeting, setCreatedMeeting] = useState<CreateMeetingRes>();
  const meetingLink = window.location.origin + '/meeting/' + createdMeeting?.code;

  const handleSubmit = form.handleSubmit((data) => {
    apiRequest.makeRequest(apiClient.post('meetings', data)).subscribe(async (res) => {
      if (res) setCreatedMeeting(res);
    });
  });

  return { form, handleSubmit, apiRequest, createdMeeting, meetingLink };
}
