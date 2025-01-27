-- CreateEnum
CREATE TYPE "CapsuleSharingAccess" AS ENUM ('ANYONE_WITH_LINK', 'SPECIFIC_USERS', 'NO_ONE');

-- AlterTable
ALTER TABLE "capsules" ADD COLUMN     "sharingAccess" "CapsuleSharingAccess" NOT NULL DEFAULT 'NO_ONE';
