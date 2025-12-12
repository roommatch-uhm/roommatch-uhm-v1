-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "dealbreakers" TEXT[] DEFAULT ARRAY[]::TEXT[];
