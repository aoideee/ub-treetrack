"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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

type QRCode = {
  qr_id: string;
  plant_id: string;
  qr_image: string;
  qr_destination: string;
  created_at: string;
};

export default function PlantOptions({
  user,
  plantId,
  imageHash,
  qrCode,
}: {
  user: User | null;
  plantId: string;
  imageHash: string;
  qrCode: QRCode;
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
              <div className="flex items-center justify-center space-x-2">
                <a href={qrCode.qr_image} target="_blank">
                  <Image
                    src={qrCode.qr_image}
                    alt={`QR Code for ${plantId}`}
                    width={212}
                    height={212}
                  />
                </a>
              </div>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
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
