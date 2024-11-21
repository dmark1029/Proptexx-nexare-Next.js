"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/Redux/slices/authSlice";
import Translate from "@/components/Translate";

const AccountVerification = ({ params }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [verified, setVerified] = useState(false);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const linkVerification = async () => {
      try {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URI}/api/users/accountverification/${params.id}`
        );
        if (data.success) {
          setVerified(true);
          dispatch(setUser(data));
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setVerified(false);
        }
      } catch (error) {
        console.error(error.response.data.message);
        setVerified(false);
        setProcessing(false);
      }
    };
    linkVerification();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {verified && (
          <>
            <img
              src="https://i.gifer.com/7efs.gif"
              alt="Success"
              className="mx-auto"
            />
            <p className="text-green-600 text-center mt-4">
              <Translate text="Your account is verified." />
            </p>
          </>
        )}
        {!verified && !processing && (
          <>
            <img
              src="https://cliply.co/wp-content/uploads/2021/07/372107370_CROSS_MARK_400px.gif"
              alt="Wrong"
              className="mx-auto"
            />
            <p className="text-red-600 text-center mt-4">
              <Translate text="Your account could not be verified." />
            </p>
          </>
        )}
        {!verified && processing && (
          <>
            <p className="text-gray-600 text-center mt-4">
              <Translate text="Verifying your account..." />
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountVerification;
