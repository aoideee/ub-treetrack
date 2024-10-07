// Login Button component that uses Supabase to authenticate with Google OAuth.

"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function LoginButton(props: { nextUrl?: string }) {
  const supabase = createSupabaseBrowserClient();
  const { toast } = useToast();

  const handleLogin = async () => {
    // show a toast message
    toast({
      title: "Logging in...",
      description: "You will be redirected soon.",
    });

    // authenticate with Google OAuth
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${
          props.nextUrl || ""
        }`,
      },
    });
  };

  return (
    <Button
      variant={"outline"}
      onClick={handleLogin}
      className="w-full sm:w-auto"
    >
      Login
    </Button>
  );
}
