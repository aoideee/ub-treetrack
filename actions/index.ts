// Server actions that handle processing data on the Supabase server

"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addSupabaseEntry(initialData: {
  scientificName: string;
  commonNames: string[];
  plantDescription: string;
  imageLink: string;
}) {
  console.log(initialData);

  try {
    const supabase = createSupabaseServerClient();

    // get the user from the session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data: entry, error } = await supabase
      .from("plants")
      .insert({
        scientific_name: initialData.scientificName,
        common_names: JSON.stringify(initialData.commonNames),
        description: initialData.plantDescription,
        photo_link: initialData.imageLink,
        user_id: user.id,
      })
      .select("plant_id");

    if (error) {
      throw error;
    }

    console.log(entry);

    revalidatePath("/");
    return {
      success: true,
      redirectUrl: `/plant/${entry[0].plant_id}`,
      plantId: entry[0].plant_id,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: (error as Error).message };
  }
}
