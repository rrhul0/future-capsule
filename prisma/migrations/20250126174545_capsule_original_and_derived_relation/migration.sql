/*
  Warnings:

  - You are about to drop the column `sharedById` on the `capsules` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "capsules" DROP CONSTRAINT "capsules_sharedById_fkey";

-- AlterTable
ALTER TABLE "capsules" DROP COLUMN "sharedById",
ADD COLUMN     "originalCapsuleId" TEXT;

-- AddForeignKey
ALTER TABLE "capsules" ADD CONSTRAINT "capsules_originalCapsuleId_fkey" FOREIGN KEY ("originalCapsuleId") REFERENCES "capsules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
