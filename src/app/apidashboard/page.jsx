"use client";
import Translate from "@/components/Translate";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";

const Apidashboard = () => {
  const router = useRouter();
  const [menuIndex, setMenuIndex] = useState(0);
  const [isBlur, setIsBlur] = useState(true);
  const { token, user } = useSelector((state) => state.auth.user);
  const maskedValue = "*".repeat(user?._id.length - 4) + user?._id.slice(-4);
  if (token && user?.planName == "power_user") {
    return (
      <div className="sticky md:!h-[calc(100vh-200px)] top-20 w-full">
        <div className="flex flex-col md:!flex-row">
          <div className="w-full md:!w-3/12 bg-white h-[calc(100vh-100px)]">
            <ul className="p-5">
              <li
                onClick={() => setMenuIndex(0)}
                className={`text-[1] ${
                  menuIndex == 0
                    ? "text-white !bg-mainColor"
                    : "!text-mainColor bg-white"
                } font-[700] p-[10px] cursor-pointer capitalize rounded-[4px]`}>
                <Translate text="API key" />
              </li>
              <li
                onClick={() =>
                  router.push(
                    "https://proptexx-api.stoplight.io/docs/generative-models/7ww7rire45u6s-license-plate-detection",
                  )
                }
                className={`text-[1] p-[10px] !text-mainColor bg-white rounded-[4px] font-[700] cursor-point hover:!opacity-[0.8] capitalize cursor-pointer`}>
                <Translate text="API Document" />
              </li>
            </ul>
          </div>
          <div className="w-full bg-slate-100 md:!w-9/12 h-[calc(100vh-100px)]">
            {menuIndex == 0 && (
              <div className="bg-white my-5 md:!m-5 pb-4">
                <h2 className="text-[1.3rem] font-[500] text-[#4e4e58] md:!text-[1.3rem] p-4">
                  <Translate text="Proptexx API key" />
                </h2>
                <hr />
                <div className="p-2 flex gap-4 justify-between items-center rounded border-slate-300 border-[1px] mx-4 mt-4">
                  <span className="text-md md:!text-[1rem]">
                    {isBlur ? maskedValue : user?._id}
                  </span>
                  {isBlur ? (
                    <AiOutlineEyeInvisible
                      size={22}
                      className="cursor-pointer"
                      onClick={() => setIsBlur(false)}
                    />
                  ) : (
                    <AiOutlineEye
                      size={22}
                      className="cursor-pointer"
                      onClick={() => setIsBlur(true)}
                    />
                  )}
                </div>
              </div>
            )}
            {menuIndex == 1 && (
              <div className="grid place-items-center h-full">
                <h2 className="bg-slate-100 p-2 flex gap-4 justify-between items-center rounded">
                  <span
                    className={`text-4xl ${
                      isBlur ? "blur-md select-none" : ""
                    }`}>
                    {user?._id}
                  </span>
                  {isBlur ? (
                    <AiOutlineEyeInvisible
                      size={30}
                      className="cursor-pointer"
                      onClick={() => setIsBlur(false)}
                    />
                  ) : (
                    <AiOutlineEye
                      size={30}
                      className="cursor-pointer"
                      onClick={() => setIsBlur(true)}
                    />
                  )}
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    router.push("/");
  }
};

export default Apidashboard;
