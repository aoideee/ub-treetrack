// Server Wrapper

import { createSupabaseServerComponentClient } from "@/lib/supabase/server";

import DetailsButtonClient from "./details-button-client";

export default async function DetailsButtonServer() {
  const {
    data: { user },
  } = await createSupabaseServerComponentClient().auth.getUser();

  // pass the user data to the client component
  return <DetailsButtonClient user={user} />;
}
