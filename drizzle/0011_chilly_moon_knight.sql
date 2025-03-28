CREATE TYPE "public"."orderStaus" AS ENUM('pending', 'assigned', 'completed', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('broker', 'client', 'admin');--> statement-breakpoint
CREATE TABLE "statusOrder" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orderId" uuid NOT NULL,
	"vendorId" uuid,
	"orderStatus" "orderStaus" DEFAULT 'pending'
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "roles" DEFAULT 'broker';--> statement-breakpoint
ALTER TABLE "statusOrder" ADD CONSTRAINT "statusOrder_orderId_order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statusOrder" ADD CONSTRAINT "statusOrder_vendorId_users_id_fk" FOREIGN KEY ("vendorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;