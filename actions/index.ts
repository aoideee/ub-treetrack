// Server actions that handle processing data on the Supabase server

"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// server action to add a new plant entry to the Supabase database
export async function addSupabaseEntry(initialData: {
  scientificName: string;
  commonNames: string[];
  plantDescription: string;
  imageLink: string;
  imageHash: string;
}) {
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
        imgur_hash: initialData.imageHash,
        user_id: user.id,
      })
      .select("plant_id");

    if (error) {
      throw error;
    }

    // feedback
    console.log(
      `[UB TreeTrack] ${user.user_metadata.full_name} inserted plant entry to Supabase ${entry[0].plant_id}`,
    );

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

// server action to delete a plant entry from the Supabase database
export async function deleteSupabaseEntry(plantId: string) {
  try {
    const supabase = createSupabaseServerClient();

    // get the user from the session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from("plants")
      .delete()
      .eq("plant_id", plantId);

    if (error) {
      throw error;
    }

    // feedback
    console.log(
      `[UB TreeTrack] ${user.user_metadata.full_name} deleted plant entry from Supabase: ${plantId}`,
    );

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: (error as Error).message };
  }
}

// server action to delete an image from Imgur
export async function deleteImgurImage(imageHash: string) {
  // make a call to the Imgur API to delete the image
  const response = await fetch(`https://api.imgur.com/3/image/${imageHash}`, {
    method: "DELETE",
    headers: {
      Authorization: `BEARER ${process.env.IMGUR_ACCESS_TOKEN}`,
    },
  });

  const imgurResponse = await response.json();

  if (imgurResponse.success) {
    console.log(`[UB TreeTrack] Deleted plant image from Imgur: ${imageHash}`);
  } else {
    console.error(`[UB TreeTrack] Failed to delete from Imgur: ${imageHash}`);
  }
}

// server action to update a plant entry in the Supabase database
export async function updateSupabaseEntry(
  plantId: string,
  oldHash: string,
  updatedData: {
    scientificName: string;
    commonNames: string[];
    plantDescription: string;
    imageLink: string;
    imageHash: string;
  },
) {
  try {
    const supabase = createSupabaseServerClient();

    // get the user from the session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    if (updatedData.imageLink !== "" && updatedData.imageHash !== "") {
      const { error } = await supabase
        .from("plants")
        .update({
          scientific_name: updatedData.scientificName,
          common_names: JSON.stringify(updatedData.commonNames),
          description: updatedData.plantDescription,
          photo_link: updatedData.imageLink,
          imgur_hash: updatedData.imageHash,
          last_modified: new Date().toISOString(),
        })
        .eq("plant_id", plantId);

      if (error) {
        throw error;
      }

      await deleteImgurImage(oldHash);
    } else {
      const { error } = await supabase
        .from("plants")
        .update({
          scientific_name: updatedData.scientificName,
          common_names: JSON.stringify(updatedData.commonNames),
          description: updatedData.plantDescription,
          last_modified: new Date().toISOString(),
        })
        .eq("plant_id", plantId)
        .select("*");

      if (error) {
        throw error;
      }
    }

    // feedback
    console.log(
      `[UB TreeTrack] ${user.user_metadata.full_name} updated plant entry in Supabase: ${plantId}`,
    );

    revalidatePath(`/plant/${plantId}`);
    return { success: true, redirectUrl: `/plant/${plantId}` };
  } catch (error) {
    console.error(error);
    return { success: false, error: (error as Error).message };
  }
}
