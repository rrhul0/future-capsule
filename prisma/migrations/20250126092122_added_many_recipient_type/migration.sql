/*
  Warnings:

  - You are about to drop the column `recipientEmails` on the `capsules` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RecepientServiceType" AS ENUM ('EMAIL', 'WHATSAPP', 'TELEGRAM');

-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "capsules" DROP COLUMN "recipientEmails";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email",
DROP COLUMN "emailVerified",
ADD COLUMN     "userName" TEXT;

-- CreateTable
CREATE TABLE "user_recipient_services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "RecepientServiceType" NOT NULL,
    "serviceValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "capsuleRecipientServicesCapsuleId" TEXT,

    CONSTRAINT "user_recipient_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capsule_recipients" (
    "capsuleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capsule_recipients_pkey" PRIMARY KEY ("capsuleId","userId")
);

-- CreateTable
CREATE TABLE "_UserSharedCapsules" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserSharedCapsules_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_recipient_services_userId_type_serviceValue_key" ON "user_recipient_services"("userId", "type", "serviceValue");

-- CreateIndex
CREATE INDEX "_UserSharedCapsules_B_index" ON "_UserSharedCapsules"("B");

-- AddForeignKey
ALTER TABLE "user_recipient_services" ADD CONSTRAINT "user_recipient_services_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_recipient_services" ADD CONSTRAINT "user_recipient_services_capsuleRecipientServicesCapsuleId__fkey" FOREIGN KEY ("capsuleRecipientServicesCapsuleId", "userId") REFERENCES "capsule_recipients"("capsuleId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSharedCapsules" ADD CONSTRAINT "_UserSharedCapsules_A_fkey" FOREIGN KEY ("A") REFERENCES "capsules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSharedCapsules" ADD CONSTRAINT "_UserSharedCapsules_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
