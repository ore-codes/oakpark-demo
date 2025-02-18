import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/constants/pages.ts';
import { apiClient } from '@/lib/api/axios.ts';
import { useApiRequest } from '@/lib/api/useApiRequest.ts';
import { authService } from '@/lib/auth/AuthService.ts';

import { registerSchema } from './RegisterForm.config.ts';
import { RegisterRes } from './RegisterForm.types.ts';

export default function useRegisterForm() {
  const form = useForm({ resolver: yupResolver(registerSchema) });
  const apiRequest = useApiRequest<RegisterRes>();
  const navigate = useNavigate();

  const handleSubmit = form.handleSubmit((data) => {
    apiRequest.makeRequest(apiClient.post('auth/register', data)).subscribe(async (res) => {
      if (res) {
        await Promise.all([
          authService.userStorage.setData(res.user),
          authService.tokenStorage.setData(res.token),
        ]);
        navigate(Page.Dashboard);
      }
    });
  });

  return { form, handleSubmit, apiRequest };
}
