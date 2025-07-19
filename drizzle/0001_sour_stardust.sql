ALTER TABLE "statusOrder" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "statusOrder" CASCADE;--> statement-breakpoint
ALTER TABLE "order" DROP CONSTRAINT "order_order_status_statusOrder_prop_status_fk";
--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN "order_status";