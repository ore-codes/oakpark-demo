export const Page = {
  SignUp: '/',
  SignIn: '/sign-in',
  Dashboard: '/dashboard',
  Meeting: (code: string) => `/meeting/${code}`,
  MeetingHistory: '/meeting-history',
};
