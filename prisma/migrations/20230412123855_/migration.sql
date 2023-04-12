/*
  Warnings:

  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mobile]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone",
ADD COLUMN     "mobile" VARCHAR(255) NOT NULL DEFAULT '09152622703';

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");
