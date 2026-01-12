/*
  Warnings:

  - You are about to alter the column `description` on the `Todo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.

*/
-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "description" SET DATA TYPE VARCHAR(200);
