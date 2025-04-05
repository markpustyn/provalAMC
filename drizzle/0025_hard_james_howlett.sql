CREATE TABLE "billing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid,
	"prop_id" uuid NOT NULL,
	"amount" varchar(25),
	"billingStatus" "propStatus" DEFAULT 'pending',
	"payment_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "billing" ADD CONSTRAINT "billing_vendor_id_users_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing" ADD CONSTRAINT "billing_prop_id_order_id_fk" FOREIGN KEY ("prop_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public"."billing" ALTER COLUMN "billingStatus" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."propStatus";--> statement-breakpoint
CREATE TYPE "public"."propStatus" AS ENUM('pending', 'paid', 'failed', 'refunded');--> statement-breakpoint
ALTER TABLE "public"."billing" ALTER COLUMN "billingStatus" SET DATA TYPE "public"."propStatus" USING "billingStatus"::"public"."propStatus";