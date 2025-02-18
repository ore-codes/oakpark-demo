import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { apiClient } from '@/lib/api/axios.ts';
import { useApiRequest } from '@/lib/api/useApiRequest.ts';

import joinMeetingSchema from './JoinMeeting.config.ts';
import { GetMeetingRes } from './JoinMeeting.types.ts';

export default function useJoinMeeting() {
  const form = useForm({ resolver: yupResolver(joinMeetingSchema) });
  const apiRequest = useApiRequest<GetMeetingRes>();
  const navigate = useNavigate();

  const handleSubmit = form.handleSubmit(async (data) => {
    apiRequest.makeRequest(apiClient.get(`meetings/${data.code}`)).subscribe(async (res) => {
      if (res) navigate('/meeting/' + res.meeting.code);
    });
  });

  return { form, handleSubmit, apiRequest };
}
