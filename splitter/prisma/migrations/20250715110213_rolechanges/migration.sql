-- CreateEnum
CREATE TYPE "Role" AS ENUM ('member', 'admin');

-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_groupId_fkey";

-- AlterTable
ALTER TABLE "expenses" ALTER COLUMN "groupId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "groupmembers" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'member';

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
