ALTER TYPE "public"."orderStaus" RENAME TO "propStatus";--> statement-breakpoint
ALTER TABLE "statusOrder" RENAME COLUMN "propStatus" TO "prop_status";--> statement-breakpoint
ALTER TABLE "order" DROP CONSTRAINT "order_order_status_statusOrder_propStatus_fk";
--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_order_status_statusOrder_prop_status_fk" FOREIGN KEY ("order_status") REFERENCES "public"."statusOrder"("prop_status") ON DELETE no action ON UPDATE no action;