/*
  Warnings:

  - You are about to drop the column `durationInMin` on the `MeetingParticipant` table. All the data in the column will be lost.
  - Added the required column `durationInSecs` to the `MeetingParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MeetingParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "meetingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinTime" DATETIME NOT NULL,
    "durationInSecs" INTEGER NOT NULL,
    CONSTRAINT "MeetingParticipant_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MeetingParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MeetingParticipant" ("id", "joinTime", "meetingId", "userId") SELECT "id", "joinTime", "meetingId", "userId" FROM "MeetingParticipant";
DROP TABLE "MeetingParticipant";
ALTER TABLE "new_MeetingParticipant" RENAME TO "MeetingParticipant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
