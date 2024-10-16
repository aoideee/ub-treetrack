import "@/styles/main.css";
import "@/styles/nature-walk.css";

import { createSupabaseServerComponentClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

import { Database } from "@/types/supabase";
type Plant = Database["public"]["Tables"]["plants"]["Row"];

export default async function AddPlant() {
  const supabase = createSupabaseServerComponentClient();

  const { data: plants, error } = await supabase.rpc("get_random_plants");

  if (error) {
    console.error("Error fetching plants:", error);
  }

  return (
    <>
      <h1 className="h1-main">The Nature Walk</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam lacinia,
        nibh molestie tincidunt posuere, nisl massa efficitur urna, non iaculis
        ligula urna in metus. Nullam posuere accumsan eros vel condimentum.
        Quisque est eros, scelerisque hendrerit justo eu, maximus auctor lectus.
        Praesent elementum placerat orci ut volutpat. Cras et augue massa. Morbi
        at justo auctor, imperdiet elit sit amet, hendrerit leo. Suspendisse
        convallis varius arcu ut congue. Donec sodales leo tempor lorem cursus
        porttitor tincidunt at est. Suspendisse eu libero ac velit tristique
        venenatis id id mauris. Duis risus arcu, hendrerit sit amet ante vitae,
        sagittis pharetra ex. In id lorem orci. Nunc placerat, tortor eu varius
        mattis, metus nunc porta nibh, quis pharetra sapien sem quis leo. Donec
        vel gravida massa. Morbi scelerisque accumsan condimentum. Duis in
        eleifend massa. Vestibulum sit amet ante tempor, vulputate orci rutrum,
        pulvinar lectus. Mauris vel felis ac tellus pellentesque aliquam a ac
        ligula. Aliquam placerat velit tellus. Donec ac lorem et neque egestas
        pharetra. Pellentesque metus arcu, aliquam sit amet hendrerit ut,
        volutpat ac orci. Aliquam pharetra lacus et blandit bibendum.
      </p>
      <div className="nature-grid">
        {plants?.map((plant: Plant) => (
          <Card key={plant.plant_id} className="nature-card">
            <Link href={`/plant/${plant.plant_id}`}>
              <CardHeader>
                <Image
                  src={plant.photo_link}
                  alt={plant.scientific_name}
                  width={300}
                  height={300}
                  className="nature-image"
                />
              </CardHeader>
              <CardContent className="text-center">
                <h2 className="nature-heading">{plant.scientific_name}</h2>
                <p className="nature-description">
                  {(plant.description?.length ?? 0) > 100
                    ? `${plant.description?.substring(0, 100)} ...`
                    : plant.description}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </>
  );
}
