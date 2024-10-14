"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function Add(formData: FormData) {
  console.log(formData.get("scientificName"));
  console.log(formData.get("commonNames"));
  console.log(formData.get("plantDescription"));
  console.log(formData.get("imageFile"));
}
