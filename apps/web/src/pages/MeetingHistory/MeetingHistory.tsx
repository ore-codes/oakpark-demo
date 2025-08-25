import { FC } from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button.tsx';
import Modal from '@/components/Modal.tsx';
import AppLogo from '@/components/AppLogo/AppLogo.tsx';
import useMeetingHistory from './useMeetingHistory.ts';
import { Page } from '@/constants/pages.ts';
import { Meeting } from '@/lib/common.types.ts';

const MeetingHistory: FC = () => {
  const h = useMeetingHistory();
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex min-h-screen flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div className="border-b-2 px-8 py-4">
        <div className="flex items-center justify-between">
          <AppLogo className="!text-base" />
        </div>
      </motion.div>

      <div className="flex-1 p-8">

        <div className="flex items-center gap-4">
          <Button
            variant="subtle"
            onClick={() => navigate(Page.Dashboard)}
            className="flex items-center gap-2"
          >
            <Icon icon="mdi:arrow-left" className="size-5" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Meeting History</h1>
        </div>

        {h.isLoading ? (
          <div className="text-center">Loading...</div>
        ) : h.meetings.length === 0 ? (
          <div className="text-center text-gray-500">No meetings found</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 container mx-auto px-4">
            {h.meetings.map((meeting, index) => (
              <motion.div
                key={meeting.id}
                className="overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`https://picsum.photos/600/400/?blur&random=${meeting.id}`}
                    alt={`Meeting: ${meeting.title}`}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-white">{meeting.title}</h3>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-4 space-y-2">
                    <p className="text-sm text-gray-500">
                      Created on {dayjs(meeting.createdAt).format('DD/MM/YYYY HH:mm')}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Icon icon="mdi:account-group" className="size-4" />
                      <span>{meeting.participants.length} participants</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <Button
                      variant="subtle"
                      onClick={() => h.viewAttendance(meeting)}
                      className="w-full"
                    >
                      <Icon icon="mdi:account-group" className="mr-2 size-5" />
                      View Attendance
                    </Button>
                    <Button
                      onClick={() => navigate(Page.Meeting(meeting.code))}
                      className="w-full"
                    >
                      <Icon icon="mdi:video-account" className="mr-2 size-5" />
                      Join again
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal ref={h.attendanceModalRef}>
        <AttendanceList meeting={h.selectedMeeting} />
      </Modal>
    </motion.div>
  );
};

export default MeetingHistory;

export const AttendanceList: FC<{ meeting: Meeting }> = ({ meeting }) => {
  const calculateAttendancePercentage = (participantDuration: number, hostDuration: number): number => {
    if (hostDuration === 0) return 0;
    return Math.round((Math.min(participantDuration, hostDuration) / hostDuration) * 100);
  };

  const getHostParticipant = (meeting: any) => {
    return meeting.participants.find((participant: any) => participant.userId === meeting.userId);
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const hostParticipant = getHostParticipant(meeting);
  const hostDuration = hostParticipant?.durationInSecs || 0;

  if (!meeting) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        Attendance for {meeting.title}
      </h2>
      <div className="mb-4 rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Host Duration:</strong> {formatDuration(hostDuration)}
        </p>
      </div>
      <div className="max-h-[60vh] space-y-3 overflow-y-auto">
        {meeting.participants.length === 0 ? (
          <p className="text-center text-gray-500">No participants yet</p>
        ) : (
          meeting.participants.map((participant) => {
            const attendancePercentage = calculateAttendancePercentage(
              participant.durationInSecs,
              hostDuration
            );
            const isLowAttendance = attendancePercentage < 50;
            const isHost = participant.userId === meeting.userId;

            return (
              <motion.div
                key={participant.id}
                className={`rounded-lg border p-4 hover:shadow-md transition-shadow ${isHost ? 'border-blue-300 bg-blue-50' : ''
                  }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isHost ? 'bg-blue-100' : 'bg-primary/10'
                        }`}>
                        <Icon
                          icon={isHost ? "mdi:crown" : "mdi:account"}
                          className={`size-5 ${isHost ? 'text-blue-600' : 'text-primary'}`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {participant.user.username}
                          {isHost && <span className="ml-2 text-xs text-blue-600">(Host)</span>}
                        </p>
                        <p className="text-sm text-gray-500">
                          Duration: {formatDuration(participant.durationInSecs)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${isLowAttendance ? 'text-red-600' : 'text-gray-900'}`}>
                      {attendancePercentage}%
                    </div>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${isLowAttendance ? 'bg-red-500' : 'bg-green-500'
                          }`}
                        style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
