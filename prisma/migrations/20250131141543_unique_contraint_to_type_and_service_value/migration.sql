/*
  Warnings:

  - A unique constraint covering the columns `[type,serviceValue]` on the table `user_recipient_service` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_recipient_service_userId_type_serviceValue_key";

-- CreateIndex
CREATE UNIQUE INDEX "user_recipient_service_type_serviceValue_key" ON "user_recipient_service"("type", "serviceValue");
