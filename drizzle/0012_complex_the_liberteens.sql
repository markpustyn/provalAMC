ALTER TABLE "statusOrder" RENAME COLUMN "orderId" TO "prop_id";--> statement-breakpoint
ALTER TABLE "statusOrder" RENAME COLUMN "vendorId" TO "vendor_id";--> statement-breakpoint
ALTER TABLE "statusOrder" DROP CONSTRAINT "statusOrder_orderId_order_id_fk";
--> statement-breakpoint
ALTER TABLE "statusOrder" DROP CONSTRAINT "statusOrder_vendorId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "statusOrder" ADD CONSTRAINT "statusOrder_prop_id_order_id_fk" FOREIGN KEY ("prop_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statusOrder" ADD CONSTRAINT "statusOrder_vendor_id_users_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;