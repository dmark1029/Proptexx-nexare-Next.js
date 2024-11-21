import axios from "axios";
import { Box, Modal, Typography } from "@mui/material";

export const sendHeartbeat = async (userId, resetUser, toast, token) => {
  try {
    if (userId) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/api/users/heartbeat`,
        {
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  } catch (error) {
    const message = error?.response?.data?.message;
    if (message === "Session ended, already logged out") {
      toast.error("Your session has expired. Please login again and retry");
      resetUser();
    } else {
      // Handle other types of errors or just log them
      console.error("Error sending heartbeat:", message);
    }
  }
};
