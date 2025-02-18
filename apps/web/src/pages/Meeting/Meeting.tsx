import '@livekit/components-styles';

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AppLogo from '@/components/AppLogo/AppLogo.tsx';
import { Page } from '@/constants/pages.ts';
import { apiClient } from '@/lib/api/axios.ts';
import { useApiRequest } from '@/lib/api/useApiRequest.ts';
import { authService } from '@/lib/auth/AuthService.ts';
import { Env } from '@/lib/config.ts';
import useRxState from '@/lib/storage/useRxState.ts';
import { formatMeetingCode } from '@/lib/utils.ts';

import { JoinMeetingRes } from './Meeting.types.ts';

function Meeting() {
  const { code } = useParams<{ code: string }>();
  const [meeting, setMeeting] = useState<JoinMeetingRes['meeting']>();
  const [token, setToken] = useState<string>();
  const user = useRxState(authService.userStorage.data$);
  const room = useMemo(() => new Room(), []);
  const apiRequest = useApiRequest<JoinMeetingRes>();
  const navigate = useNavigate();

  const mounted = () => {
    apiRequest.makeRequest(apiClient.put('meetings/join', { code })).subscribe(async (res) => {
      if (res) {
        setToken(res.token);
        setMeeting(res.meeting);
      }
    });
  };
  useEffect(mounted, []);

  const leaveRoom = async () => {
    navigate(Page.Dashboard);
    apiRequest.makeRequest(apiClient.put('meetings/leave', { code }));
  };

  if (!meeting) return;

  return (
    <div className="flex">
      <div className="hidden basis-[30rem] space-y-4 bg-primary px-4 py-8 text-text lg:block">
        <AppLogo className="!text-2xl !text-text" />
        <div className="flex flex-col gap-2 rounded-xl bg-light/40 px-2 py-4">
          <h1 className="text-2xl font-bold">{meeting.title}</h1>
          <h2 className="font-semibold">{formatMeetingCode(meeting.code)}</h2>
          <p>{meeting.description}</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-light/40 px-2 py-4">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURI(user?.username)}&background=292D32&color=fff&size=128`}
            alt="Profile image"
            className="size-10 rounded-full"
          />
          <div>
            <div className="font-bold">{user?.username}</div>
            <div className="text-sm text-dark">{user?.email}</div>
          </div>
        </div>
      </div>
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
