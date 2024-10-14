export async function imgurUpload(formData: FormData) {
  const response = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: `BEARER ${process.env.IMGUR_ACCESS_TOKEN}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.data.error);
  }

  return data.data.link;
}
