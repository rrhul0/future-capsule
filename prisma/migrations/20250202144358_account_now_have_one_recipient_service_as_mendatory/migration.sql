/*
  Warnings:

  - Made the column `userRecipientServiceId` on table `accounts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userRecipientServiceId_fkey";

-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "userRecipientServiceId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userRecipientServiceId_fkey" FOREIGN KEY ("userRecipientServiceId") REFERENCES "user_recipient_service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
