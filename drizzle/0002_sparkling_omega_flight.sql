CREATE TYPE "public"."MemoryType" AS ENUM('text', 'image', 'audio', 'video');--> statement-breakpoint
ALTER TABLE "MemoryEntry" ADD COLUMN "type" "MemoryType" DEFAULT 'text';--> statement-breakpoint
ALTER TABLE "MemoryEntry" ADD COLUMN "metadata" jsonb;