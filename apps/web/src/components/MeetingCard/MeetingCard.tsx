import { FC, useRef, useState } from "react";
import { Meeting } from "@/lib/common.types";
import { useNavigate } from "react-router-dom";
import { authService } from "@/lib/auth/AuthService";
import useRxState from "@/lib/storage/useRxState";
import { Page } from "@/constants/pages";
import { motion } from "motion/react";
import Modal, { ModalRef } from "../Modal";
import { AttendanceList } from "@/pages/MeetingHistory/MeetingHistory";
import Button from "../Button/Button";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { useApiRequest } from "@/lib/api/useApiRequest";
import { apiClient } from "@/lib/api/axios";

export type MeetingSubmission = {
  id: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  user: {
    username: string;
    email: string;
  };
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, translateX: 20 },
  visible: { opacity: 1, scale: 1, translateX: 0 },
};

const MeetingCard: FC<{ meeting: Meeting, index: number }> = ({ meeting, index }) => {
  const navigate = useNavigate();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const attendanceModalRef = useRef<ModalRef>();
  const submissionsModalRef = useRef<ModalRef>();
  const user = useRxState(authService.userStorage.data$);

  const [submissions, setSubmissions] = useState<MeetingSubmission[]>([]);
  const submissionsRequest = useApiRequest<MeetingSubmission[]>();

  const viewAttendance = () => {
    setSelectedMeeting(meeting);
    attendanceModalRef.current?.present();
  };

  const viewSubmissions = async () => {
    setSelectedMeeting(meeting);
    submissionsRequest
      .makeRequest(apiClient.get(`submissions/meeting/${meeting.id}`))
      .subscribe((data) => {
        if (data) {
          setSubmissions(data);
          submissionsModalRef.current?.present();
        }
      });
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
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-between lg:gap-4 gap-2">
            {user?.id === meeting.userId && <Button
              variant="subtle"
              onClick={() => viewAttendance()}
              className="w-full"
            >
              <Icon icon="mdi:account-group" className="mr-2 size-5" />
              View Attendance
            </Button>}
            <Button
              variant="subtle"
              onClick={() => viewSubmissions()}
            >
              <Icon icon="mdi:file-document-outline" className="mr-2 size-5" />
              Attachments
            </Button>
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
      <Modal ref={submissionsModalRef}>
        {selectedMeeting && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              Attachments for {selectedMeeting.title}
            </h2>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto">
              {submissions.length === 0 ? (
                <p className="text-center text-gray-500">No attachments yet</p>
              ) : (
                submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{submission.user.username}</p>
                        <p className="text-sm text-gray-500">{submission.user.email}</p>
                        <p className="text-sm text-gray-500">
                          Submitted on {dayjs(submission.createdAt).format('DD/MM/YYYY HH:mm')}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => window.open(submission.fileUrl, '_blank')}
                      >
                        <Icon icon="mdi:download" className="mr-2 size-5" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default MeetingCard;
