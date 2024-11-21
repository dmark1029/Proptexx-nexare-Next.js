import Link from "next/link";
import React from "react";
import Translate from "./Translate";

const FooterPricing = () => {
  return (
    <footer className="w-[90%] max-w-[1300px] m-[auto] border-t-[1px] border-[#c4c4c445] mt-[80px] pt-[137px] sm:pt-[60px] flex flex-col">
      <div className="grid grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 w-[100%] gap-[50px] lg:mb-10">
        <div>
          <img src="/images/nexa-logo.png" alt="Logo" className="w-44" />
          <div className="grid grid-cols-[22px_1fr] gap-[10px] mt-[36px]">
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.16536 4.51953H18.832C19.8404 4.51953 20.6654 5.34453 20.6654 6.35286V17.3529C20.6654 18.3612 19.8404 19.1862 18.832 19.1862H4.16536C3.15703 19.1862 2.33203 18.3612 2.33203 17.3529V6.35286C2.33203 5.34453 3.15703 4.51953 4.16536 4.51953Z"
                stroke="#5236FF"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M20.6654 6.35254L11.4987 12.7692L2.33203 6.35254"
                stroke="#0031E5"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div>
              <span className="text-[#797979] text-[14px]">
                info@proptexx.com
              </span>
              <br />
              <span className="text-[#797979] text-[14px]">
                548 Market Street, San Francisco
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[22px_1fr] gap-[10px] w-[100%] mt-[10px]">
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1_1499)">
                <path
                  d="M14.2955 4.78923C15.1908 4.96391 16.0137 5.40179 16.6587 6.04683C17.3038 6.69187 17.7416 7.51472 17.9163 8.41006L14.2955 4.78923ZM14.2955 1.12256C16.1557 1.32921 17.8903 2.16222 19.2145 3.48482C20.5388 4.80741 21.374 6.54098 21.583 8.40089L14.2955 1.12256ZM20.6663 15.7159V18.4659C20.6674 18.7212 20.6151 18.9739 20.5128 19.2078C20.4105 19.4417 20.2605 19.6517 20.0724 19.8243C19.8843 19.9969 19.6622 20.1283 19.4203 20.21C19.1785 20.2918 18.9222 20.3222 18.668 20.2992C15.8473 19.9927 13.1377 19.0289 10.7572 17.4851C8.54233 16.0777 6.66455 14.1999 5.25715 11.9851C3.70797 9.59366 2.74388 6.87097 2.44299 4.03756C2.42008 3.78407 2.45021 3.52859 2.53145 3.28738C2.61269 3.04617 2.74326 2.82452 2.91486 2.63654C3.08645 2.44857 3.29531 2.29838 3.52813 2.19554C3.76095 2.0927 4.01263 2.03946 4.26715 2.03923H7.01715C7.46202 2.03485 7.8933 2.19238 8.2306 2.48246C8.56791 2.77255 8.78822 3.17538 8.85049 3.61589C8.96656 4.49595 9.18182 5.36006 9.49215 6.19173C9.61549 6.51982 9.64218 6.8764 9.56907 7.2192C9.49596 7.562 9.32611 7.87666 9.07965 8.12589L7.91549 9.29006C9.22041 11.585 11.1206 13.4851 13.4155 14.7901L14.5797 13.6259C14.8289 13.3794 15.1435 13.2096 15.4863 13.1365C15.8291 13.0634 16.1857 13.0901 16.5138 13.2134C17.3455 13.5237 18.2096 13.739 19.0897 13.8551C19.5349 13.9179 19.9416 14.1422 20.2323 14.4853C20.523 14.8284 20.6775 15.2663 20.6663 15.7159Z"
                  stroke="#0031E5"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1_1499">
                  <rect
                    width="22"
                    height="22"
                    fill="white"
                    transform="translate(0.5 0.205566)"
                  />
                </clipPath>
              </defs>
            </svg>
            <div className="w-[100%]">
              <span className="text-[#797979] text-[14px]">
                +1 (415) 993-4378{" "}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_1fr] gap-[70px]">
          <div className="flex flex-col">
            <strong className="text-[#242331] text-[26px] font-[700] pb-[15px] border-b-[1px] border-[#c4c4c445]">
            <Translate text="Pages" />
            </strong>
            <ul className="mt-[20px] flex flex-col gap-5">
              <Link href="https://www.nexare.ai/">
                <li className="text-[#797979] text-[1rem] 2xl:text-[0.9rem]">
                <Translate text="Home" />
                </li>
              </Link>
              <Link href="https://www.nexare.ai/#FAQ">
                <li className="text-[#797979] text-[1rem] 2xl:text-[0.9rem]">
                <Translate text="About Us" />
                </li>
              </Link>
              <Link href="https://www.nexare.ai/ai-media-store" target="_blank">
                <li className="text-[#797979] text-[1rem] 2xl:text-[0.9rem]">
                  integrations
                </li>
              </Link>
              <Link href="https://www.nexare.ai/#Plans">
                <li className="text-[#797979] text-[1rem] 2xl:text-[0.9rem]">
                <Translate text="Pricing" />
                </li>
              </Link>
              <Link href="/">
                <li className="text-[#797979] text-[1rem] 2xl:text-[0.9rem]">
                <Translate text="Features" />
                </li>
              </Link>
              <Link href="https://www.nexare.ai/contact-us">
                <li className="text-[#797979] text-[1rem] 2xl:text-[0.9rem]">
                <Translate text="Contact Us" />
                </li>
              </Link>
            </ul>
          </div>

          <div className="flex flex-col">
            <strong className="text-[#242331] text-[26px] font-[700] pb-[15px] border-b-[1px] border-[#c4c4c445]">
            <Translate text="Utility Pages" />
            </strong>
            <ul className="mt-[20px] flex flex-col gap-5">
              <Link href="https://app.proptexx.com/" target="_blank">
                <li className="text-[#797979] text-[1rem] 2xl:text-[0.9rem]">
                <Translate text="Try it" />
                </li>
              </Link>
              <Link href='https://www.nexare.ai/terms-of-use' target="_blank">
                <li className="text-[#797979] text-[1rem] 2xl:text-[0.9rem]">
                <Translate text="T&C" />
                </li>
              </Link>
              <Link href='https://www.nexare.ai/privacy-policy' target="_blank">
                <li className="text-[#797979] text-[1rem] 2xl:text-[0.9rem]">
                <Translate text="Privacy Policy" />
                </li>
              </Link>
            </ul>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="bg-[#f9f9f9] rounded-[30px] p-[30px] pb-[0px]">
            <strong className="text-[#0031E5] text-[0.8rem]">
            <Translate text="Install The PropTexx Widget" />
            </strong>
            <p className="text-[#242331] font-[800] text-[30px] sm:text-[1.4rem]">
            <Translate text="Its suitable to all devices and screens" />
            </p>
            <div className="flex justify-start items-start mb-[24px] mt-[10px]">
              <Link
                href="https://app.proptexx.com/"
                target="_blank"
                className="p-[15px_20px] max-w-[120px] justify-center items-center w-[100%] flex bg-white text-[#333333] rounded-[30px] mr-[20px]"
              >
                <Translate text="Try it" />
              </Link>
              <Link
                href="https://www.nexare.ai/contact-us"
                className="p-[15px_20px] flex max-w-[120px] justify-center items-center w-[100%] bg-black text-[#ffffff] rounded-[30px]"
              >
                <Translate text="Install it" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-[100%] justify-center items-center sm:mt-6 mt-28">
        <div className="ml-[auto] flex justify-center items-end flex-wrap">
          <img
            className="h-[50px] mr-[30px] sm:h-[20px]"
            src="/google.png"
            alt="google"
          />
          <img
            className="h-[30px] mr-[30px] sm:h-[20px]"
            src="/techstar.png"
            alt="techstars"
          />
          <img
            className="h-[30px] mr-[30px] sm:h-[20px]"
            src="/xreso.png"
            alt="xreso"
          />
          <img
            className="h-[40px] mr-[30px] sm:h-[20px]"
            src="/FTC-logo.png"
            alt="FTC-logo"
          />
          <img
            className="h-[22px] sm:h-[15px] mb-1"
            src="/reach.png"
            alt="reach-logo"
          />
        </div>
      </div>

      <div className="w-[100%]  border-t-[1px] mt-[10px] p-[20px_0px] border-[#c4c4c445]">
        <span className="text-[#797979] text-[0.9rem]">
        <Translate text="Copyright © PropTexx | Designed by PropTexx - Powered by PropTexx" />
          
        </span>
      </div>
    </footer>
  );
};

export default FooterPricing;
