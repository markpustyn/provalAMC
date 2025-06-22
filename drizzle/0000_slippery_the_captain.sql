CREATE TABLE "billing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid,
	"prop_id" uuid NOT NULL,
	"amount" varchar(25),
	"vendor_fee" varchar(25),
	"billing_status" varchar(50) DEFAULT 'pending',
	"payment_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loan_number" varchar(50),
	"loan_officer" varchar(255),
	"loan_officer_email" varchar(255),
	"lender" varchar(255),
	"lender_address" varchar(255),
	"lender_city" varchar(255),
	"lender_zip" varchar(10),
	"borrower_name" varchar(255),
	"borrower_email" varchar(255),
	"borrower_phone_type" varchar(50),
	"borrower_phone_number" varchar(30),
	"property_address" varchar(255),
	"property_city" varchar(255),
	"property_state" varchar(50),
	"property_zip" varchar(10),
	"order_type" varchar(255),
	"property_type" varchar(255),
	"present_occupancy" varchar(255),
	"loan_purpose" varchar(255),
	"loan_type" varchar(255),
	"main_product" varchar(255),
	"requested_due_date" varchar(50),
	"description" text,
	"order_status" varchar
);
--> statement-breakpoint
CREATE TABLE "statusOrder" (
	"status_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prop_status" varchar(25),
	"prop_id" uuid NOT NULL,
	"vendor_id" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(30) NOT NULL,
	"password" text NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"license_number" varchar(50) NOT NULL,
	"street" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	"state" varchar(15) NOT NULL,
	"zip_code" varchar(10) NOT NULL,
	"role" varchar(50) DEFAULT 'broker',
	"statued" varchar(50) DEFAULT 'active',
	"last_activity_date" date DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "billing" ADD CONSTRAINT "billing_vendor_id_users_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing" ADD CONSTRAINT "billing_prop_id_order_id_fk" FOREIGN KEY ("prop_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statusOrder" ADD CONSTRAINT "statusOrder_prop_id_order_id_fk" FOREIGN KEY ("prop_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statusOrder" ADD CONSTRAINT "statusOrder_vendor_id_users_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;