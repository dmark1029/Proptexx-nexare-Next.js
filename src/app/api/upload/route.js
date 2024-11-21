import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { formData, crmToken } = await request.json();
    console.log("formData", formData);
    const response = await fetch(formData.uploadUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${crmToken}`,
        },
        body: JSON.stringify([{
          "listingId": formData.listingId,
          "listingPictureId": formData.listingPictureId,
          "imageUrl": formData.imageUrl,
        }]),
      }
    );
    const data = await response.json();
    console.log("data", data);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "upload failed with server internal error",
    }
  }

}