/*
  Warnings:

  - You are about to drop the column `imageKey` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `imageSource` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "imageKey",
DROP COLUMN "imageSource",
DROP COLUMN "imageUrl";
