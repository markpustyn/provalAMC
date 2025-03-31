ALTER TABLE "serial" ADD PRIMARY KEY ("bigNumber");--> statement-breakpoint
ALTER TABLE "serial" ADD CONSTRAINT "serial_bigNumber_unique" UNIQUE("bigNumber");