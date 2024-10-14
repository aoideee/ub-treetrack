import { createSupabaseServerClient } from "@/lib/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";

type Plant = {
  id: string;
  scientific_name: string;
  common_names: string;
  description: string;
  photo_link: string;
};

async function getPlant(uuid: string): Promise<Plant | null> {
  const supabase = createSupabaseServerClient();

  const { data: plant, error } = await supabase
    .from("plants")
    .select("*")
    .eq("plant_id", uuid)
    .single();

  if (error) {
    console.error("Error fetching plant:", error);
    return null;
  }

  return plant;
}

export default async function PlantPage({
  params,
}: {
  params: { uuid: string };
}) {
  const plant = await getPlant(params.uuid);

  if (!plant) {
    notFound();
  }

  return (
    <div>
      <h1>{plant.scientific_name}</h1>
      <p>Common Names: {JSON.parse(plant.common_names).join(", ")}</p>
      <p>Description: {plant.description}</p>
      {plant.photo_link && (
        <Image
          src={plant.photo_link}
          alt={plant.scientific_name}
          width={500}
          height={300}
        />
      )}
    </div>
  );
}
