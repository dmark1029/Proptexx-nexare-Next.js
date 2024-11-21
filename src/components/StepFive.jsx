import React, { useState } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import LinearWithValueLabel from "@/utils/LinearWithValueLabel";
import { setUser } from "@/Redux/slices/authSlice";
import TooltipThemeProvider from "./TooltipThemeProvider";
import { Tooltip } from "@mui/material";
import CTAModal from "./CTAModal";
import { whiteLabeled } from "@/utils/sampleData";
import Translate from "./Translate";
import SliderImage from "./SliderImage";

const StepFive = ({
  modelName,
  finalImage,
  selectedImage,
  handlePositionChange,
  sliderPosition,
  imageDownload,
  progress,
  btn,
  setStep,
  step,
  free,
  stepsData,
  SetFinalImage,
  NameModel,
  upload,
  setUpload,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const download_url = `${process.env.NEXT_PUBLIC_API_URI}/api/models/downloadimage?links=`;
  const userDetail = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const [finalImageIndex, setFinalImageIndex] = useState(0);

  const handleDownload = async () => {
    await fetch(`${download_url}${imageDownload}&modelName=${NameModel}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userDetail?.token}`,
      },
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          const errorres = await response.json();
          if (errorres.message === "no credits") {
            router.push(`/plans?link=${imageDownload}`);
          } else {
            console.log("not downloaded");
          }
        }
      })
      .then((data) => {
        if (data?.success) {
          setUpload(false);
          letsDownload(data.image);
          if (userDetail?.user?.usercredit?.[NameModel] && free) {
            dispatch(
              setUser({
                ...userDetail,
                user: {
                  ...userDetail.user,
                  usercredit: {
                    ...userDetail?.user?.usercredit,
                    [NameModel]: 0,
                  },
                },
              })
            );
          }
          // else {
          //   dispatch(
          //     setUser({
          //       ...userDetail,
          //       user: {
          //         ...userDetail.user,
          //         creditsPerMonth: userDetail.user.creditsPerMonth - 1,
          //       },
          //     })
          //   );
          // }
        } else {
          console.log(data?.message);
        }
      });
  };
  const letsDownload = async (image) => {
    const link = document.createElement("a");
    link.download = "image.jpg";
    let result;
    if (Array.isArray(image)) {
      result = image[finalImageIndex];
    } else {
      result = image;
    }
    link.href = await toDataURL(result);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    router.push("/");
  };
  const toDataURL = async (url) => {
    return await fetch(url)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        return URL.createObjectURL(blob);
      });
  };
  return (
    <>
      <p className="font-roboto font-normal text-[#404256] text-[0.86rem] mt-2.5">
        <Translate text="Please review and confirm the" />{" "}
        <span>{modelName}</span> <Translate text="result. Alternatively, " />
        <Translate text="you can regenerate again" />
      </p>
      <div className="w-full mt-5 flex justify-center items-center space-x-[1.5625vw]">
        {progress === 100 ? (
          [
            "/decluttering-and-staging",
            "/virtual-staging",
            "/virtual_staging",
          ].includes(pathname) && Array.isArray(finalImage) ? (
            <SliderImage
              handlePositionChange={handlePositionChange}
              selectedImage={selectedImage}
              finalImage={finalImage}
              sliderPosition={sliderPosition}
              setFinalImageIndex={setFinalImageIndex}
            />
          ) : (
            <div className="flex justify-center items-center relative">
              <ReactCompareSlider
                handle={
                  <ReactCompareSliderHandle
                    buttonStyle={{
                      backdropFilter: " brightness()",
                      border: 0,
                      height: "100%",
                      width: "100%",
                      color: "white",
                      background: "black",
                      border:
                        " 0.1041666667vw solid var(--neutrals-whiteT, #FFF)",
                    }}
                    style={{ color: "black" }}
                  />
                }
                itemOne={
                  <ReactCompareSliderImage
                    src={selectedImage}
                    className="h-full w-full flex"
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={finalImage}
                    className="h-full w-full flex"
                  />
                }
                onPositionChange={handlePositionChange}
                className="flex h-[auto]"
              />
              <p
                className="absolute text-xs bottom-2.5 left-2.5 px-4 rounded bg-white w-15 h-5 text-black flex items-center justify-center font-inter"
                style={{
                  opacity: sliderPosition < 8.4 ? 0 : 1,
                }}
              >
                <Translate text="Before" />
              </p>
              <p
                className="absolute text-xs bottom-2.5 right-2.5 px-4 rounded bg-white w-15 h-5 text-black flex items-center justify-center font-inter"
                style={{
                  opacity: sliderPosition > 91.6 ? 0 : 1,
                }}
              >
                <Translate text="After" />
              </p>
            </div>
          )
        ) : (
          <>
            <div className="flex justify-center flex-col w-full top-[0.57vw]">
              <LinearWithValueLabel value={progress} />
              <img
                style={{
                  height: "190px",
                  margin: "50px auto",
                  objectFit: "contain",
                  filter: "brightness(0%)",
                }}
                src={
                  whiteLabeled
                    ? "/images/redfin-loading.gif"
                    : "/loading-nexare.gif"
                }
                alt=""
              />
            </div>
            <div></div>
          </>
        )}
      </div>

      <div className="flex flex-col w-full sm:!flex-row justify-between items-center gap-5 !mt-3.5 m-auto max-w-[800px]">
        {!["/enhance/photo", "/enhance/grass", "/enhance/sky"].includes(
          pathname
        ) && (
          <>
            {free && !userDetail?.user?.usercredit?.[NameModel] ? (
              <TooltipThemeProvider>
                <Tooltip
                  TransitionProps={{ timeout: 600 }}
                  title={
                    <div className="w-56 p-3">
                      <button
                        className="!bg-mainColor text-sm  text-white w-full py-1.5 mb-4 mt-2 rounded"
                        onClick={() => {
                          if (whiteLabeled) router.push("/login");
                          else setOpen(true);
                        }}
                      >
                        {whiteLabeled ? (
                          <Translate text="Login to download" />
                        ) : (
                          <Translate text="Upgrade Plan" />
                        )}
                      </button>
                      <p className="text-bold">
                        <Translate text="Get access to regenerate feature" />
                      </p>
                    </div>
                  }
                >
                  <button
                    hidden={btn}
                    onClick={() => setOpen(true)}
                    className="cursor-pointer w-full h-9 rounded-lg !bg-mainColor text-white font-inter font-semibold text-sm hover:!shadow-custom disabled:!bg-[#777e91] disabled:text-[#ddd] disabled:cursor-not-allowed"
                  >
                    <Translate text="I don’t like the output, regenerate" />
                  </button>
                </Tooltip>
              </TooltipThemeProvider>
            ) : (
              <button
                hidden={btn}
                onClick={() => {
                  setStep(step + 1);
                }}
                disabled={btn}
                className="cursor-pointer w-full h-9 rounded-lg !bg-mainColor text-white font-inter font-semibold text-sm hover:!shadow-custom disabled:!bg-[#777e91] disabled:text-[#ddd] disabled:cursor-not-allowed"
              >
                <Translate text="I don’t like the output, regenerate" />
              </button>
            )}
          </>
        )}
        <button
          hidden={btn}
          disabled={btn}
          onClick={() => {
            setStep(1);
            SetFinalImage("");
          }}
          className="cursor-pointer !text-mainColor w-full h-9 rounded-lg border-[0.0520833333vw] !border-mainColor bg-white text-accent font-inter font-semibold text-sm hover:!shadow-md disabled:!bg-[#777e91] disabled:text-[#ddd] disabled:cursor-not-allowed"
        >
          <Translate text="I want to try on a new image" />
        </button>
        {(free && !userDetail?.user?.usercredit?.[NameModel] && !upload) ||
        !userDetail?.token ? (
          <TooltipThemeProvider>
            <Tooltip
              TransitionProps={{ timeout: 600 }}
              title={
                <div className="w-56 p-3">
                  <button
                    className="!bg-mainColor text-sm  text-white w-full py-1.5 mb-4 mt-2 rounded"
                    onClick={() => {
                      if (whiteLabeled) router.push("/login");
                      else setOpen(true);
                    }}
                  >
                    {whiteLabeled ? "Login to download" : "Upgrade Plan"}
                  </button>
                  <p className="text-bold">
                    <Translate text="Get access to cutting-edge AI models" />
                  </p>
                </div>
              }
            >
              <button
                hidden={btn}
                onClick={() => {
                  if (whiteLabeled) router.push("/login");
                  else setOpen(true);
                }}
                className="cursor-pointer w-full h-9 rounded-lg !bg-mainColor text-white font-inter font-semibold text-sm hover:!shadow-custom disabled:!bg-[#777e91] disabled:text-[#ddd] disabled:cursor-not-allowed"
              >
                <p className="flex justify-center items-center gap-2">
                  <svg
                    width="14"
                    height="18"
                    viewBox="0 0 14 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_1097_12912)">
                      <path
                        d="M2.86444 7.01689V5.52939C2.86444 3.06479 4.71684 1.06689 7.00002 1.06689C9.28321 1.06689 11.1356 3.06479 11.1356 5.52939V7.01689H11.5951C12.6089 7.01689 13.4332 7.9063 13.4332 9.00023V14.9502C13.4332 16.0442 12.6089 16.9336 11.5951 16.9336H2.40493C1.3897 16.9336 0.566895 16.0442 0.566895 14.9502V9.00023C0.566895 7.9063 1.3897 7.01689 2.40493 7.01689H2.86444ZM4.70248 7.01689H9.29757V5.52939C9.29757 4.16027 8.26942 3.05023 7.00002 3.05023C5.73063 3.05023 4.70248 4.16027 4.70248 5.52939V7.01689Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1097_12912">
                        <rect
                          width="13"
                          height="17"
                          fill="white"
                          transform="translate(0.5 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <span>
                    {!userDetail?.token ? (
                      <Translate text="Sign up to download image" />
                    ) : (
                      <Translate text="Upgrade to download image" />
                    )}
                  </span>
                </p>
              </button>
            </Tooltip>
          </TooltipThemeProvider>
        ) : (
          <button
            hidden={btn}
            onClick={() => {
              letsDownload(imageDownload)
            }}
            className="cursor-pointer w-full h-9 rounded-lg !bg-mainColor text-white font-inter font-semibold text-sm hover:!shadow-custom"
          >
            <Translate text="Confirm image & download" />
          </button>
        )}
        <CTAModal
          open={open}
          setOpen={setOpen}
          stepsData={stepsData}
          free={free}
        />
      </div>
    </>
  );
};
export default StepFive;
