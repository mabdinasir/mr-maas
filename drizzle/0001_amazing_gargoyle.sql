CREATE TYPE "public"."Role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "MemoryEntry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(768),
	"createdAt" timestamp DEFAULT now(),
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TokenBlacklist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "TokenBlacklist_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"password" text NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"mobile" text NOT NULL,
	"email" text NOT NULL,
	"isSignedIn" boolean DEFAULT false,
	"isDeleted" boolean DEFAULT false,
	"hasAcceptedTnC" boolean DEFAULT false,
	"role" "Role" DEFAULT 'USER',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"profilePicture" text,
	"bio" text,
	CONSTRAINT "User_mobile_unique" UNIQUE("mobile"),
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "MemoryEntry" ADD CONSTRAINT "MemoryEntry_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;