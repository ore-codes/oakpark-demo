import { useState } from 'react';
import { apiClient } from '@/lib/api/axios.ts';
import { useApiRequest } from '@/lib/api/useApiRequest.ts';
import { Meeting } from '@/lib/common.types.ts';
import { ModalRef } from '@/components/Modal.tsx';
import { useRef } from 'react';

export type MeetingSubmission = {
  id: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  user: {
    username: string;
    email: string;
  };
};

export default function useMeetingHistory() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [submissions, setSubmissions] = useState<MeetingSubmission[]>([]);
  const meetingsRequest = useApiRequest<Meeting[]>();
  const submissionsRequest = useApiRequest<MeetingSubmission[]>();
  const submissionsModalRef = useRef<ModalRef>();

  const fetchMeetings = () => {
    meetingsRequest.makeRequest(apiClient.get('meetings/created')).subscribe();
  };

  const viewSubmissions = async (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    submissionsRequest
      .makeRequest(apiClient.get(`submissions/meeting/${meeting.id}`))
      .subscribe((data) => {
        if (data) {
          setSubmissions(data);
          submissionsModalRef.current?.present();
        }
      });
  };

  return {
    meetings: meetingsRequest.data || [],
    isLoading: meetingsRequest.loading,
    errors: meetingsRequest.errors,
    fetchMeetings,
    viewSubmissions,
    selectedMeeting,
    submissions,
    submissionsModalRef,
  };
}
