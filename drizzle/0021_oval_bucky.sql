ALTER TABLE "serial" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "serial" CASCADE;--> statement-breakpoint
ALTER TABLE "statusOrder" ALTER COLUMN "id" SET DATA TYPE bigserial;--> statement-breakpoint
ALTER TABLE "statusOrder" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "statusOrder" ADD CONSTRAINT "statusOrder_id_unique" UNIQUE("id");