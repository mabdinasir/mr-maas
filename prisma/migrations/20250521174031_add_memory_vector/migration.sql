/*
  Warnings:

  - Added the required column `embedding` to the `MemoryEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MemoryEntry" ADD COLUMN     "embedding" vector(1536) NOT NULL;
