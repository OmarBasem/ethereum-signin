/*
  Warnings:

  - You are about to alter the column `ethAddress` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(42)`.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `bio` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "ethAddress" SET DATA TYPE VARCHAR(42),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "bio" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userEthAddress" VARCHAR(42) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userEthAddress_fkey" FOREIGN KEY ("userEthAddress") REFERENCES "User"("ethAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
