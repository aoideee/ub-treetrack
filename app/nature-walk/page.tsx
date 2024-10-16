import "@/styles/main.css";

import { createSupabaseServerComponentClient } from "@/lib/supabase/server";

export default async function AddPlant() {
  const supabase = createSupabaseServerComponentClient();

  const { data: plants, error } = await supabase
    .from("plants")
    .select("plant_id, scientific_name, last_modified");

  if (error) {
    console.error("Error fetching scientific names:", error);
  }

  // sort plants array in alphabetical order by scientific_name
  const sortedPlants = plants?.sort((a, b) =>
    a.scientific_name.localeCompare(b.scientific_name),
  );

  console.log(sortedPlants);

  return (
    <>
      <h1 className="h1-main">The Nature Walk</h1>
    </>
  );
}
