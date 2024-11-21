"use client";
import Link from "next/link";
import React from "react";

const Section6 = () => {
  const plans = [
    {
      planName: "Starter",
      price: 24,
      listing: "Use on 1 listing",
      content: [
        "Unlimited use on one listing",
        "Lead Generation",
        "“Powered by PropTexx”",
      ],
      link: "https://app.hubspot.com/payments/odF0HqeUSW?referrer=PAYMENT_LINK",
    },
    {
      planName: "Plus",
      price: 99,
      listing: "Up to 25 Active Listings",
      content: [
        "Unlimited use on each active listing",
        "Lead Generation & Data",
        "With logo “Powered by”",
        "Standard Layout",
      ],
      link: "https://app.hubspot.com/payments/jNT5vtVgRbyR?referrer=PAYMENT_LINK",
    },
    {
      planName: "Pro",
      price: 299,
      listing: "Up to 100 Active Listings",
      content: [
        "Unlimited use on each active listing",
        "Lead Generation & Data",
        "With logo “Powered by”",
        "Customised Layout",
      ],
      link: "https://app.hubspot.com/payments/4Cmp5cbqQIeH?referrer=PAYMENT_LINK",
    },
    {
      planName: "Enterprise",
      price: "Call Us",
      listing: "Custom",
      content: [
        "Unlimited use on each active listing",
        "Lead Generation & Data",
        "Logo “Powered by” Removed",
        "Customised Layout",
      ],
      link: "/contact",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center mt-[100px] !mb-[200px]">
      <h3 className="font-[800] !font-allround text-[#242331] text-center text-[2.4rem] mb-[20px]">
        Pricing
      </h3>
      <div className="overflow-x-auto md:w-full">
        <div className="w-[1300px] mx-auto">
          <div className="flex gap-2.5 lg:gap-5 lg:px-5">
            {plans.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-start gap-[10px] bg-[#F9F9F9] rounded-[20px] w-full p-[30px_40px_30px_40px] h-auto"
              >
                <h3 className="font-[800] text-[35px] text-[#242331] capitalize text-center sm:text-[1.2rem]">
                  {item.planName}
                </h3>
                <div className="flex flex-col gap-[5px] border-t border-b border-[#D3D3D3] py-[10px]">
                  <strong className="text-center text-[#242331]">
                    {item.price != "Call Us" ? (
                      <span className="font-[800] text-[18px]">$</span>
                    ) : null}
                    <span className="font-[800] text-[34px]">{item.price}</span>
                    {item.price != "Call Us" ? (
                      <span className="font-[800] text-[18px]">/month</span>
                    ) : null}
                  </strong>
                  <strong className="font-[600] text-center text-[15px] text-[#C68A15] bg-[#FEC] p-[5px_15px_5px_15px] rounded-[42px]">
                    {item.listing}
                  </strong>
                </div>
                <p className="flex flex-col items-center leading-9 text-center text-[#797979] font-[400] text-[17px] py-4">
                  {item.content?.map((cont, index) => (
                    <p key={index}>{cont}</p>
                  ))}
                </p>
                <Link
                  href={item.link}
                  target="_blank"
                  onClick={() => {
                    gtag_report_conversion(`${item.link}`);
                  }}
                >
                  <button className="font-[700] text-[15px] text-[#242331] p-[20px_40px_20px_40px] rounded-[42px] border border-[#D3D3D3]">
                    {item.price == "Call Us" ? "Contact Us" : "Get Started"}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section6;
