"use client";

import "@/styles/form.css";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { imgurUpload } from "@/lib/functions/imgur-upload";
import { qrUpload } from "@/lib/functions/qr-upload";
import { addSupabaseEntry, addSupabaseQREntry } from "@/actions";

import QRCode from "qrcode";

// zod schema and constraints

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function PlantAddForm({
  existingNames,
}: {
  existingNames: string[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const FormSchema = z.object({
    scientificName: z
      .string()
      .min(1, {
        message: "Scientific name is required",
      })
      .refine((name) => !existingNames.includes(name), {
        message: "Scientific name already exists",
      }),
    commonNames: z.string().min(1, {
      message: "Common name(s) is required",
    }),
    plantDescription: z.string().min(1, {
      message: "Plant description is required",
    }),
    imageFile: z
      .instanceof(File, { message: "Image file is required" })
      .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
        message: "Only JPG, JPEG, PNG, and WEBP files are accepted.",
      })
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: "File size must be less than 10MB.",
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      scientificName: "",
      commonNames: "",
      plantDescription: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);

    // split common names into an array
    const commonNamesArray = data.commonNames
      .split(",")
      .map((name) => name.trim());

    try {
      // upload image to Imgur
      const response = await imgurUpload(data);
      if (!response.ok) {
        throw new Error(response.statusText || "Upload to Imgur Failed");
      }
      const imgurResponse = await response.json();
      const imageLink = imgurResponse.link;
      const imageHash = imgurResponse.hash;

      // add entry to Supabase

      const supabaseData = {
        scientificName: data.scientificName.trim(),
        commonNames: commonNamesArray,
        plantDescription: data.plantDescription.trim(),
        imageLink,
        imageHash,
      };

      const supabaseResponse = await addSupabaseEntry(supabaseData);

      const destination = `${process.env.NEXT_PUBLIC_BASE_URL}/plant/${supabaseResponse.plantId}`;
      // generate QR code for the plant
      const qrCodeBuffer = await QRCode.toDataURL(destination, {
        errorCorrectionLevel: "H",
        type: "image/png",
      });

      // convert Data URL to Blob
      const dataURLtoBlob = (dataurl: string) => {
        const arr = dataurl.split(",");
        const match = arr[0].match(/:(.*?);/);
        const mime = match ? match[1] : "";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      };

      // create File object from Blob
      const qrBlob = dataURLtoBlob(qrCodeBuffer);
      const qrFile = new File([qrBlob], `${supabaseResponse.plantId}.png`, {
        type: "image/png",
      });

      const qrData = {
        plantId: supabaseResponse.plantId,
        destination,
        imageFile: qrFile,
      };

      const qrResponse = await qrUpload(qrData);
      if (!qrResponse.ok) {
        throw new Error(response.statusText || "QR Upload to Imgur Failed");
      }
      const qrJSON = await qrResponse.json();
      const qrLink = qrJSON.link;
      const qrHash = qrJSON.hash;

      // add QR code entry to Supabase

      const qrSupabaseData = {
        plantId: supabaseResponse.plantId,
        destination,
        qrLink,
        qrHash,
      };

      const qrSupabaseResponse = await addSupabaseQREntry(qrSupabaseData);

      if (qrSupabaseResponse.success) {
        toast({
          title: "Image uploaded successfully!",
          description: "Redirecting...",
        });

        if (supabaseResponse.redirectUrl) {
          router.push(supabaseResponse.redirectUrl);
        } else {
          throw new Error("Redirect URL is undefined");
        }
      }
    } catch (error) {
      toast({
        title: "Error uploading image",
        description: String(error),
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="form">
        {/* Scientific Name */}
        <FormField
          control={form.control}
          name="scientificName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scientific Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Swietenia macrophylla"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                {`Scientific name of the plant (e.g. Swietenia macrophylla).`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Common Names */}
        <FormField
          control={form.control}
          name="commonNames"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Common Names</FormLabel>
              <FormControl>
                <Input
                  placeholder="Mahogany, Caoba, Mara, Mogno"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                {`Separate each name with a comma (e.g. Mahogany, Caoba, Mara, Mogno).`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Plant Description */}
        <FormField
          control={form.control}
          name="plantDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plant Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter Plant Description"
                  className="h-48"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Enter all of the details of the plant that you wish to record.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Plant Image */}
        <FormField
          control={form.control}
          name="imageFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Image File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Accepted image file formats: JPG, JPEG, PNG, WEBP
              </FormDescription>
              <FormDescription>Max file size: 10MB</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
