"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Translate from "@/components/Translate";

const Cancel = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/plans");
    }, 2000);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <>
          <img
            src="https://cliply.co/wp-content/uploads/2021/07/372107370_CROSS_MARK_400px.gif"
            alt="Wrong"
            className="mx-auto"
          />
          <p className="text-red-600 text-center mt-4">
            <Translate text="Your Payment could not be processed. Please try again. Thank you." />{" "}
            <br />
            <Translate text="Redirecting" /> ...
          </p>
        </>
      </div>
    </div>
  );
};

export default Cancel;
