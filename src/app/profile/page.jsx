"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import AuhtProvider from "@/components/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { whiteLabeled } from "@/utils/sampleData";
import Translate from "@/components/Translate";
import { setUser } from "@/Redux/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token, user } = useSelector((state) => state.auth.user);

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URI}/api/users/updateuser`,
        {
          oldPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        dispatch(setUser({}));
        router.push("/login");
        toast.success("Password updated successfully");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const cancelHandler = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/api/payment/subscriptioncancelation`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        dispatch(setUser(data));
        toast.success("Subscription cancelled successfully");
      }
    } catch (error) {
      toast.error("Something went wrong while cancelling subscription");
    }
  };

  return (
    <AuhtProvider>
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white shadow-lg rounded-md w-full max-w-3xl mb-16">
          <h2 className="text-2xl font-bold mb-6">
            <Translate text="Profile Information" />
          </h2>

          <div className="flex items-center justify-between mb-2">
            <label htmlFor="name" className="font-medium">
              <Translate text="Name" />
            </label>
            <input
              value={user?.name}
              disabled
              className="border p-2 rounded-md disabled:cursor-not-allowed disabled:bg-gray-100"
              placeholder="Enter your name"
            />
          </div>

          <div className="flex items-center justify-between mb-2">
            <label htmlFor="email" className="font-medium">
              <Translate text="Email" />
            </label>
            <input
              value={user?.email}
              disabled
              className="border p-2 rounded-md
              disabled:cursor-not-allowed disabled:bg-gray-100"
              placeholder="Enter your email"
            />
          </div>
          <hr />

          <h2 className="text-xl font-bold my-6">
            <Translate text="Update Password" />
          </h2>
          {/* Old password */}
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="oldPassword" className="font-medium">
              <Translate text="Old Password" />
            </label>
            <input
              onChange={(e) => setOldPassword(e.target.value)}
              type="password"
              id="oldPassword"
              className="border p-2 rounded-md"
              placeholder="Enter old password"
            />
          </div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="newPassword" className="font-medium">
              <Translate text="New Password" />
            </label>
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              id="newPassword"
              className="border p-2 rounded-md"
              placeholder="Enter new password"
            />
          </div>

          <div className="flex items-center justify-between mb-2">
            <label htmlFor="confirmPassword" className="font-medium">
              <Translate text="Confirm Password" />
            </label>
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              id="confirmPassword"
              className="border p-2 rounded-md"
              placeholder="Confirm new password"
            />
          </div>
          <button
            onClick={handlePasswordChange}
            className="!bg-secondColor text-white px-4 py-2 rounded-md mb-2"
            type="submit"
          >
            <Translate text="Update Password" />
          </button>

          <hr />
          {!whiteLabeled && (
            <>
              <h2 className="text-xl font-bold my-6">
                <Translate text="Cancel Subscription" />
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                <Translate
                  text="Once you cancel your subscription, you will no longer have
                access to the content and features of this site."
                />
              </p>

              <button
                onClick={cancelHandler}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                <Translate text="Cancel Subscription" />
              </button>
            </>
          )}
          <hr />

          <h2 className="hidden text-xl font-bold my-6">
            <Translate text="Delete Account" />
          </h2>

          <p className="hidden text-sm text-gray-500 mb-2">
            <Translate
              text="Once your account is deleted, all of its resources and data will be
            permanently deleted. Before deleting your account, please download
            any data or information that you wish to retain."
            />
          </p>

          <button className="hidden bg-red-500 text-white px-4 py-2 rounded-md">
            <Translate text="Delete Account" />
          </button>
        </div>
      </div>
    </AuhtProvider>
  );
};

export default Profile;
