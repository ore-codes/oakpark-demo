import '@livekit/components-styles';

import {
  ControlBar, GridLayout, LiveKitRoom, ParticipantTile, RoomAudioRenderer, useTracks
} from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
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

function Meeting() {
  const { code } = useParams<{ code: string }>();
  const [meeting, setMeeting] = useState<JoinMeetingRes['meeting']>();
  const [token, setToken] = useState<string>();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const room = useMemo(() => new Room(), []);
  const joinApiRequest = useApiRequest<JoinMeetingRes>();
  const navigate = useNavigate();

  const toggleHeader = () => {
    setIsHeaderVisible(!isHeaderVisible);
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
  };
  useEffect(mounted, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
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

  if (!meeting) return null;

  return (
    <div className="relative" onClick={toggleHeader}>
      <AnimatePresence>
        {isHeaderVisible && (
          <motion.div
            className="z-50 absolute top-0 left-0 w-full flex justify-between items-center gap-2 rounded-xl bg-light/90 px-4 py-4"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <AppLogo className="!text-base !text-primary" />
            <h1 className="text-xl font-semibold text-secondary">{meeting.title}</h1>
            <div className="inline-flex items-center gap-1 sm:gap-2 bg-primary/50 text-xs sm:text-sm font-inter-700 text-gray-700 rounded-xl px-2 font-bold sm:px-5 py-1 sm:py-3">
              <Icon icon="solar:clock-circle-outline" className="size-5" />
              {formatTime(elapsedTime)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
        <MyVideoConference />
        <RoomAudioRenderer />
        <ControlBar />
      </LiveKitRoom>
    </div>
  );
}

export default Meeting;

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <ParticipantTile />
    </GridLayout>
  );
}