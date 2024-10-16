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
  last_modified: string;
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
      <h1 className="plant-name">{plant.scientific_name}</h1>
      <p className="information-small mb-4 mt-2">
        {JSON.parse(plant.common_names).join(", ")}
      </p>
      {plant.photo_link && (
        <Image
          src={plant.photo_link}
          alt={plant.scientific_name}
          width={500}
          height={500}
          className="plant-image"
        />
      )}
      <h2 className="information-title">Plant Description</h2>
      <p className="w-full" style={{ whiteSpace: "pre-wrap" }}>
        {plant.description}
      </p>

      <PlantOptions
        user={user}
        plantId={params.uuid}
        imageHash={plant.imgur_hash}
      />

      <p className="information-small mt-4">
        Last Modified:{" "}
        {new Date(plant.last_modified).toLocaleString("en-US", {
          timeZone: "America/Belize",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })}
      </p>
    </article>
  );
}
