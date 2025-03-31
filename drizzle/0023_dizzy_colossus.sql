ALTER TABLE "statusOrder" DROP CONSTRAINT "statusOrder_id_unique";--> statement-breakpoint
ALTER TABLE "statusOrder" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "statusOrder" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();