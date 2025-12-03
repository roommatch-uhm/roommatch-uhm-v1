/*
  Warnings:

  - You are about to drop the column `image` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "image",
ADD COLUMN     "imageAddedAt" TIMESTAMP(3),
ADD COLUMN     "imageKey" TEXT,
ADD COLUMN     "imageSource" TEXT,
ADD COLUMN     "imageUrl" TEXT;
