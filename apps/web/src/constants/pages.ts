export const Page = {
  SignIn: '/',
  SignUp: '/sign-up',
  Dashboard: '/dashboard',
  Meeting: (code: string) => `/meeting/${code}`,
  MeetingHistory: '/meeting-history',
};
