"use client";
import React, { useState, useEffect } from "react";
import { RiGalleryFill } from "react-icons/ri";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { plansArray } from "@/utils/plansArray";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowBack } from "react-icons/io";
import { whiteLabeled } from "@/utils/sampleData";
import Translate from "@/components/Translate";
import ComparePrice from "@/components/ComparePrice";
import Section6 from "@/components/Section6";
import Link from "next/link";
import '../globals.css'

const Plans = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedOption, setSelectedOption] = useState("monthly");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hostUrl, setHostUrl] = useState('https://backend-rep.proptexx.com');
  const { user } = useSelector((state) => state.auth.user);
  const [themeColor, setThemeColor] = useState('');
  const [fontColor, setFontColor] = useState('');
  const [borderColor, setBorderColor] = useState('');

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(
    `${hostUrl}/api/plans/plans`,
    fetcher
  );

  useEffect(() => {
    console.log('user', user)
    if (user) {
      setPrice(user.price);
    }
    let url = window.location.href;
    url.includes('ilist') ? setHostUrl('https://backend.proptexx.com') : setHostUrl('https://backend-rep.proptexx.com')

    switch (true) {
      case url.includes('ilist'):
        setThemeColor('bg-ilist');
        setFontColor('text-ilist');
        setBorderColor('border-ilist');
        break;
      case url.includes('exp'):
        setThemeColor('bg-exp');
        setFontColor('text-exp');
        setBorderColor('border-exp');
        break;
      case url.includes('viking'):
        setThemeColor('bg-viking');
        setFontColor('text-viking');
        setBorderColor('border-viking');
        break;
      case url.includes('kwcp'):
        setThemeColor('bg-kwcp');
        setFontColor('text-kwcp');
        setBorderColor('border-kwcp');
        break;
      case url.includes('cb'):
        setFontColor('text-cb');
        setBorderColor('border-cb');
        setThemeColor('bg-cb')
        break;
      case url.includes('c21'):
        setFontColor('text-c21');
        setBorderColor('border-c21');
        setThemeColor('bg-c21')
        break;
      case url.includes('realsmart'):
        setFontColor('text-realsmart');
        setBorderColor('border-realsmart');
        setThemeColor('bg-realsmart')
        break;
      case url.includes('realty'):
        setFontColor('text-realty');
        setBorderColor('border-realty');
        setThemeColor('bg-realty')
        break;
      default:
        setThemeColor('bg-default');
        setBorderColor('border-default');
        setFontColor('text-default');
        console.warn('No matching provider found.');
    }
  }, []);
  const getPrice = (planType) => {
    const plan = data?.plans?.find((plan) => plan.type === planType)?.setting;
    const planPrice = plan?.[selectedOption]?.USD;
    const priceId = plan?.[selectedOption]?.priceId;
    const credits_per_month = plan?.credits_per_month;
    const creditCost =
      selectedOption === "monthly"
        ? planPrice / credits_per_month
        : planPrice / (12 * credits_per_month);
    return { credits_per_month, planPrice, creditCost, priceId };
  };

  const handlePaymentHandler = async (priceId, planName, credits, price) => {
    console.log('payment request detail', priceId, planName, credits, price);
    let currentUrl = window.location.href;
    let domain = '';
    switch (true) {
      case currentUrl.includes('ilist'):
        domain = 'ilist';
        break;
      case currentUrl.includes('c21'):
        domain = 'c21';
        break;
      case currentUrl.includes('cb'):
        domain = 'cb';
        break;
      case currentUrl.includes('exp'):
        domain = 'exp';
        break;
      case currentUrl.includes('kwcp'):
        domain = 'kwcp';
        break;
      case currentUrl.includes('realsmart'):
        domain = 'realsmart';
        break;
      case currentUrl.includes('viking'):
        domain = 'viking';
        break;
      default:
        domain = 'ilist';
    }
    try {
      let res;
      setLoading(true);
      let tempUrl = currentUrl.includes('ilist') ? 'https://backend.proptexx.com' : 'https://backend-rep.proptexx.com'
      // let tempUrl = 'http://localhost:5000';
      if (user?.planName === "free") {
        res = await axios.post(
          `${tempUrl}/api/payment/process/${domain}`,
          {
            priceId,
            planDuration: selectedOption,
            planName,
            credits,
            price,
            prevPlan: user?.planName,
            user, user
          },
        );
      } else {
        res = await axios.post(
          `${tempUrl}/api/payment/process/${domain}`,
          {
            priceId,
            planDuration: selectedOption,
            planName,
            credits,
            price,
            prevPlan: user?.planName,
            user: user
          },
        );
      }
      if (res.data?.success) {
        const plan = data?.plans?.find(
          (plan) => plan.type === planName
        )?.setting;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "purchase",
          ecommerce: {
            items: [
              {
                item_name: `${planName}_${selectedOption}`,
                price: `${plan?.[selectedOption]?.USD}`,
                currency: "USD",
              },
            ],
          },
        });
        if (user?.planName === "free") {
          router.push(res.data.result.url);
          setLoading(false);
        } else {
          router.push(
            `/success/${selectedOption}_${credits}_${price}_${planName}`
          );
          setLoading(false);
        }
      } else {
        toast.error(res.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error, "error");
      setLoading(false);
    }
  };

  const buttonText = (name) => {
    if (price > getPrice(name).planPrice) {
      return "Not available";
    } else if (price == getPrice(name).planPrice) {
      return "Current plan";
    } else if (name == "free") {
      return "Purchase";
    } else return "Upgrade";
  };
  // back button
  // const backBtn = () => {
  //     router.push("/");
  // };
  return (
    <div className="min-h-screen overflow-auto">
      <div className="px-[5%] lg:!px-[10%] xl:!px-[15%]">
        <div className="mt-8">
          <div className="w-36 h-10 cursor-pointer">
            <div
              className="flex items-center gap-1 mb-7"
              onClick={() => {
                router.push("/media-store");
              }}
            >
              <IoIosArrowBack size={32} color="#000000" />
              <span className="text-sm">
                <Translate text="Back to store" />
              </span>
            </div>
          </div>
          <div className="flex flex-col md:!flex-col lg:!flex-row lg:!justify-between items-center">
            <div>
              <h1 className="text-xl lg:!text-2xl font-[600]">
                <span>
                  <RiGalleryFill className="inline-block mr-2 !text-secondColor" />
                </span>
                <Translate text="Buy a plan to proceed" />
              </h1>
            </div>
            <div className="flex space-x-1 lg:!space-x-16">
              {/* Billing */}
              <div className="flex flex-col items-center">
                <div className="font-semibold inline mr-2 mb-2">
                  <Translate text="Plan" />
                </div>
                <div className={`flex border rounded-full h-8 ${borderColor} overflow-hidden`}>
                  <button
                    onClick={() => setSelectedOption("monthly")}
                    className={`flex-1 text-xs py-1 px-3 focus:outline-none ${selectedOption === "monthly"
                        ? `${themeColor} text-white`
                        : `!bg-white ${fontColor}`
                      }`}
                  >
                    <Translate text="Monthly" />
                  </button>
                  <button
                    onClick={() => setSelectedOption("annual")}
                    className={`flex-1 text-xs py-1 px-3 focus:outline-none
                    ${selectedOption === "annual"
                        ? `${themeColor} text-white`
                        : `!bg-white ${fontColor}`
                      }`}
                  >
                    <Translate text="Annual" />
                  </button>
                </div>
              </div>

              {/* Select Currency */}
              <div className="flex flex-col items-center">
                <span className="font-semibold inline mr-2 mb-2 ">
                  <Translate text="Select currency" />
                </span>
                <div className="relative inline-block text-left">
                  <div>
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="inline-flex justify-between items-center w-36 rounded-md border px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:!bg-gray-50 focus:outline-none"
                    >
                      {selectedCurrency === "USD" ? (
                        <img
                          src="/united-states1.png"
                          alt="USD Flag"
                          className="h-4"
                        />
                      ) : (
                        <img
                          src="https://dev-app.proptexx.ai//widget/images/flags/flag-eur.png"
                          alt="EUR Flag"
                          className="h-4"
                        />
                      )}
                      <span>{selectedCurrency}</span>
                      <svg
                        className="-mr-1 ml-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  {isOpen && (
                    <div className="z-10 origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <div
                          onClick={() => {
                            setSelectedCurrency("USD");
                            setIsOpen(false);
                          }}
                          className="flex items-center cursor-pointer px-4 py-2 text-sm text-gray-700 hover:!bg-gray-100 hover:!text-gray-900"
                          role="menuitem"
                        >
                          <img
                            src="/united-states1.png"
                            alt="USD Flag"
                            className="h-4 w-auto mr-2"
                          />
                          USD
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
        <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 mt-6">
          {plansArray?.map((item, index) => (
            <div
              className="py-[0px] px-6 sm:!mb-[25px] xs:!mb-[25px] transition-transform duration-500 transform hover:scale-105"
              key={index}
            >
              <div className="bg-Color rounded-lg overflow-hidden shadow-md hover:!shadow-xl cursor-pointer h-[500px] flex flex-col justify-between">
                <div>
                  <div className="!bg-Color text-white h-24">
                    <div className="py-3 flex justify-center items-center">
                      <h4 className="text-xl font-extrabold uppercase">
                        <Translate text={item?.name?.replace("_", " ")} />
                      </h4>
                    </div>
                    <h1 className="text-4xl text-center font-bold">
                      <span>$</span>
                      {getPrice(item.name)?.planPrice}
                      <sub className="text-xs">
                        {selectedOption == "monthly" ? (
                          <Translate text="per month" />
                        ) : (
                          <Translate text="per year" />
                        )}
                      </sub>
                    </h1>
                  </div>
                  <div className="px-4 text-center text-sm !bg-Color p-4 h-52">
                    <div className="px-4 text-sm !bg-Color p-3 flex justify-center items-center flex-col">
                      <div className="w-8 h-8 flex justify-center items-center border bg-Color rounded-full p-2">
                        <span className="!bg-Color text-white px-8 rounded-2xl p-2">
                          {getPrice(item.name).credits_per_month}
                        </span>
                      </div>
                      <p className="mt-4 font-bold text-lg text-white">
                        <Translate text="Photos per month" />
                      </p>
                      <p className="text-white">
                        {"("}${getPrice(item.name)?.creditCost?.toFixed(2)}
                        <span className="ml-[4px]">
                          <Translate text="per photo" />
                        </span>
                        {")"}
                      </p>
                    </div>

                    <p className="px-4 text-sm !bg-Color w-full text-white">
                      {item.desc}
                    </p>
                  </div>
                  <p className="text-center text-white text-sm h-24 flex justify-center items-center px-1">
                    <Translate text={`Great for ${item.redirection}`} />
                  </p>
                </div>
                <div className="text-center">
                  <button
                    disabled={
                      getPrice(item.name)?.planPrice <= price ? true : false
                    }
                    onClick={() =>
                      handlePaymentHandler(
                        getPrice(item.name)?.priceId,
                        item.name,
                        getPrice(item.name).credits_per_month,
                        getPrice(item.name)?.planPrice
                      )
                    }
                    className="w-11/12 m-2  rounded !border-mainColor border-[1px] bg-white !text-black text-center py-2 hover:!bg-neutral-400 hover:!text-white hover:!border-s-mainColor cursor-pointer transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Translate text={buttonText(item.name)} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="flex flex-col items-center justify-center mt-[100px] !mb-[200px]">
          <h3 className="font-[800] !font-allround text-[#242331] text-center text-[2.4rem] mb-[20px]">
            Pricing
          </h3>

          <div className="overflow-x-auto md:w-full">
            <div className="w-[1300px] mx-auto">
              <div className="flex gap-2.5 lg:gap-5 lg:px-5">
                {plansArray?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-start gap-[10px] bg-[#F9F9F9] rounded-[20px] w-full p-[30px_40px_30px_40px] h-auto">
                    <h3 className="font-[800] text-[35px] text-[#242331] capitalize text-center sm:text-[1.2rem]">
                      <Translate text={item?.name?.replace("_", " ")} />
                    </h3>
                    <div className="flex flex-col gap-[5px] border-t border-b border-[#D3D3D3] py-[10px]">
                      <strong className="text-center text-[#242331]">
                        <span className="font-[800] text-[18px]">$</span>
                        <span className="font-[800] text-[34px]">
                          {getPrice(item.name)?.planPrice}
                        </span>
                        <span className="font-[800] text-[18px]">
                          /
                          {selectedOption == "monthly" ? (
                            <Translate text="per month" />
                          ) : (
                            <Translate text="per year" />
                          )}
                        </span>
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
                    <button className="font-[700] text-[15px] text-[#242331] p-[20px_40px_20px_40px] rounded-[42px] border border-[#D3D3D3]">
                      Get Started
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> */}

        {/* <Section6 /> */}
        <ComparePrice />

        {loading ? (
          <div className="w-[100%] h-[100%] flex justify-center items-center fixed left-0 top-0 !bg-[#ffffff95]">
            <img
              className="h-[100%] w-[100%] object-contain object-center max-h-[150px]"
              src={
                whiteLabeled
                  ? "/images/redfin-loading.gif"
                  : "/loading-nexare.gif"
              }
              alt="loading"
              style={{ filter: "brightness(0%)" }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Plans;
