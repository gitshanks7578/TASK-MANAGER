-- CreateEnum
CREATE TYPE "role" AS ENUM ('OWNER', 'MEMBER');

-- AlterTable
ALTER TABLE "ProjectMember" ADD COLUMN     "role" "role" NOT NULL DEFAULT 'MEMBER';
