"use client";
import Translate from "@/components/Translate";
import axios from "axios";
import Link from "next/link";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ForgetPassword = () => {
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/api/users/forgetpassword`,
        {
          email,
        }
      );

      if (data?.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      <div className="grid md:grid-cols-2 min-h-[100vh] overflow-hidden">
        <div className="bg-gradient-to-b from-mainColor to-secondColor h-[100%] hidden md:!flex justify-center items-center">
          <img src="/login-logo.png" alt="Nexa" />
        </div>
        <div className="flex flex-col w-[90%] max-w-[600px] !mx-auto justify-center py-[30px]">
          <div
            className="cursor-pointer w-20 h-10"
            onClick={() => router.back()}
          >
            <div className="flex items-center gap-1 !mb-7">
              <IoIosArrowBack size={19} className="!text-black" />
              <span className="text-sm">
                <Translate text="Back" />
              </span>
            </div>
          </div>
          <h1 className="text-[2.4rem] font-bold !font-allround">
            <Translate text="Forget Password" />
          </h1>
          <p className="text-sm text-[#1d1d1db1]">
            <Translate text="Enter your email and we willll send a link to reset your password" />
          </p>
          <form className="pt-6 mb-4" onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                className="border border-[#d2d2d2] w-full py-1.5 px-[20px] h-[60px] rounded-[10px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                type="email"
                placeholder="Account Email"
              />
            </div>
            <div className="grid justify-center mt-[40px] w-full">
              <button
                className="!bg-thirdColor !w-[200px] h-[50px] font-[600] text-sm rounded-[20px] text-black py-1.5 focus:outline-none focus:shadow-outline"
                type="submit"
              >
                <Translate text="Send Link" />
              </button>
            </div>
          </form>
        </div>
      </div>
      {false && (
        <main className="flex flex-col justify-center items-center mt-10">
          <div className="w-11/12 md:!w-7/12">
            <Link href="/login" className="w-20 h-10">
              <div className="flex items-center gap-1 mb-7 ml-6">
                <IoIosArrowBack size={32} color="#4497ce" />
                <span className="text-sm">
                  <Translate text="Back to Login" />
                </span>
              </div>
            </Link>
            <div className="border-[1px] border-gray-200 p-12 rounded">
              <h1 className="text-3xl font-bold">
                <Translate text="Forget Password" />
              </h1>
              <p className="text-sm my-6">
                <Translate text="Enter your email and we willll send a link to reset your password" />
              </p>
              <form
                className="flex flex-col md:!flex-row gap-6 items-center"
                onSubmit={handleSubmit}
              >
                <input
                  className="border rounded w-72 py-1.5 px-3 text-gray-700 leading-tight border-gray-300 focus:outline-none focus:shadow-outline"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Account Email"
                />
                <button
                  className="!bg-mainColor hover:!bg-blue-700 text-white text-sm py-1.5 px-4 rounded"
                  type="submit"
                >
                  <Translate text="Email Password Reset Link" />
                </button>
              </form>
            </div>
          </div>
        </main>
      )}
    </>
  );
};
export default ForgetPassword;
