/*
  Warnings:

  - Added the required column `content` to the `MemoryChunk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `embedding` to the `MemoryChunk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MemoryChunk" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "embedding" vector(1536) NOT NULL;
