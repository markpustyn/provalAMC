ALTER TYPE "public"."orderStaus" ADD VALUE 'open' BEFORE 'pending';--> statement-breakpoint
ALTER TABLE "statusOrder" RENAME COLUMN "prop_status" TO "propStatus";--> statement-breakpoint
ALTER TABLE "order" DROP CONSTRAINT "order_order_status_statusOrder_prop_status_fk";
--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_order_status_statusOrder_propStatus_fk" FOREIGN KEY ("order_status") REFERENCES "public"."statusOrder"("propStatus") ON DELETE no action ON UPDATE no action;