"use client";
import { dashboardMenuArray } from "@/utils/dashboadMenuList";
import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Translate from "@/components/Translate";
import { cloneElement } from "react";

const DashBoardAdminMenu = ({ menuIndex }) => {
  const { token, user } = useSelector((state) => state.auth.user);
  const router = useRouter();

  if (token && user?.role === "admin") {
    return (
      <div className="w-full md:!w-3/12 bg-white h-[calc(100vh-100px)]">
        <ul className="p-5">
          {dashboardMenuArray.map((item, index) => (
            <li
              key={index}
              onClick={() => router.push(`/dashboard?index=${index}`)}
              className={`text-[1] flex ${
                menuIndex == index
                  ? "text-white !bg-mainColor"
                  : "!text-mainColor bg-white"
              } ${
                [2, 6].includes(index) &&
                "relative before:absolute before:left-0 before:top-[105%] before:w-full before:h-[1px] before:bg-[#a0a0a0] mb-2"
              } font-[700] p-[10px] cursor-pointer capitalize`}>
              <div className="px-2">
                {cloneElement(item?.svg, {
                  fill: menuIndex == index ? "#ffffff" : "#000000",
                })}
              </div>
              <Translate text={item.title} />
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    router.push("/");
  }
};
export default DashBoardAdminMenu;
