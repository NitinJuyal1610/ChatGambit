/*
  Warnings:

  - Made the column `socketId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "socketId" SET NOT NULL;
