// Client Component that uses a server wrapper to fetch user data

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { addSupabaseRating } from "@/actions";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Rating = {
  rating_id: string;
  plant_id: string;
  rating_value: number;
  created_at: string;
};

const FormSchema = z.object({
  rating_value: z
    .number({
      required_error: "You need to select a rating value.",
    })
    .min(1, { message: "Rating must be at least 1." })
    .max(5, { message: "Rating must be at most 5." }),
});

const COOLDOWN_KEY_PREFIX = "last_rating_submission_";
const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default function Rating({
  plantId,
  plantRatings,
}: {
  plantId: string;
  plantRatings: Rating[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState<number | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rating_value: 0,
    },
  });

  const cooldownKey = `${COOLDOWN_KEY_PREFIX}${plantId}`;

  useEffect(() => {
    const checkCooldown = () => {
      const lastSubmission = localStorage.getItem(cooldownKey);
      if (lastSubmission) {
        const timeSinceLastSubmission =
          Date.now() - parseInt(lastSubmission, 10);
        if (timeSinceLastSubmission < COOLDOWN_PERIOD) {
          setIsOnCooldown(true);
          setCooldownTime(COOLDOWN_PERIOD - timeSinceLastSubmission);
        } else {
          setIsOnCooldown(false);
          setCooldownTime(null);
        }
      } else {
        setIsOnCooldown(false);
        setCooldownTime(null);
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 60000); // update every minute
    return () => clearInterval(interval);
  }, [cooldownKey]);

  const handleRating = async (data: z.infer<typeof FormSchema>) => {
    if (isOnCooldown) {
      toast({
        title: "Error",
        description: "You can only submit one rating per day for this plant.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // submit the rating to the Supabase database
      const result = await addSupabaseRating(plantId, data.rating_value);

      if (result.success) {
        localStorage.setItem(cooldownKey, Date.now().toString());
        setIsOnCooldown(true);
        setCooldownTime(COOLDOWN_PERIOD);
        toast({
          title: "Rating submitted!",
          description: "Your rating has been successfully submitted.",
        });
      }

      router.refresh();
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Error",
        description: "There was an error submitting the rating.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // calculate the average rating
  const rating = plantRatings.length
    ? (
        plantRatings.reduce((sum, { rating_value }) => sum + rating_value, 0) /
        plantRatings.length
      ).toFixed(2)
    : 0;

  function getBadgeClass(rating: number) {
    if (rating >= 4 && rating <= 5) return "bg-green-500 text-white";
    if (rating >= 3 && rating < 4) return "bg-yellow-500 text-white";
    if (rating >= 2 && rating < 3) return "bg-orange-500 text-white";
    if (rating >= 1 && rating < 2) return "bg-red-500 text-white";
    return "bg-gray-500 text-white"; // default color for no ratings or invalid values
  }

  function formatCooldownTime(ms: number) {
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m`;
  }

  return (
    <>
      <div className="mb-3 mt-0 flex justify-center rounded-xl border-2 bg-slate-100 px-8 py-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRating)}
            className="flex flex-col items-center space-y-2"
          >
            <FormField
              control={form.control}
              name="rating_value"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center space-y-3">
                  <FormLabel>
                    <Badge
                      className={getBadgeClass(Number(rating))}
                    >{`Rating: ${rating !== 0 ? rating : "None"}`}</Badge>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value.toString()}
                      className="flex justify-center space-x-1"
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <FormItem
                          key={value}
                          className="flex items-center justify-center gap-2"
                        >
                          <FormControl>
                            <RadioGroupItem value={value.toString()} />
                          </FormControl>
                          <FormLabel className="cursor-pointer text-center">
                            <div>{value}</div>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="h-0 rounded-3xl p-3"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : isOnCooldown
                  ? "Cooldown Active"
                  : "Submit your Rating!"}
            </Button>
            {isOnCooldown && cooldownTime && (
              <p className="text-sm text-gray-500">
                You can submit another rating for this plant in:{" "}
                {formatCooldownTime(cooldownTime)}
              </p>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}
