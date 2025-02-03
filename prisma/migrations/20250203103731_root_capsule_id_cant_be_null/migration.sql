/*
  Warnings:

  - Made the column `rootCapsuleId` on table `capsules` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "capsules" DROP CONSTRAINT "capsules_rootCapsuleId_fkey";

-- AlterTable
ALTER TABLE "capsules" ALTER COLUMN "rootCapsuleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "capsules" ADD CONSTRAINT "capsules_rootCapsuleId_fkey" FOREIGN KEY ("rootCapsuleId") REFERENCES "capsules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
