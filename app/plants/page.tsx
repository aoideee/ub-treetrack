import "@/styles/main.css";

import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { createSupabaseServerComponentClient } from "@/lib/supabase/server";

export default async function AddPlant() {
  const supabase = createSupabaseServerComponentClient();

  const { data: plants, error } = await supabase
    .from("plants")
    .select("plant_id, scientific_name, last_modified");

  if (error) {
    console.error("Error fetching scientific names:", error);
  }

  return (
    <>
      <h1>Plants Database</h1>
      <Table className="mx-auto mt-4 bg-white md:w-2/3">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Scientific Name</TableHead>
            <TableHead className="text-right">Last Modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plants?.map((plant) => (
            <TableRow key={plant.plant_id} className="even:bg-gray-100">
              <TableCell className="font-medium">
                <Link href={`/plant/${plant.plant_id}`}>
                  <span className="text-blue-600 hover:underline">
                    {plant.scientific_name}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="text-right">
                {new Date(plant.last_modified).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
