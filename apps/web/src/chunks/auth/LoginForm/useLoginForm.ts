import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { LoginRes } from '@/chunks/auth/LoginForm/LoginForm.types.ts';
import { Page } from '@/constants/pages.ts';
import { apiClient } from '@/lib/api/axios.ts';
import { useApiRequest } from '@/lib/api/useApiRequest.ts';
import { authService } from '@/lib/auth/AuthService.ts';

import { loginSchema } from './LoginForm.config.ts';

export default function useLoginForm() {
  const form = useForm({ resolver: yupResolver(loginSchema) });
  const apiRequest = useApiRequest<LoginRes>();
  const navigate = useNavigate();

  const handleSubmit = form.handleSubmit((data) => {
    apiRequest.makeRequest(apiClient.post('auth/login', data)).subscribe(async (res) => {
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
