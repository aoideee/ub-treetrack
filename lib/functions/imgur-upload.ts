// Helper function that uploads an image to Imgur via the API route

export async function imgurUpload(data: {
  scientificName: string;
  commonNames: string;
  plantDescription: string;
  imageFile: File;
}) {
  console.log(data);
  // create a new FormData object and properly set the data
  const imgurFormData = new FormData();
  imgurFormData.set("image", data.imageFile);
  imgurFormData.set("name", data.scientificName as string);
  imgurFormData.set("title", data.scientificName as string);
  imgurFormData.set("description", data.scientificName as string);
  imgurFormData.set("type", "file");

  imgurFormData.set("qr", "false");

  // make the API call
  const response = await fetch("/api/upload", {
    method: "POST",
    body: imgurFormData,
  });

  return response;
}
