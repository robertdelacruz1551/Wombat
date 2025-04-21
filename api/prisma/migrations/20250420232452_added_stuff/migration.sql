-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "status" TEXT;

-- CreateTable
CREATE TABLE "Map" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "board" JSONB,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Simulations" (
    "id" SERIAL NOT NULL,
    "user" INTEGER NOT NULL,
    "map" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "obstacles" INTEGER NOT NULL,
    "steps" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,

    CONSTRAINT "Simulations_pkey" PRIMARY KEY ("id")
);
