"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Link from "next/link";

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
      // delete the image from Imgur
      await deleteImgurImage(imageHash);

      // delete the plant entry from Supabase
      await deleteSupabaseEntry(plantId);
      toast({
        title: "Plant deleted",
        description: "The plant has been successfully deleted.",
      });

      // redirect to the homepage
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

  // only show the options if the user is authenticated
  return (
    <>
      <div className="mt-4 flex space-x-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">QR Code</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Plant QR Code</DialogTitle>
              <DialogDescription>
                Click on the image to download at full resolution.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2"></div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {user ? (
          <>
            <Link href={`/plant/${plantId}/update`}>
              <Button variant="default" disabled={isSubmitting}>
                Update
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Delete
            </Button>
          </>
        ) : null}
      </div>
    </>
  );
}
