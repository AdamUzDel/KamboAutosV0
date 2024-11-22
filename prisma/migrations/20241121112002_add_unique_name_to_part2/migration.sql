/*
  Warnings:

  - A unique constraint covering the columns `[name,modelLineId]` on the table `Part` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Part_name_modelLineId_key" ON "Part"("name", "modelLineId");
