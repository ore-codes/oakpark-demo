import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import { FC } from 'react';

import ActionButton from '@/chunks/dashboard/ActionButton.tsx';
import CreateMeeting from '@/chunks/dashboard/CreateMeeting/CreateMeeting.tsx';
import JoinMeeting from '@/chunks/dashboard/JoinMeeting/JoinMeeting.tsx';
import AppLogo from '@/components/AppLogo/AppLogo.tsx';
import Button from '@/components/Button/Button.tsx';
import Modal from '@/components/Modal.tsx';
import UserCalendar from '@/components/UserCalendar/UserCalendar.tsx';
import useDashboard from '@/pages/Dashboard/useDashboard.ts';

const Dashboard: FC = () => {
  const h = useDashboard();
  return (
    <motion.div
      className="flex min-h-screen flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div className="border-b-2 px-8 py-4" variants={h.itemVariants}>
        <AppLogo className="!text-base" />
      </motion.div>
      <div className="flex flex-1 flex-col lg:flex-row">
        <motion.div
          className="max-w-2/5 flex min-w-[15rem] flex-col border-r-2 px-8 py-4"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.div
            className="flex items-center gap-2 rounded-xl bg-light px-2 py-4"
            variants={h.itemVariants}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURI(h.user?.username)}&background=4CAF50&color=fff&size=128`}
              alt="Profile image"
              className="size-10 rounded-full"
            />
            <div>
              <div className="font-bold">{h.user?.username}</div>
              <div className="text-sm text-placeholder">{h.user?.email}</div>
            </div>
          </motion.div>
          <motion.div className="mt-6 flex-1" variants={h.itemVariants}>
            <UserCalendar />
          </motion.div>
          <motion.div variants={h.itemVariants}>
            <Button variant="subtle" size="sm" className="self-start" onClick={h.handleLogout}>
              <Icon icon="solar:logout-2-outline" className="size-5" />
              Sign out
            </Button>
          </motion.div>
        </motion.div>
        <motion.main
          className="-order-1 grid flex-1 place-items-center lg:order-1"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.div
            className="grid grid-cols-2 gap-16"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            }}
          >
            {h.actions.map((action, index) => (
              <motion.div key={index} variants={h.itemVariants}>
                <ActionButton
                  icon={action.icon}
                  title={action.title}
                  onClick={action.clickHandler}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.main>
      </div>
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
