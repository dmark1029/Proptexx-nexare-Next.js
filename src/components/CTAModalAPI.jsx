"use client";
import React from "react";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import { Modal } from "@mui/material";
import { setRedirection } from "@/Redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import Translate from "./Translate";

const CTAModalAPI = ({ open, setOpen, stepsData }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const userRedirection = () => {
    dispatch(setRedirection({ pathname, stepsData }));
    router.push("/plans");
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <div className="absolute outline-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-100 rounded w-11/12 md:!w-5/12 xl:!w-3/12 p-3 shadow-lg">
        <div className="flex justify-center mt-3">
          <img
            src="/images/nexa-logo.png"
            className="mr-3 h-[30px] sm:!h-[35px]"
            alt="Proptexx Logo"
            style={{ filter: "brightness(0%)" }}
          />
        </div>
        <div className="text-bold w-full md:!w-11/12 md:!ml-6 mt-5 flex gap-2">
          <DoneAllOutlinedIcon className="!text-mainColor" />
          <p className="text-slate-500">
            <Translate text="Upgrade Plan" />
          </p>
        </div>
        <div className="text-bold w-full md:!w-11/12 md:!ml-6 mt-5 flex gap-2">
          <DoneAllOutlinedIcon className="!text-mainColor" />
          <p className="text-slate-500">
            <Translate text="Seamlessly upload your own photos" />
          </p>
        </div>
        <div className="text-bold w-full md:!w-11/12 md:!ml-6 mt-5 flex gap-2">
          <DoneAllOutlinedIcon className="!text-mainColor" />
          <p className="text-slate-500">
            <Translate text="Exclusive access to API connectivity and bulk processing" />
          </p>
        </div>
        <div className="text-bold w-full md:!w-11/12 md:!ml-6 mt-5 flex gap-2 my-4">
          <DoneAllOutlinedIcon className="!text-mainColor" />
          <p className="text-slate-500">
            <Translate text="Empower to build applications on top of our source code" />
          </p>
        </div>
        <div className="flex justify-center" onClick={userRedirection}>
          <button className="!bg-mainColor text-md  text-white w-11/12 py-1.5 mb-4 rounded">
            <Translate text="Upgrade Plan" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CTAModalAPI;
