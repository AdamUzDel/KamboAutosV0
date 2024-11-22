/*
  Warnings:

  - Added the required column `modelLineId` to the `Part` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Part" ADD COLUMN     "modelLineId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_modelLineId_fkey" FOREIGN KEY ("modelLineId") REFERENCES "ModelLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
