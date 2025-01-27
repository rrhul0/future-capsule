/*
  Warnings:

  - You are about to drop the column `authorId` on the `capsules` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "capsules" DROP CONSTRAINT "capsules_authorId_fkey";

-- AlterTable
ALTER TABLE "capsules" DROP COLUMN "authorId";
