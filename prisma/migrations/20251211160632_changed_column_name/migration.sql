/*
  Warnings:

  - You are about to drop the column `universitiesId` on the `Documents` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_universitiesId_fkey";

-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "universitiesId",
ADD COLUMN     "universityId" UUID;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "Universities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
