import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { ModalRef } from '@/components/Modal.tsx';
import { Page } from '@/constants/pages.ts';
import { authService } from '@/lib/auth/AuthService.ts';
import useRxState from '@/lib/storage/useRxState.ts';
import { Meeting } from '@/lib/common.types';
import { useApiRequest } from '@/lib/api/useApiRequest';
import { apiClient } from '@/lib/api/axios';

export default function useDashboard() {
  const navigate = useNavigate();
  const user = useRxState(authService.userStorage.data$);
  const createModalRef = useRef<ModalRef>();
  const joinModalRef = useRef<ModalRef>();

  const ongoingMeetingsRequest = useApiRequest<Meeting[]>();
  const userMeetingsRequest = useApiRequest<Meeting[]>();

  useEffect(() => {
    ongoingMeetingsRequest.makeRequest(apiClient.get('meetings/ongoing')).subscribe();
    userMeetingsRequest.makeRequest(apiClient.get('meetings/meetings')).subscribe();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate(Page.SignIn);
  };

  const actions = [
    {
      icon: 'material-symbols:video-call',
      title: 'Create meeting',
      clickHandler: () => createModalRef.current.present(),
    },
    {
      icon: 'ic:baseline-group',
      title: 'Join meeting',
      clickHandler: () => joinModalRef.current.present(),
    },
  ];

  return {
    user,
    handleLogout,
    actions,
    createModalRef,
    joinModalRef,
    ongoingMeetings: ongoingMeetingsRequest.data,
    userMeetings: userMeetingsRequest.data,
  };
}
