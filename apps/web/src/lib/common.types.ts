export type Meeting = {
  id: string;
  title: string;
  code: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  durationInSecs: number;
  description: any;
  participants: Participant[];
};

export type Participant = {
  id: string;
  meetingId: string;
  userId: string;
  joinTime: string;
  durationInSecs: number;
  isActive: boolean;
  user: {
    username: string;
  };
};
