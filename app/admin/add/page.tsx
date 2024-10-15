import "@/styles/main.css";

import { createSupabaseServerComponentClient } from "@/lib/supabase/server";
import PlantAddForm from "@/components/add-form";

export default async function AddPlant() {
  const supabase = createSupabaseServerComponentClient();

  const { data: plants, error } = await supabase
    .from("plants")
    .select("scientific_name");

  if (error) {
    console.error("Error fetching scientific names:", error);
  }

  const scientificNamesArray =
    plants?.map(
      (plant: { scientific_name: string }) => plant.scientific_name,
    ) || [];

  return (
    <>
      <h1>Add Plant</h1>
      <PlantAddForm existingNames={scientificNamesArray} />
    </>
  );
}
