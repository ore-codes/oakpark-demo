import '@livekit/components-styles';
import { LiveKitRoom } from '@livekit/components-react';
import { Room } from 'livekit-client';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import AppLogo from '@/components/AppLogo/AppLogo.tsx';
import { Page } from '@/constants/pages.ts';
import { apiClient } from '@/lib/api/axios.ts';
import { useApiRequest } from '@/lib/api/useApiRequest.ts';
import { Env } from '@/lib/config.ts';
import { JoinMeetingRes } from './Meeting.types.ts';
import { Icon } from '@iconify/react';
import { VideoConference } from '@/chunks/meeting/VideoConference/VideoConference.tsx';
import { formatMeetingCode } from '@/lib/utils.ts';
import Modal, { ModalRef } from '@/components/Modal.tsx';
import SubmissionPortal from '@/chunks/meeting/SubmissionPortal/SubmissionPortal.tsx';
import { enqueueSnackbar } from 'notistack';
import Button from '@/components/Button/Button.tsx';
import { Meeting as TMeeting } from '@/lib/common.types.ts';

function Meeting() {
  const { code } = useParams<{ code: string }>();
  const [meeting, setMeeting] = useState<JoinMeetingRes['meeting']>();
  const [token, setToken] = useState<string>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef2 = useRef<NodeJS.Timeout | null>(null);
  const room = useMemo(() => new Room(), []);
  const joinApiRequest = useApiRequest<JoinMeetingRes>();
  const navigate = useNavigate();
  const submitApiRequest = useApiRequest<{ success: boolean }>();
  const submitModalRef = useRef<ModalRef>(null);
  const getMeetingRequest = useApiRequest<TMeeting>();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const mounted = () => {
    joinApiRequest.makeRequest(apiClient.put('meetings/join', { code })).subscribe(async (res) => {
      if (res) {
        setToken(res.token);
        setMeeting(res.meeting);
        setElapsedTime(res.participant.durationInSecs || 0);
        intervalRef.current = setInterval(() => {
          setElapsedTime(prev => prev + 1);
        }, 1000);
      }
    });

    setTimeout(() => {
      intervalRef2.current = setInterval(() => {
        getMeetingRequest.makeRequest(apiClient.get(`meetings/${code}`)).subscribe((data) => {
          if (data) {
            setMeeting(data);
          }
        });
      }, 10000);
    }, 10000);
  };
  useEffect(mounted, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (intervalRef2.current) {
        clearInterval(intervalRef2.current);
      }
    };
  }, []);

  const leaveRoom = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    navigate(Page.Dashboard);
    joinApiRequest.makeRequest(apiClient.put('meetings/leave', { code }));
  };

  const handleSubmit = async (files: File[]) => {
    if (!files.length || !meeting?.id) return;

    const formData = new FormData();
    const file = files[0];
    formData.append('file', file, file.name);

    try {
      submitApiRequest.makeRequest(
        apiClient.post(`submissions/${meeting.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      ).subscribe({
        next: (res) => {
          if (res) {
            enqueueSnackbar('Document(s) attached successfully!', {
              variant: 'success',
              autoHideDuration: 5000,
            });
            submitModalRef.current?.dismiss();
          }
        },
        error: (error) => {
          enqueueSnackbar(error.response?.data?.message || 'Failed to submit document', {
            variant: 'error',
          });
        }
      });
    } catch (error) {
      enqueueSnackbar('Failed to submit document', {
        variant: 'error',
      });
    }
  };

  if (!meeting) return null;

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Sidebar Toggle Button - Fixed position for easy access */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-2 shadow-lg hover:bg-white transition-all duration-200 md:hidden"
        aria-label="Toggle sidebar"
      >
        <Icon icon="solar:sidebar-minimalistic-outline" className="size-5 text-gray-700" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.div
            className="fixed left-0 top-0 h-full bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg z-40 flex flex-col"
            style={{ width: '320px' }}
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <AppLogo className="!text-lg !text-primary" />
                <button
                  onClick={closeSidebar}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
                  aria-label="Close sidebar"
                >
                  <Icon icon="solar:close-circle-outline" className="size-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3">
                <h1 className="text-xl font-semibold text-secondary line-clamp-2">{meeting.title}</h1>

                {/* Timer */}
                <div className="inline-flex items-center gap-2 bg-primary/10 text-sm font-semibold text-gray-700 rounded-lg px-3 py-2">
                  <Icon icon="solar:clock-circle-outline" className="size-5" />
                  <span>{formatTime(elapsedTime)}</span>
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900">Meeting Info</h3>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon icon="solar:calendar-outline" className="size-4" />
                      <span>Code: {formatMeetingCode(meeting.code)}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{meeting.description}</span>
                    </div>
                  </div>
                </div>

                {/* Participants Section */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900">Participants</h3>
                  <div className="text-sm text-gray-600">
                    {meeting.participants && meeting.participants.length > 0 ? (
                      <div className="space-y-2">
                        {meeting.participants.map((participant) => (
                          <div key={participant.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                            <Icon
                              icon="solar:user-outline"
                              className={`size-4 ${participant.isActive ? 'text-green-500' : 'text-gray-400'}`}
                            />
                            <span className="font-medium">{participant.user.username}</span>
                            {participant.isActive && (
                              <span className="ml-auto text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Icon icon="solar:users-group-rounded-outline" className="size-4" />
                        <span>No participants yet</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button variant="subtle" className="w-full" onClick={() => submitModalRef.current?.present()}>
                  <Icon icon="solar:document-check-outline" className="size-5" />
                  Attach a file
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className="h-full transition-all duration-300"
        style={{
          paddingLeft: !isSidebarOpen && window.innerWidth < 768 ? '0px' : '320px'
        }}
      >
        <LiveKitRoom
          connect={Boolean(token && room)}
          room={room}
          video={true}
          audio={true}
          token={token}
          serverUrl={Env.LiveKitUrl}
          data-lk-theme="default"
          style={{ height: '100vh' }}
          onDisconnected={leaveRoom}
          onError={leaveRoom}
        >
          <VideoConference />
        </LiveKitRoom>
        <Modal ref={submitModalRef}>
          <SubmissionPortal
            onSubmit={handleSubmit}
            onCancel={() => submitModalRef.current?.dismiss()}
            isSubmitting={submitApiRequest.loading}
          />
        </Modal>
      </div>
    </div>
  );
}

export default Meeting;