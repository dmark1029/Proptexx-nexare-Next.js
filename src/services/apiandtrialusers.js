import axios from "axios";

export const getApiTrialUsers = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URI}/api/users/getapitrialusers`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) {
      const trialUsers = response?.data?.trialUsers;
      const apiUsers = response?.data?.apiUsers;
      return { trialUsers, apiUsers };
    } else {
      return "No users found";
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// get contact list
export const getContactList = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URI}/api/contacts`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) {
      return response?.data?.contacts;
    } else {
      return "No contact found";
    }
  } catch (error) {
    console.error("Error fetching contacts:");
  }
};
