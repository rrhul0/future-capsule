-- DropForeignKey
ALTER TABLE "user_recipient_service" DROP CONSTRAINT "user_recipient_service_userId_fkey";

-- AddForeignKey
ALTER TABLE "user_recipient_service" ADD CONSTRAINT "user_recipient_service_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
