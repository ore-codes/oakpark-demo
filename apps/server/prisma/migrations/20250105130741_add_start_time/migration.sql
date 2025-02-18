-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN "startTime" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MeetingParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "meetingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinTime" DATETIME NOT NULL,
    "durationInSecs" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "MeetingParticipant_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MeetingParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MeetingParticipant" ("durationInSecs", "id", "joinTime", "meetingId", "userId") SELECT "durationInSecs", "id", "joinTime", "meetingId", "userId" FROM "MeetingParticipant";
DROP TABLE "MeetingParticipant";
ALTER TABLE "new_MeetingParticipant" RENAME TO "MeetingParticipant";
CREATE UNIQUE INDEX "MeetingParticipant_userId_meetingId_key" ON "MeetingParticipant"("userId", "meetingId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
