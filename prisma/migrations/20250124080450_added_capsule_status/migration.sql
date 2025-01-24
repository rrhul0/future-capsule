-- CreateEnum
CREATE TYPE "CapsuleStatus" AS ENUM ('SENT', 'QUEUED', 'PENDING');

-- CreateTable
CREATE TABLE "capsules" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "CapsuleStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledTo" TIMESTAMP(3) NOT NULL,
    "recipientEmails" TEXT[],
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capsules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "capsules" ADD CONSTRAINT "capsules_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
