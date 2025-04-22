import { FC, useEffect } from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';

import Button from '@/components/Button/Button.tsx';
import Modal from '@/components/Modal.tsx';
import AppLogo from '@/components/AppLogo/AppLogo.tsx';
import useMeetingHistory from './useMeetingHistory.ts';

const MeetingHistory: FC = () => {
  const h = useMeetingHistory();

  useEffect(() => {
    h.fetchMeetings();
  }, []);

  return (
    <motion.div
      className="flex min-h-screen flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div className="border-b-2 px-8 py-4">
        <AppLogo className="!text-base" />
      </motion.div>

      <div className="flex-1 p-8">
        <h1 className="mb-8 text-2xl font-bold">Meeting History</h1>
        
        {h.isLoading ? (
          <div className="text-center">Loading...</div>
        ) : h.meetings.length === 0 ? (
          <div className="text-center text-gray-500">No meetings found</div>
        ) : (
          <div className="grid gap-4">
            {h.meetings.map((meeting) => (
              <motion.div
                key={meeting.id}
                className="rounded-lg border p-4 hover:border-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{meeting.title}</h3>
                    <p className="text-sm text-gray-500">
                        Created on {dayjs(meeting.createdAt).format('DD/MM/YYYY HH:mm')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Participants: {meeting.participants.length}
                    </p>
                  </div>
                  <Button
                    variant="subtle"
                    onClick={() => h.viewSubmissions(meeting)}
                  >
                    <Icon icon="mdi:file-document-outline" className="mr-2 size-5" />
                    View Submissions
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal ref={h.submissionsModalRef}>
        {h.selectedMeeting && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              Submissions for {h.selectedMeeting.title}
            </h2>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto">
              {h.submissions.length === 0 ? (
                <p className="text-center text-gray-500">No submissions yet</p>
              ) : (
                h.submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{submission.user.username}</p>
                        <p className="text-sm text-gray-500">{submission.user.email}</p>
                        <p className="text-sm text-gray-500">
                          Submitted on {dayjs(submission.createdAt).format('DD/MM/YYYY HH:mm')}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => window.open(submission.fileUrl, '_blank')}
                      >
                        <Icon icon="mdi:download" className="mr-2 size-5" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default MeetingHistory;
