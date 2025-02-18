import { RemoteTrackPublication } from 'livekit-client';

import { Meeting, Participant } from '@/lib/common.types.ts';

export type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

export type JoinMeetingRes = {
  participant: Omit<Participant, 'user'>;
  token: string;
  meeting: Meeting;
};
