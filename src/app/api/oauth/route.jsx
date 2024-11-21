import { getURLWithQueryParams } from "../route";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const req = await request.json();
  const LINKEDIN_URL = getURLWithQueryParams(
    "https://www.linkedin.com/oauth/v2/accessToken",
    {
      grant_type: "authorization_code",
      code: req.code,
      redirect_uri: `${process.env.NEXT_PUBLIC_API_FRONT}${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT}`,
      client_id: `${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}`,
      client_secret: `${process.env.NEXT_PUBLIC_LINKEDIN_SECRET_ID}`,
    }
  );
  let tok;
  let resp = await fetch(LINKEDIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  // if (resp.ok) tok = await resp.json();
  const jsonResponse = await resp.json();
  // const access_token = jsonResponse.access_token;
  // const successMessage = userData;
  return new NextResponse(JSON.stringify(jsonResponse), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const GET = async (request) => {
  const req = await request;
  const requestUrl = new URL(req.url);
  const access_token = requestUrl.searchParams.get("accesstoken");
  console.log(access_token, "get request");
  if (access_token) {
    let auth = "Bearer " + access_token;
    console.log(auth, "auth");
    let u = {};
    let e = {};
    let usr = await fetch("https://api.linkedin.com/v2/me", {
      method: "GET",
      headers: { Connection: "Keep-Alive", Authorization: auth },
    });
    if (usr.ok) u = await usr.json();
    console.log(u, "user data");

    let usremail = await fetch(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      {
        method: "GET",
        headers: { Connection: "Keep-Alive", Authorization: auth },
      }
    );
    if (usremail.ok) e = await usremail.json();

    const userData = {
      linkedInId: u.id,
      name: `${u.localizedFirstName} ${u.localizedLastName}`,
      email: e.elements[0]["handle~"].emailAddress,
    };
    console.log(userData);

    const successMessage = userData;
    return new NextResponse(JSON.stringify(successMessage), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
