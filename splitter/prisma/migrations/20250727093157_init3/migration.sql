/*
  Warnings:

  - Added the required column `createdBy` to the `expenses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SplitType" AS ENUM ('equal', 'percentage', 'exact');

-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "catagoery" TEXT NOT NULL DEFAULT 'Other',
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "splits" ADD COLUMN     "splitType" "SplitType" NOT NULL DEFAULT 'equal';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "imageUrl" TEXT;

-- CreateIndex
CREATE INDEX "user_name_idx" ON "user"("name");
