// app/client/signup/page.tsx
import ClientSignUpForm from "@/components/clientsign-up";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_-10%,hsl(var(--primary)/0.15),transparent),radial-gradient(40%_40%_at_100%_0%,hsl(var(--muted-foreground)/0.12),transparent)]" />
      <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)] bg-[linear-gradient(to_right,transparent_0,transparent_24px,rgba(0,0,0,0.06)_25px),linear-gradient(to_bottom,transparent_0,transparent_24px,rgba(0,0,0,0.06)_25px)] bg-[size:26px_26px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 md:px-8">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left panel */}
          <div className="hidden lg:flex flex-col justify-center gap-6 pr-6">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="max-w-md text-base text-muted-foreground">
              Request property inspection services, stay informed on updates, and securely manage your files from one dashboard.
            </p>
              <p className="max-w-md text-sm text-muted-foreground mt-4">
                Have questions? Email us at{" "}
                <a
                  href="mailto:support@evalucloud.com"
                  className="text-black font-medium underline-offset-4 hover:underline"
                >
                  support@evalucloud.com
                </a>
              </p>
          </div>

          {/* Form card */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-xl shadow-xl rounded-3xl border border-border/60 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Client Sign up</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <ClientSignUpForm />
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a href="/" className="font-medium text-black underline-offset-4 hover:underline">
                    Sign in
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
