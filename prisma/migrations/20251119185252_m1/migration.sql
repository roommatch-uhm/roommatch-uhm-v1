-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "clean" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "social" TEXT NOT NULL,
    "study" TEXT NOT NULL,
    "sleep" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);
