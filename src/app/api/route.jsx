export const getURLWithQueryParams = (base, params) => {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  return `${base}?${query}`;
};

export const LINKEDIN_URL = getURLWithQueryParams(
  "https://www.linkedin.com/oauth/v2/authorization",
  {
    response_type: "code",
    client_id: `${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}`,
    redirect_uri: `${process.env.NEXT_PUBLIC_API_FRONT}${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT}`,
    scope: 'r_liteprofile r_emailaddress'
  }
);