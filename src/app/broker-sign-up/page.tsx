import Image from "next/image";
import SignIn from "@/components/sign-up";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function BrokerSignUpPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_-10%,hsl(var(--primary)/0.15),transparent),radial-gradient(40%_40%_at_100%_0%,hsl(var(--muted-foreground)/0.12),transparent)]" />
      <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)] bg-[linear-gradient(to_right,transparent_0,transparent_24px,rgba(0,0,0,0.06)_25px),linear-gradient(to_bottom,transparent_0,transparent_24px,rgba(0,0,0,0.06)_25px)] bg-[size:26px_26px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 md:px-8">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left panel with logo */}
          <div className="hidden lg:flex flex-col justify-center gap-6 pr-6">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/blackLogo.png"
                alt="Blue Grid Logo"
                width={400}
                height={150}
                priority
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              New Vendor Registration
            </h1>
            <p className="max-w-md text-base text-muted-foreground">
              Complete this form to begin your registration. After sign up, click on{" "}
              <strong>Profile</strong> to finish setting up your account. If work becomes
              available in your area, we will reach out to you by email.
            </p>
          </div>

          {/* Form card */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-xl shadow-xl rounded-3xl border border-border/60 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-3xl">Sign up</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-2 text-center">
                <SignIn />
                <p className="text-sm text-muted-foreground">
                  Already registered?{" "}
                  <a
                    href="/"
                    className="font-medium underline-offset-4 hover:underline text-black"
                  >
                    Sign in
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
