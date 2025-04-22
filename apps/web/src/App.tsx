import '@fontsource-variable/inter';
import '@/index.css';

import { MotionConfig } from 'motion/react';
import { SnackbarProvider } from 'notistack';
import { FC } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import AppLogo from '@/components/AppLogo/AppLogo.tsx';
import { Page } from '@/constants/pages.ts';
import { authService } from '@/lib/auth/AuthService.ts';
import useRxState from '@/lib/storage/useRxState.ts';
import Dashboard from '@/pages/Dashboard/Dashboard.tsx';
import Meeting from '@/pages/Meeting/Meeting.tsx';
import SignIn from '@/pages/SignIn.tsx';
import SignUp from '@/pages/SignUp.tsx';
import MeetingHistory from '@/pages/MeetingHistory/MeetingHistory.tsx';

const App: FC = () => {
  const isAuthenticated = useRxState(authService.isAuthenticated$);

  if (isAuthenticated === undefined) {
    return (
      <main className="grid h-screen w-screen place-items-center">
        <AppLogo className="animate-bounce !text-5xl" />
      </main>
    );
  }

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to={Page.SignIn} />;
  };

  const OnboardingRoute = ({ element }) => {
    return isAuthenticated ? <Navigate to={Page.Dashboard} /> : element;
  };

  return (
    <MotionConfig transition={{ duration: 0.5 }}>
      <SnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <Router>
          <Routes>
            <Route index element={<OnboardingRoute element={<SignIn />} />} />
            <Route path={Page.SignUp} element={<SignUp />} />
            <Route path={Page.Dashboard} element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path={Page.Meeting(':code')} element={<ProtectedRoute element={<Meeting />} />} />
            <Route path={Page.MeetingHistory} element={<ProtectedRoute element={<MeetingHistory />} />} />
          </Routes>
        </Router>
      </SnackbarProvider>
    </MotionConfig>
  );
};

export default App;
