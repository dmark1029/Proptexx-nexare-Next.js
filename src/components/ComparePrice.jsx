"use client";
import Link from "next/link";
import React from "react";
import FAQ from "./FAQ";
import Translate from "@/components/Translate";

const ComparePrice = () => {
  return (
    <div className="mx-[auto] max-w-[1100px] w-[90%]">
      {/* <h3 className="text-[#242331] !font-allround font-[800] text-[40px] text-center mt-[50px] sm:text-[2rem]">
      <Translate text="Compare pricing packages" />
      </h3>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-4 grid-rows-14 mx-auto min-w-[750px] mt-[30px] rounded-[40px] overflow-hidden">
          <div className="bg-[#F9F9F9] flex flex-col items-start pl-10 justify-center border-b-2 pt-6">
            <span className="text-[#242331] font-[800] text-[30px] !font-allround">
            <Translate text="Features" />
            </span>
          </div>
          <div className="bg-[#F9F9F9] pt-6">
            <div className="flex flex-col items-center justify-center  border-b-2">
              <h3 className="text-[#242331] font-[800] text-[30px] !font-allround"><Translate text="Starter" /></h3>
              <h3>
                <span className="text-[#242331] font-[800] text-[25px]">$</span>
                <span className="text-[#242331] font-[800] text-[30px]">
                  24
                </span>
                <span className="text-[#242331] font-[600] text-[15px]">
                  /<Translate text="month" />
                </span>
              </h3>
              <span className="text-[#242331] font-[600] text-[15px] pb-4">
                1 <Translate text="active listing" />
              </span>
            </div>
          </div>
          <div className="bg-[#F9F9F9] pt-6">
            <div className="flex flex-col items-center justify-center  border-b-2">
              <h3 className="text-[#242331] font-[800] text-[30px] !font-allround"><Translate text="Plus" /></h3>
              <h3>
                <span className="text-[#242331] font-[800] text-[25px]">$</span>
                <span className="text-[#242331] font-[800] text-[30px]">
                  99
                </span>
                <span className="text-[#242331] font-[600] text-[15px]">
                  /<Translate text="month" />
                </span>
              </h3>
              <span className="text-[#242331] font-[600] text-[15px] pb-4 ">
                25 <Translate text="active listings" />
              </span>
            </div>
          </div>
          <div className="bg-[#F9F9F9]  pt-6">
            <div className="flex flex-col items-center justify-center border-b-2">
              <h3 className="text-[#242331] font-[800] text-[30px] !font-allround"><Translate text="Pro" /></h3>
              <h3>
                <span className="text-[#242331] font-[800] text-[25px]">$</span>
                <span className="text-[#242331] font-[800] text-[30px]">
                  299
                </span>
                <span className="text-[#242331] font-[600] text-[15px]">
                  /<Translate text="month" />
                </span>
              </h3>
              <span className="text-[#242331] font-[600] text-[15px] pb-4">
                100 <Translate text="active listing" />
              </span>
            </div>
          </div>
          <div className="bg-[#F9F9F9] items-start pl-10 justify-center py-5">
            <span className="text-secondColor font-[700] text-[15px]">
            <Translate text="Lead Generation" />
            </span>
          </div>
          <div className="bg-[#F9F9F9] "></div>
          <div className="bg-[#F9F9F9]"></div>
          <div className="bg-[#F9F9F9] "></div>
          <div className="bg-white items-start pl-10 justify-center py-5">
            <span className="text-[#797979] font-[500] text-[15px]">
            <Translate text="Price per new lead" />
            </span>
          </div>
          <div className="bg-white items-center justify-center text-center py-5">
            <span className="text-[#797979] font-[500] text-[15px]">
            <Translate text="free download" />
            </span>
          </div>
          <div className="bg-white items-center justify-center text-center py-5">
            <span className="text-[#797979] font-[500] text-[15px]">
            <Translate text="free download" />
            </span>
          </div>
          <div className="bg-white items-center justify-center text-center py-5">
            <span className="text-[#797979] font-[500] text-[15px]">
            <Translate text="free download" />
            </span>
          </div>
          <div className="bg-[#F9F9F9] items-start pl-10 justify-center py-5">
            <span className="text-[#797979] font-[500] text-[15px]">
            <Translate text="Lead analytics" />
            </span>
          </div>
          <div className="bg-[#F9F9F9] flex items-center justify-center">
            <img src="/Close.png" alt="close" className="h-[28px] w-[28px]" />
          </div>
          <div className="bg-[#F9F9F9] flex items-center justify-center">
            <img src="/Tick.png" alt="tick" className="h-[26px] w-[26px]" />
          </div>
          <div className="bg-[#F9F9F9] flex items-center justify-center">
            <img src="/Tick.png" alt="tick" className="h-[26px] w-[26px]" />
          </div>
          <div className="bg-white items-start pl-10 justify-center py-5">
            <span className="text-[#797979] font-[500] text-[15px]">
            <Translate text="Lead History Tracking" />
            </span>
          </div>
          <div className="bg-white flex items-center justify-center">
            <img src="/Close.png" alt="close" className="h-[28px] w-[28px]" />
          </div>
          <div className="bg-white flex items-center justify-center">
            <img src="/Close.png" alt="close" className="h-[28px] w-[28px]" />
          </div>
          <div className="bg-white flex items-center justify-center">
            <img src="/Tick.png" alt="tick" className="h-[26px] w-[26px]" />
          </div>
          <div className="bg-[#F9F9F9] items-start pl-10 justify-center py-5">
            <span className="text-secondColor font-[700] text-[15px]">
            <Translate text="Customization" />
            </span>
          </div>
          <div className="bg-[#F9F9F9]"></div>
          <div className="bg-[#F9F9F9]"></div>
          <div className="bg-[#F9F9F9] "></div>
          <div className="bg-white items-start pl-10 justify-center py-5">
            <span className="text-[#797979] font-[500] text-[15px]">
              <Translate text="Remove Proptexx Logo" />
            </span>
          </div>
          <div className="bg-white flex items-center justify-center">
            <img src="/Close.png" alt="close" className="h-[28px] w-[28px]" />
          </div>
          <div className="bg-white flex items-center justify-center">
            <img src="/Close.png" alt="close" className="h-[28px] w-[28px]" />
          </div>
          <div className="bg-white flex items-center justify-center">
            <span className="text-[#31C65B] text-center font-[600] text-[15px]">
            <Translate text="Contact Us" />
            </span>
          </div>
          <div className="bg-[#F9F9F9] items-start pl-10 justify-center py-5">
            <span className="text-[#797979] font-[500] text-[15px]">
            <Translate text="Change Color On Widget" />
            </span>
          </div>
          <div className="bg-[#F9F9F9] flex items-center justify-center">
            <img src="/Close.png" alt="close" className="h-[28px] w-[28px]" />
          </div>
          <div className="bg-[#F9F9F9] flex items-center justify-center">
            <img src="/Close.png" alt="close" className="h-[28px] w-[28px]" />
          </div>
          <div className="bg-[#F9F9F9] flex items-center justify-center">
            <img src="/Tick.png" alt="tick" className="h-[26px] w-[26px]" />
          </div>
          <div className="bg-white items-start pl-10 justify-center py-5">
            <span className="text-[#797979] font-[500] text-[15px]">
            <Translate text="Change In Text" />
            </span>
          </div>
          <div className="bg-white flex items-center justify-center">
            <img src="/Close.png" alt="close" className="h-[28px] w-[28px]" />
          </div>
          <div className="bg-white flex items-center justify-center">
            <img src="/Close.png" alt="close" className="h-[28px] w-[28px]" />
          </div>
          <div className="bg-white flex items-center justify-center">
            <img src="/Tick.png" alt="tick" className="h-[26px] w-[26px]" />
          </div>
          <div className="bg-[#F9F9F9] items-start pl-10 justify-center py-5">
            <span className="text-secondColor font-[700] text-[15px]">
            <Translate text="Integrations" />
            </span>
          </div>
          <div className="bg-[#F9F9F9]"></div>
          <div className="bg-[#F9F9F9]"></div>
          <div className="bg-[#F9F9F9] "></div>
          <div className="bg-white items-start pl-10 justify-center py-5">
            <span className="text-[#797979] font-[500] text-[15px]">SSO</span>
          </div>
          <div className="bg-white flex items-center justify-center">
            <img src="/Close.png" alt="close" className="h-[28px] w-[28px]" />
          </div>
          <div className="bg-white flex items-center justify-center">
            <img src="/Close.png" alt="close" className="h-[28px] w-[28px]" />
          </div>
          <div className="bg-white flex items-center justify-center">
            <span className="text-[#31C65B] text-center font-[600] text-[15px]">
            <Translate text="Contact Us" />
            </span>
          </div>
          <div className="bg-[#F9F9F9] items-start pl-10 justify-center py-5">
            <span className="text-[#797979] font-[500] text-[15px]">
            <Translate text="Salesforce and Hubspot" />
            </span>
          </div>
          <div className="bg-[#F9F9F9] flex items-center justify-center">
            <img src="/Close.png" alt="close" className="h-[28px] w-[28px]" />
          </div>
          <div className="bg-[#F9F9F9] flex items-center justify-center">
            <img src="/Close.png" alt="close" className="h-[28px] w-[28px]" />
          </div>
          <div className="bg-[#F9F9F9] flex items-center justify-center">
            <img src="/Tick.png" alt="tick" className="h-[26px] w-[26px]" />
          </div>
          <div className="bg-white items-start pl-10 justify-center py-5">
            <span className="text-[#797979] font-[500] text-[15px]">
            <Translate text="Marketing Push for Listings" />
            </span>
          </div>
          <div className="bg-white flex items-center justify-center">
            <img src="/Tick.png" alt="tick" className="h-[26px] w-[26px]" />
          </div>
          <div className="bg-white flex items-center justify-center">
            <img src="/Tick.png" alt="tick" className="h-[26px] w-[26px]" />
          </div>
          <div className="bg-white flex items-center justify-center">
            <img src="/Tick.png" alt="tick" className="h-[26px] w-[26px]" />
          </div>
          <div className="bg-[#F9F9F9]"></div>
          <div className="flex items-center justify-center bg-[#F9F9F9] py-6">
            <Link
              onClick={() => {
                gtag_report_conversion(
                  `https://app.hubspot.com/payments/odF0HqeUSW?referrer=PAYMENT_LINK`
                );
              }}
              href={
                "https://app.hubspot.com/payments/odF0HqeUSW?referrer=PAYMENT_LINK"
              }
              target="_blank"
              className="rounded-[39px] border border-[#D3D3D3] p-[15px_30px_15px_30px]"
            >
              <Translate text="Get Started" />
            </Link>
          </div>
          <div className="flex items-center justify-center bg-[#F9F9F9] py-6">
            <Link
              onClick={() => {
                gtag_report_conversion(
                  `https://app.hubspot.com/payments/jNT5vtVgRbyR?referrer=PAYMENT_LINK`
                );
              }}
              href={
                "https://app.hubspot.com/payments/jNT5vtVgRbyR?referrer=PAYMENT_LINK"
              }
              target="_blank"
              className="rounded-[39px] border border-[#D3D3D3] p-[15px_30px_15px_30px]"
            >
             <Translate text="Get Started" />
            </Link>
          </div>
          <div className="flex items-center justify-center bg-[#F9F9F9] py-6">
            <Link
              onClick={() => {
                gtag_report_conversion(
                  `https://app.hubspot.com/payments/4Cmp5cbqQIeH?referrer=PAYMENT_LINK`
                );
              }}
              href={
                "https://app.hubspot.com/payments/4Cmp5cbqQIeH?referrer=PAYMENT_LINK"
              }
              target="_blank"
              className="rounded-[39px] border border-[#D3D3D3] p-[15px_30px_15px_30px] bg-[#EFECFF] text-secondColor shadow-xl"
            >
              <Translate text="Get Started" />
            </Link>
          </div>
        </div>
      </div> */}
      
      {/* <FAQ /> */}

      <div className="flex flex-col items-center justify-center mt-[150px] mb-[80px]">
        <img src="/Payment Method.svg" alt="visa" />
      </div>
    </div>
  );
};

export default ComparePrice;
