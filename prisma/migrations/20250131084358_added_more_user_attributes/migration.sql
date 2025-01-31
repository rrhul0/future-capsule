-- AlterTable
ALTER TABLE "users" ADD COLUMN     "addToContactWhenAllowedToSendCapsules" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "automaticallyAcceptCapsuleFromContacts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "automaticallyAcceptCapsuleFromNonContacts" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "automaticallyAddContactsWhenTheySentCapsule" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "maxCapsuleDelay" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "minCapsuleDelay" INTEGER NOT NULL DEFAULT 1440,
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "timezone" TEXT;
