-- CreateEnum
CREATE TYPE "accStatus" AS ENUM ('LOGGED_IN', 'LOGGED_OUT', 'SUSPENDED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountStatus" "accStatus" NOT NULL DEFAULT 'LOGGED_OUT';
