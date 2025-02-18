import 'react-calendar/dist/Calendar.css'; // Base calendar styles

import { FC, useState } from 'react';
import Calendar from 'react-calendar';

const UserCalendar: FC = () => {
  // Define scheduled dates
  const [scheduledDates] = useState([
    new Date(2025, 0, 2), // Example dates
    new Date(2025, 0, 5),
    new Date(2025, 0, 15),
  ]);

  // Function to check if a date is scheduled
  const isScheduled = (date: Date) =>
    scheduledDates.some(
      (scheduledDate) =>
        date.getFullYear() === scheduledDate.getFullYear() &&
        date.getMonth() === scheduledDate.getMonth() &&
        date.getDate() === scheduledDate.getDate()
    );

  // Tile content to highlight scheduled days
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && isScheduled(date)) {
      return <div className="mx-auto h-2 w-2 rounded-full bg-primary" />;
    }
    return null;
  };

  return (
    <div className="py-4">
      <h2 className="mb-4 font-semibold">Your Calendar</h2>
      <Calendar
        tileClassName={({ date, view }) =>
          view === 'month' && isScheduled(date) ? 'rounded-lg border shadow-sm' : 'rounded-lg'
        }
        tileContent={tileContent}
        className="overflow-hidden rounded-lg"
      />
    </div>
  );
};

export default UserCalendar;
