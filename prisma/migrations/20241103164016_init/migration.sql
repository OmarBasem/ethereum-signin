-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "ethAddress" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_ethAddress_key" ON "User"("ethAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
