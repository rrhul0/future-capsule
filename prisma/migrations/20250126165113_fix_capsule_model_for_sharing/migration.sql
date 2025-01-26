/*
  Warnings:

  - You are about to drop the `_UserSharedCapsules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `capsule_recipients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_recipient_services` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerId` to the `capsules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "CapsuleStatus" ADD VALUE 'DISABLED';

-- DropForeignKey
ALTER TABLE "_UserSharedCapsules" DROP CONSTRAINT "_UserSharedCapsules_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserSharedCapsules" DROP CONSTRAINT "_UserSharedCapsules_B_fkey";

-- DropForeignKey
ALTER TABLE "user_recipient_services" DROP CONSTRAINT "user_recipient_services_capsuleRecipientServicesCapsuleId__fkey";

-- DropForeignKey
ALTER TABLE "user_recipient_services" DROP CONSTRAINT "user_recipient_services_userId_fkey";

-- AlterTable
ALTER TABLE "capsules" ADD COLUMN     "accepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "sharedById" TEXT;

-- DropTable
DROP TABLE "_UserSharedCapsules";

-- DropTable
DROP TABLE "capsule_recipients";

-- DropTable
DROP TABLE "user_recipient_services";

-- CreateTable
CREATE TABLE "user_recipient_service" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "type" "RecepientServiceType" NOT NULL,
    "serviceValue" TEXT NOT NULL,
    "defaultEnabled" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_recipient_service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CapsuleRecipientService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CapsuleRecipientService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_recipient_service_userId_type_serviceValue_key" ON "user_recipient_service"("userId", "type", "serviceValue");

-- CreateIndex
CREATE INDEX "_CapsuleRecipientService_B_index" ON "_CapsuleRecipientService"("B");

-- AddForeignKey
ALTER TABLE "user_recipient_service" ADD CONSTRAINT "user_recipient_service_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capsules" ADD CONSTRAINT "capsules_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capsules" ADD CONSTRAINT "capsules_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CapsuleRecipientService" ADD CONSTRAINT "_CapsuleRecipientService_A_fkey" FOREIGN KEY ("A") REFERENCES "capsules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CapsuleRecipientService" ADD CONSTRAINT "_CapsuleRecipientService_B_fkey" FOREIGN KEY ("B") REFERENCES "user_recipient_service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
