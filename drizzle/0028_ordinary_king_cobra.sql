CREATE TABLE "billing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid,
	"prop_id" uuid NOT NULL,
	"amount" varchar(25),
	"vendor_fee" varchar(25),
	"billing_status" "propStatus" DEFAULT 'pending',
	"payment_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "statusOrder" RENAME COLUMN "id" TO "status_id";--> statement-breakpoint
ALTER TABLE "billing" ADD CONSTRAINT "billing_vendor_id_users_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing" ADD CONSTRAINT "billing_prop_id_order_id_fk" FOREIGN KEY ("prop_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;