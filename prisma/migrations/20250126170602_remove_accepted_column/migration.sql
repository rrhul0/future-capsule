/*
  Warnings:

  - You are about to drop the column `accepted` on the `capsules` table. All the data in the column will be lost.
  - You are about to drop the column `acceptedAt` on the `capsules` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "CapsuleStatus" ADD VALUE 'NOT_ACCEPTED';

-- AlterTable
ALTER TABLE "capsules" DROP COLUMN "accepted",
DROP COLUMN "acceptedAt",
ALTER COLUMN "status" SET DEFAULT 'PENDING';
