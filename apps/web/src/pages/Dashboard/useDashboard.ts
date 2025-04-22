import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { ModalRef } from '@/components/Modal.tsx';
import { Page } from '@/constants/pages.ts';
import { authService } from '@/lib/auth/AuthService.ts';
import useRxState from '@/lib/storage/useRxState.ts';

export default function useDashboard() {
  const navigate = useNavigate();
  const user = useRxState(authService.userStorage.data$);
  const createModalRef = useRef<ModalRef>();
  const joinModalRef = useRef<ModalRef>();

  const handleLogout = async () => {
    await authService.logout();
    navigate(Page.SignIn);
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
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
    { 
      icon: 'mdi:calendar-edit',
      title: 'Schedule meeting'
    },
    {
      icon: 'mdi:history',
      title: 'Meeting history',
      clickHandler: () => navigate(Page.MeetingHistory)
    },
  ];

  return { user, handleLogout, actions, itemVariants, createModalRef, joinModalRef };
}
