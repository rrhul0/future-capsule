-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userRecipientServiceId_fkey";

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userRecipientServiceId_fkey" FOREIGN KEY ("userRecipientServiceId") REFERENCES "user_recipient_service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
