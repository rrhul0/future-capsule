-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "userRecipientServiceId" TEXT;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userRecipientServiceId_fkey" FOREIGN KEY ("userRecipientServiceId") REFERENCES "user_recipient_service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
