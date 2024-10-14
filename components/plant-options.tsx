// Client Component that uses a server wrapper to fetch user data

"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { deleteSupabaseEntry, deleteImgurImage } from "@/actions";

export default function PlantOptions({
  user,
  plantId,
  imageHash,
}: {
  user: User | null;
  plantId: string;
  imageHash: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteImgurImage(imageHash);

      await deleteSupabaseEntry(plantId);
      toast({
        title: "Plant deleted",
        description: "The plant has been successfully deleted.",
      });
      router.push("/");
    } catch (error) {
      console.error("Error deleting plant:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the plant.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {user ? (
        <div className="mt-4 flex space-x-4">
          <Button variant="default" disabled={isSubmitting}>
            Update
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            Delete
          </Button>
        </div>
      ) : null}
    </>
  );
}
