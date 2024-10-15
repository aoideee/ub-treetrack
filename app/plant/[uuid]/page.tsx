// Plant page

import "@/styles/plant-page.css";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import PlantOptions from "@/components/plant-options";

type Plant = {
  id: string;
  scientific_name: string;
  common_names: string;
  description: string;
  photo_link: string;
  imgur_hash: string;
};

async function getPlant(uuid: string): Promise<Plant | null> {
  const supabase = createSupabaseServerClient();

  const { data: plant, error } = await supabase
    .from("plants")
    .select("*")
    .eq("plant_id", uuid)
    .single();

  if (error) {
    return null;
  }

  return plant;
}

export async function generateMetadata({
  params,
}: {
  params: { uuid: string };
}): Promise<Metadata> {
  const plant = await getPlant(params.uuid);

  if (!plant) {
    return {
      title: "Plant Not Found",
    };
  }

  return {
    title: plant.scientific_name,
  };
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

  const {
    data: { user },
  } = await createSupabaseServerClient().auth.getUser();

  return (
    <article className="card">
      <h1 className="mb-4 text-3xl font-bold">{plant.scientific_name}</h1>
      {plant.photo_link && (
        <Image
          src={plant.photo_link}
          alt={plant.scientific_name}
          width={500}
          height={500}
          className="mb-4 rounded-lg"
        />
      )}
      <h2>Common Names</h2>
      <p>{JSON.parse(plant.common_names).join(", ")}</p>
      <h2>Description</h2>
      <p style={{ whiteSpace: "pre-wrap" }}>{plant.description}</p>

      <PlantOptions
        user={user}
        plantId={params.uuid}
        imageHash={plant.imgur_hash}
      />
    </article>
  );
}
