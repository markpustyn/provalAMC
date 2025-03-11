CREATE TYPE "public"."roles" AS ENUM('guest', 'user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'disabled');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "statusUsr" "status" DEFAULT 'disabled';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "roles" DEFAULT 'guest';