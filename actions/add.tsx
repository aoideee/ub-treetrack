"use server";

export async function Add(formData: FormData) {
  console.log(formData.get("scientificName"));
  console.log(formData.get("commonNames"));
  console.log(formData.get("plantDescription"));
  console.log(formData.get("imageFile"));
}
