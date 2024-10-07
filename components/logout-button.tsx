// Logout Button

"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function LogoutButton({ name }: { name: string }) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    // show a toast message
    toast({
      description: "Logging out...",
      duration: 1000,
    });

    // sign out
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <Button
      variant={"outline"}
      onClick={handleLogout}
      className="w-full sm:w-auto"
    >
      {`${name} (Logout)`}
    </Button>
  );
}
