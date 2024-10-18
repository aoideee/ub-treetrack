// Helper function that uploads an image to Imgur via the API route

export async function qrUpload(data: {
  plantId: string;
  destination: string;
  imageFile: File;
}) {
  // create a new FormData object and properly set the data
  const imgurFormData = new FormData();
  imgurFormData.set("image", data.imageFile);
  imgurFormData.set("name", data.plantId as string);
  imgurFormData.set("title", data.plantId as string);
  imgurFormData.set("description", data.destination as string);
  imgurFormData.set("type", "file");

  imgurFormData.set("qr", "true");

  // make the API call
  const response = await fetch("/api/upload", {
    method: "POST",
    body: imgurFormData,
  });

  return response;
}
