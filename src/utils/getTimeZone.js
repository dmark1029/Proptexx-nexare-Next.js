import axios from "axios";

export async function getTimeZone() {
  try {
    const response = await axios.get("https://ipapi.co/json/");
    return response.data.timezone;
  } catch (error) {
    console.error("Error fetching time zone:", error);
    // Default to a fallback time zone if there's an error
    return "UTC";
  }
}
