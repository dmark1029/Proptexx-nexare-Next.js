"use client";
import { whiteLabeled } from "@/utils/sampleData";
import Link from "next/link";
import React from "react";
import Translate from "./Translate";

const handleEmailClick = (event) => {
  event.preventDefault();
};

const Footer = () => {
  return (
    !whiteLabeled && (
      <footer className="w-full bottom-0 border-[#eeeeee] border-t-[1px] bg-white text-black py-4 px-4 sm:!py-4 md:!fixed">
        <div className="flex justify-between flex-col sm:!flex-row items-center gap-2">
          <div>
            <p className=" text-center text-sm text-[#767784]">
              <Translate text="Copyright Ⓒ" />
              <span className="text-black font-[500]">PropTexx.</span>{" "}
              <Translate text="All Rights Reserved" />
            </p>
          </div>
          <div className="text-sm flex flex-col sm:!flex-row gap-2 sm:!gap-7 text-[#000000]">
            {/* <div className="flex flex-wrap gap-[10px_20px] justify-center">
              <Link href="https://www.nexare.ai/#Plans" legacyBehavior>
                <a className="hover:!text-gray-400">
                  <Translate text="Pricing" />
                </a>
              </Link>

              <Link
                className=" hover:!text-gray-400"
                href="https://www.nexare.ai/terms-of-use"
                legacyBehavior
              >
                <a className="hover:!text-gray-400">
                  <Translate text="Terms of Use" />
                </a>
              </Link>
              <Link
                className=" hover:!text-gray-400"
                href="https://www.nexare.ai/privacy-policy"
                legacyBehavior
              >
                <a className="hover:!text-gray-400">
                  <Translate text="Privacy Policy" />
                </a>
              </Link>
              <a
                href="https://www.nexare.ai/contact-us"
                className=" hover:!text-gray-400"
                legacyBehavior
              >
                <Translate text="Contact us" />
              </a>
            </div> */}
          </div>
        </div>
      </footer>
    )
  );
};

export default Footer;
