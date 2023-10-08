-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_roomName_fkey";

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_roomName_fkey" FOREIGN KEY ("roomName") REFERENCES "Room"("name") ON DELETE CASCADE ON UPDATE CASCADE;
