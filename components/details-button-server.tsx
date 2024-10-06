import { createSupabaseServerComponentClient } from "@/lib/supabase/server";
import DetailsButtonClient from "./details-button-client";

export default async function DetailsButtonServer() {
  const {
    data: { user },
  } = await createSupabaseServerComponentClient().auth.getUser();

  return <DetailsButtonClient user={user} />;
}
