import Image from "next/image";
import ClientSignUpForm from "@/components/clientsign-up";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function ClientSignUpPage() {
  return (
    <div className="relative min-h-screen w-full overflow-auto">
      {/* backdrop */}
      <div className="bg-[radial-gradient(60%_40%_at_50%_-10%,hsl(var(--primary)/0.15),transparent),radial-gradient(40%_40%_at_100%_0%,hsl(var(--muted-foreground)/0.12),transparent)]" />
      <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)] bg-[linear-gradient(to_right,transparent_0,transparent_24px,rgba(0,0,0,0.06)_25px),linear-gradient(to_bottom,transparent_0,transparent_24px,rgba(0,0,0,0.06)_25px)] bg-[size:26px_26px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 md:px-8">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left panel */}
          <div className="flex flex-col items-center lg:items-start justify-center text-center lg:text-left gap-4 lg:gap-6">
            <Image
              src="/blackLogo.png"
              alt="Blue Grid Logo"
              width={280}
              height={120}
              priority
              className="object-contain mx-auto lg:mx-0"
            />
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Client Registration
            </h1>
            <p className="max-w-md text-sm sm:text-base text-muted-foreground">
              Complete this form to begin your registration. After sign up, click on{" "}
              <strong>Profile</strong> to finish setting up your account. Once your
              account is approved, you will be able to place and track property inspection
              orders directly through our platform.
            </p>
          </div>

          {/* Form card */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl shadow-xl rounded-3xl border border-border/60">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl sm:text-3xl">Sign up</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-3 text-center">
                <ClientSignUpForm />
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
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
