// API route that handles uploading an image to Imgur
// as server actions are unable to process file uploads

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const imgurFormData = await request.formData();
    imgurFormData.set("album", process.env.IMGUR_ALBUM_HASH as string);

    // make a call to the Imgur API to upload the image
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `BEARER ${process.env.IMGUR_ACCESS_TOKEN}`,
      },
      body: imgurFormData,
    });

    const imgurResponse = await response.json();

    // feedback
    console.log(
      `[UB TreeTrack] Uploaded plant image to Imgur: ${imgurResponse.data.id}`,
    );

    // return the image link to the client
    return NextResponse.json({
      status: "success",
      message: "Image successfully uploaded to Imgur",
      link: imgurResponse.data.link,
      hash: imgurResponse.data.id,
    });
  } catch (e) {
    return NextResponse.json({
      status: "fail",
      message: "Image failed to upload to Imgur",
      data: e,
    });
  }
}
