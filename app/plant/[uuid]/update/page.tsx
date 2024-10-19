import "@/styles/main.css";

import PlantUpdateForm from "@/components/update-form";

import { createSupabaseServerComponentClient } from "@/lib/supabase/server";
import { Metadata } from "next";

// metadata
export const metadata: Metadata = {
  title: "Update Plant",
  description: "Update a plant in the UB TreeTrack database",
};

export default async function UpdatePlant({
  params,
}: {
  params: { uuid: string };
}) {
  const supabase = createSupabaseServerComponentClient();

  // fetch plant information from Supabase
  const { data: plant, error } = await supabase
    .from("plants")
    .select("*")
    .eq("plant_id", params.uuid)
    .single();

  if (error) {
    console.error("Error fetching plant data:", error);
    return <p>Error loading plant data.</p>;
  }

  return (
    <>
      <h1 className="h1-main">Update Plant</h1>
      <PlantUpdateForm plant={plant} />
    </>
  );
}
