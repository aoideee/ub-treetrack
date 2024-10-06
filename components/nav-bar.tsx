import { createSupabaseServerComponentClient } from "@/lib/supabase/server";
import LoginButton from "./login-button";
import LogoutButton from "./logout-button";

export default async function NavBar() {
  const supabase = createSupabaseServerComponentClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error.message);
    return <LoginButton />;
  }

  return <>{user ? <LogoutButton /> : <LoginButton />}</>;
}
