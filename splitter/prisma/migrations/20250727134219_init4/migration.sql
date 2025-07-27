/*
  Warnings:

  - You are about to drop the column `catagoery` on the `expenses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "catagoery",
ADD COLUMN     "catagory" TEXT NOT NULL DEFAULT 'Other';
