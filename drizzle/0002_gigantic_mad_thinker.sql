ALTER TABLE "users" ADD COLUMN "statued" "status" DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "statusUsr";