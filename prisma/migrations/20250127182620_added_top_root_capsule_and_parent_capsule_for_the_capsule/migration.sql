/*
  Warnings:

  - You are about to drop the column `originalCapsuleId` on the `capsules` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "capsules" DROP CONSTRAINT "capsules_originalCapsuleId_fkey";

-- AlterTable
ALTER TABLE "capsules" DROP COLUMN "originalCapsuleId",
ADD COLUMN     "parentCapsuleId" TEXT,
ADD COLUMN     "rootCapsuleId" TEXT;

-- AddForeignKey
ALTER TABLE "capsules" ADD CONSTRAINT "capsules_parentCapsuleId_fkey" FOREIGN KEY ("parentCapsuleId") REFERENCES "capsules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capsules" ADD CONSTRAINT "capsules_rootCapsuleId_fkey" FOREIGN KEY ("rootCapsuleId") REFERENCES "capsules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
