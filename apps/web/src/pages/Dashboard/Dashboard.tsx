import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import { FC, useRef, useState } from 'react';

import ActionButton from '@/chunks/dashboard/ActionButton.tsx';
import CreateMeeting from '@/chunks/dashboard/CreateMeeting/CreateMeeting.tsx';
import JoinMeeting from '@/chunks/dashboard/JoinMeeting/JoinMeeting.tsx';
import AppLogo from '@/components/AppLogo/AppLogo.tsx';
import Button from '@/components/Button/Button.tsx';
import Modal, { ModalRef } from '@/components/Modal.tsx';
import useDashboard from '@/pages/Dashboard/useDashboard.ts';
import dayjs from 'dayjs';
import { Page } from '@/constants/pages';
import { useNavigate } from 'react-router-dom';
import { Meeting } from '@/lib/common.types';
import { AttendanceList } from '../MeetingHistory/MeetingHistory';
import useRxState from '@/lib/storage/useRxState';
import { authService } from '@/lib/auth/AuthService';

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const Dashboard: FC = () => {
  const h = useDashboard();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <motion.div
      className="flex min-h-screen flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header with user profile */}
      <motion.div
        className="border-b-2 px-4 sm:px-8 py-4 flex items-center justify-between"
        variants={itemVariants}
      >
        <AppLogo className="!text-base" />

        {/* Desktop User Profile */}
        <div className="hidden md:flex items-center gap-4">
          <motion.div
            className="flex items-center gap-3 rounded-xl bg-light px-3 py-2"
            variants={itemVariants}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURI(h.user?.username)}&background=4CAF50&color=fff&size=128`}
              alt="Profile image"
              className="size-8 rounded-full"
            />
            <div className="hidden sm:block">
              <div className="font-bold text-sm">{h.user?.username}</div>
              <div className="text-xs text-placeholder">{h.user?.email}</div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button variant="subtle" size="sm" onClick={h.handleLogout}>
              <Icon icon="solar:logout-2-outline" className="size-4" />
              <span className="hidden sm:inline ml-1">Sign out</span>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Profile Menu */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 rounded-xl bg-light px-2 py-2"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURI(h.user?.username)}&background=4CAF50&color=fff&size=128`}
              alt="Profile image"
              className="size-8 rounded-full"
            />
            <Icon
              icon={isProfileMenuOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
              className="size-4"
            />
          </button>

          {/* Mobile Dropdown Menu */}
          {isProfileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURI(h.user?.username)}&background=4CAF50&color=fff&size=128`}
                    alt="Profile image"
                    className="size-10 rounded-full"
                  />
                  <div>
                    <div className="font-bold">{h.user?.username}</div>
                    <div className="text-sm text-placeholder">{h.user?.email}</div>
                  </div>
                </div>
                <Button
                  variant="subtle"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => {
                    h.handleLogout();
                    setIsProfileMenuOpen(false);
                  }}
                >
                  <Icon icon="solar:logout-2-outline" className="size-4 mr-2" />
                  Sign out
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Main content - now takes full width */}
      <motion.main
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container px-4 mx-auto">
          <div className="flex flex-row gap-4 mt-4 justify-end">
            {h.actions.map((action, index) => (
              <motion.div key={index} variants={itemVariants}>
                <ActionButton
                  icon={action.icon}
                  title={action.title}
                  onClick={action.clickHandler}
                />
              </motion.div>
            ))}
          </div>
          <div className="bg-fade-bg flex flex-row items-center mt-4 border border-gray-200 rounded-2xl p-3 md:p-4 w-full gap-3">
            <Icon icon="bx:search" className="size-8 text-gray-400" />
            <input
              type="text"
              placeholder="Enter a Session title"
              className="w-full focus:outline-none"
            />
          </div>
          <div className="h-auto md:h-[287px] container mx-auto md:bg-gradient-to-r bg-gradient-to-b from-[#5856D6] to-primary rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row my-6">
            <div className="w-full md:w-3/4 p-6 md:p-0">
              <h1 className="text-2xl md:text-[40px] text-white font-bold mb-3 md:pl-[60px] md:mt-[25px]">
                Fast, reliable and secure conferencing
              </h1>
              <p className="text-base text-white opacity-90 w-full md:w-[547px] md:h-[75px] md:pl-[60px] md:mt-[25px]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat.
              </p>
            </div>
            <div className="w-full md:w-1/4 flex justify-center items-center p-4 md:p-0">
              <img
                src="/images/rightreal.png"
                className="object-contain h-[150px] md:h-full"
                alt="Conference monitor"
              />
            </div>
          </div>
          {h.ongoingMeetings?.length > 0 && <h1 className="text-2xl font-bold mb-4">Ongoing Meetings</h1>}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {h.ongoingMeetings?.map((meeting, index) => (
              <MeetingCard key={meeting.id} meeting={meeting} index={index} />
            ))}
          </div>
          {h.userMeetings?.length > 0 && <h1 className="text-2xl font-bold mb-4">Meeting History</h1>}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {h.userMeetings?.map((meeting, index) => (
              <MeetingCard key={meeting.id} meeting={meeting} index={index} />
            ))}
          </div>
        </div>
      </motion.main>

      {/* Click outside to close mobile menu */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}

      <Modal ref={h.createModalRef}>
        <CreateMeeting />
      </Modal>
      <Modal ref={h.joinModalRef}>
        <JoinMeeting />
      </Modal>
    </motion.div>
  );
};

export default Dashboard;

const MeetingCard: FC<{ meeting: Meeting, index: number }> = ({ meeting, index }) => {
  const navigate = useNavigate();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const attendanceModalRef = useRef<ModalRef>();
  const user = useRxState(authService.userStorage.data$);

  const viewAttendance = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    attendanceModalRef.current?.present();
  };

  return (
    <motion.div key={meeting.id} variants={itemVariants}>
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
            {user?.id === meeting.userId && <Button
              variant="subtle"
              onClick={() => viewAttendance(meeting)}
              className="w-full"
            >
              <Icon icon="mdi:account-group" className="mr-2 size-5" />
              View Attendance
            </Button>}
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
      <Modal ref={attendanceModalRef}>
        <AttendanceList meeting={selectedMeeting} />
      </Modal>
    </motion.div>
  );
};