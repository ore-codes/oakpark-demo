import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/axios.ts';
import { useApiRequest } from '@/lib/api/useApiRequest.ts';
import { Meeting } from '@/lib/common.types.ts';
import { ModalRef } from '@/components/Modal.tsx';
import { useRef } from 'react';

export default function useMeetingHistory() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const meetingsRequest = useApiRequest<Meeting[]>();
  const attendanceModalRef = useRef<ModalRef>();

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = () => {
    meetingsRequest.makeRequest(apiClient.get('meetings/created')).subscribe();
  };

  const viewAttendance = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    attendanceModalRef.current?.present();
  };

  return {
    meetings: meetingsRequest.data || [],
    isLoading: meetingsRequest.loading,
    errors: meetingsRequest.errors,
    fetchMeetings,
    viewAttendance,
    selectedMeeting,
    attendanceModalRef,
  };
}
