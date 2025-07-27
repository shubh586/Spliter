/*
  Warnings:

  - You are about to drop the column `catagory` on the `expenses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "catagory",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Other';
