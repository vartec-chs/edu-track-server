/*
  Warnings:

  - You are about to drop the column `subjectId` on the `teachers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.
  - Made the column `code` on table `subjects` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `subjectId` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subjects" ALTER COLUMN "code" SET NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "subjectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "subjectId";

-- CreateIndex
CREATE UNIQUE INDEX "subjects_code_key" ON "subjects"("code");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
