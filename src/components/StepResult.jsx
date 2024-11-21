"use Client"
import React, { useEffect, useState } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import TooltipThemeProvider from "./TooltipThemeProvider";
import { Tooltip } from "@mui/material";
import CTAModal from "./CTAModal";
import { whiteLabeled } from "@/utils/sampleData";
import Translate from "./Translate";
import SliderImage from "./SliderImage";
import "../styles/stepResult.css";
import "../styles/theme.css";
import { toast } from "react-toastify";

const StepResult = ({
  finalImages,
  selectedImage,
  handlePositionChange,
  sliderPosition,
  btn,
  setStep,
  free,
  stepsData,
  SetFinalImage,
  NameModel,
  upload,
  selectedPairs,
  regenerate,
  setIsDemo,
  isDemo,
  step,
  crmToken,
}) => {

  useEffect(() => {
    setPreviewIndex(0);
    let url = window.location.href;
    const firstPair = selectedPairs[0];
    const firstIndex = firstPair[0];
    console.log('first pair', firstPair, selectedImage, finalImages);

    setPrevImg(selectedImage[firstIndex]);
    switch (true) {
      case url.includes('exp'):
        setThemeColor('bg-exp');
        break;
      case url.includes('viking'):
        setThemeColor('bg-viking');
        break;
      case url.includes('kwcp'):
        setThemeColor('bg-kwcp');
        break;
      case url.includes('cb'):
        setThemeColor('bg-cb');
        break;
      case url.includes('c21'):
        setThemeColor('bg-c21');
        break;
      case url.includes('realsmart'):
        setThemeColor('bg-realsmart');
        break;
      case url.includes('realty'):
        setThemeColor('bg-realty');
        break;
      default:
        setThemeColor('bg-Color')
        console.warn('No matching provider found.');
    }
  }, [])

  useEffect(() => {
    const emptyIndexes = finalImages
      .map((image, index) => (image === '' ? index : null))
      .filter((index) => index !== null);
    setDisabledIndex(emptyIndexes);
  }, [finalImages]);

  const router = useRouter();
  const userDetail = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [resultIndex, setResultIndex] = useState(0);
  const [activePairIndex, setActivePairIndex] = useState([]); // active indexes for final images
  const [reqImages, setReqImages] = useState([]);
  const [listingId, setListingId] = useState('');
  const [prevImg, setPrevImg] = useState('');
  const [nextImg, setNextImg] = useState('');
  const [themeColor, setThemeColor] = useState('');
  const [disabledIndex, setDisabledIndex] = useState([]);
  const [uploadedImageIndexes, setUploadedImageIndexes] = useState([]);
  const [numOfUpload, setNumOfUpload] = useState(0);
  const [pairs, setPairs] = useState([]); // selected images to upload
  const [disableUpload, setDisableUpload] = useState(false);

  const showSelectedImgResult = (index, finalIndex) => {
    console.log('selected pairs', activePairIndex, pairs);
    setPreviewIndex(index);
    setResultIndex(finalIndex);
    setActivePairIndex((prev) =>
      prev.includes(finalIndex)
        ? prev.filter((index) => index !== finalIndex)
        : [...prev, finalIndex]
    );
    setPrevImg(selectedImage[index]);
    setNextImg(finalImages[finalIndex]);

    if (disabledIndex.includes(finalIndex)) {
      toast.error("This image can't be uploaded.");
      return;
    }
    setPairs(prevPairs => {
      const newPair = [index, finalIndex];
      const pairIndex = prevPairs.findIndex(
        (pair) => pair[0] === index && pair[1] === finalIndex
      );
      if (pairIndex !== -1) {
        const newPairs = [...prevPairs];
        newPairs.splice(pairIndex, 1);
        return newPairs;
      } else {
        return [...prevPairs, newPair];
      }
    });
  }

  const getPictureId = async (hostURL, detailImages, prev) => {
    if (!Array.isArray(detailImages) || detailImages.length === 0) {
      console.warn('detailImages is empty or not an array.');
    }
    let foundImage = ''
    foundImage = detailImages.find(
      (img) => img.imageURL === prev || img.imageUrl === prev
    );
    if (!foundImage) {
      foundImage = detailImages[previewIndex];
      console.warn(`No matching image found for prev: ${prev}`);
    }
    return hostURL.includes('ilist') ? foundImage.imageRef : foundImage.id;
  };

  const uploadImages = async () => {
    console.log('num of uploaded', numOfUpload, pairs);
    if (numOfUpload > 2) {
      toast.error("You have already uploaded 3 images.");
      setDisableUpload(true);
      return;
    }

    const filteredPairs = pairs.filter(([_, secondIndex], index) => {
      if (uploadedImageIndexes.includes(secondIndex)) {
        toast.error(`The image ${secondIndex + 1} is already uploaded.`);
        return false;
      }
      return true;
    });

    if (filteredPairs.length > 3) {
      toast.error("You can upload only 1 ~ 3 images.");
      return;
    }

    if (filteredPairs.length === 0) {
      toast.error("Please select an image to upload.");
      return;
    }

    let hostURL = window.location.href;
    console.log('upload started');
    let uploadUrl = '';
    let dataAPI = '';
    let listingId = '';
    let detailImages = [];

    // getting images details

    switch (true) {
      case hostURL.includes('ilist'):
        dataAPI = 'https://backend.proptexx.com/api/getDetailsIlist';
        break;
      case hostURL.includes('c21'):
        dataAPI = 'https://backend.proptexx.com/api/getDetailsC21';
        break;
      case hostURL.includes('cb'):
        dataAPI = 'https://backend.proptexx.com/api/getDetailsCb';
        break;
      case hostURL.includes('exp'):
        dataAPI = 'https://backend.proptexx.com/api/getDetailsExp';
        break;
      case hostURL.includes('kwcp'):
        dataAPI = 'https://backend.proptexx.com/api/getDetailsKwcp';
        break;
      case hostURL.includes('realsmart'):
        dataAPI = 'https://backend.proptexx.com/api/getDetailsRealsmart';
        break;
      case hostURL.includes('viking'):
        dataAPI = 'https://backend.proptexx.com/api/getDetailsViking';
        break;
      case hostURL.includes('realty'):
        dataAPI = 'https://backend.proptexx.com/api/getDetailsRealty';
        break;
      default:
        dataAPI = 'https://backend-rep.proptexx.com/api/getDetailsExp';
        setThemeColor('bg-Color')
        console.warn('No matching provider found.');
    }

    const response = await fetch(dataAPI,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log('response', response);
    if (response) {
      const data = await response.json();
      listingId = data.listingId;
      detailImages = data.images;
      console.log("getDetails", data.images);
    }
    const pictureIds = await Promise.all(
      filteredPairs.map(async ([firstIndex, secondIndex]) => {
        const firstPictureId = await getPictureId(
          hostURL,
          detailImages,
          selectedImage[firstIndex]
        );
        return firstPictureId;
      })
    );
    console.log('picture ids', pictureIds);
    uploadUrl = hostURL.includes('ilist') ? 'https://api.goiconnect.com/api/Listings/UploadImage' : 'https://api.realestateplatform.com/api/services/app/ReadOnly/UploadImage';
    await uploadImagesForPairs(filteredPairs, pictureIds, uploadUrl, listingId);
  }

  const uploadImagesForPairs = async (filteredPairs, pictureIds, uploadUrl, listingId) => {
    try {
      await Promise.all(
        filteredPairs.map(async ([_, secondIndex], index) => {
          const formData = {
            "listingId": listingId,
            "listingPictureId": pictureIds[index],
            "imageUrl": finalImages[secondIndex],
            "uploadUrl": uploadUrl
          };
          const response = await fetch('api/upload', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ formData, crmToken }),
          });

          const data = await response.json();
          if (data) {
            toast.success(`Image uploaded successfully.`);
            setNumOfUpload((prevNum) => prevNum + 1);
            setUploadedImageIndexes((prevIndexes) => [...prevIndexes, secondIndex]);
          } else {
            toast.error(`Image ${secondIndex + 1} upload failed. Please try again.`);
          }
        })
      );
    } catch (error) {
      toast.error(`Error during upload: ${error.message}`);
    }
  }

  return (
    <div className="min-[1240px]:flex justify-between max-w-[1400px] gap-10">
      <div className="">
        <div className="w-full flex items-center justify-between gap-5">
          <div className="flex items-center justify-center gap-5">
            <img src="/ai-logo.png" alt="Enhancement in process" />
            <p className="text-3xl max-[556px]:text-xl font-bold">
              <Translate text="Enhancement Results" />
            </p>
          </div>
          <button
            hidden={isDemo}
            onClick={regenerate}
            className={`cursor-pointer w-30 px-5 h-9 rounded-lg ${themeColor} text-white font-inter font-semibold text-sm hover:!shadow-custom`}
          >
            <Translate text="Regenerate" />
          </button>
        </div>
        {isDemo ? (
          <div className="w-[665px] max-[740px]:w-full mt-5 flex justify-center items-center space-x-[1.5625vw]">
            <div className="flex justify-center items-center relative w-full">
              <ReactCompareSlider
                handle={
                  <ReactCompareSliderHandle
                    buttonStyle={{
                      backdropFilter: " brightness()",
                      border: 0,
                      height: "400px",
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
                    className="h-[100rem] w-screen flex"
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={finalImages[resultIndex] ? finalImages[resultIndex] : selectedImage}
                    className="h-[100rem] w-screen flex"
                  />
                }
                onPositionChange={handlePositionChange}
                className="flex h-[auto] w-full"
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
          </div>
        ) : (
          <div className="w-[665px] max-[740px]:w-full mt-5 flex justify-center items-center space-x-[1.5625vw]">
            <div className="flex justify-center items-center relative w-full">
              <ReactCompareSlider
                handle={
                  <ReactCompareSliderHandle
                    buttonStyle={{
                      backdropFilter: " brightness()",
                      border: 0,
                      height: "400px",
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
                    src={prevImg}
                    className="h-[100rem] w-screen flex"
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={finalImages[resultIndex] ? finalImages[resultIndex] : prevImg}
                    className="h-[100rem] w-screen flex"
                  />
                }
                onPositionChange={handlePositionChange}
                className="flex h-[auto] w-full"
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
          </div>
        )}

      </div>
      <div className="w-full sm:!flex-row justify-between items-center gap-5 !mt-3.5 m-auto max-w-[800px]">
        <p>
          <Translate text="Choose an image to view the results or upload images to your listing." /><br />
          <Translate text="You may select 1 to 3 images to send back to the CRM." />
        </p>
        <div className="uploaded-image mb-10">
          <div className="pics-row grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:mt-5 gap-y-5 gap-x-5 my-2.5">
            {selectedPairs.map((pair, pairIndex) => {
              const imageIndex = pair[0];
              const modelIndex = pair[1];
              let modelName = '';
              switch (modelIndex) {
                case 0:
                  modelName = 'Photo Enhancement';
                  break;
                case 1:
                  modelName = 'Sky Replacement';
                  break;
                case 2:
                  modelName = 'Grass Repair';
                  break;
                case 3:
                  modelName = 'Virtual Staging';
                  break;
                default:
                  modelName = 'Virtual Refurnishing';
                  break;
              }
              return (
                <div
                  key={pairIndex}
                  className="converted-image m-auto"
                  onClick={() => {
                    showSelectedImgResult(imageIndex, pairIndex);
                  }}
                >
                  <img
                    className={`${activePairIndex.includes(pairIndex)
                      ? disabledIndex.includes(pairIndex)
                        ? 'disabled'
                        : 'active'
                      : ''
                      }`}
                    src={isDemo ? selectedImage : selectedImage[imageIndex]}
                    alt="selected image"
                  ></img>
                  <p className="text-xs text-center mt-1">
                    <Translate text={modelName} />
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-lg mb-4">
          <Translate text="Individual Selected Image" />
        </p>
        <div className="flex items-center justify-between gap-10">
          <button
            disabled={isDemo}
            onClick={() => uploadImages()}
            className={`${disableUpload ? 'cursor-not-allowed' : 'cursor-pointer'} w-full h-9 rounded-lg ${themeColor} text-white font-inter font-semibold text-sm hover:!shadow-custom`}
          >
            <Translate text="Use these images" />
          </button>
          {/* {(free && !userDetail?.user?.usercredit?.[NameModel] && !upload) ||
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
                      <Translate text="Back to First Step" />
                    </span>
                  </p>
                </button>
              </Tooltip>
            </TooltipThemeProvider>
          ) : (
            <button
              onClick={() => {
                setStep(1);
                setIsDemo();
              }}
              className={`cursor-pointer w-full h-9 rounded-lg ${themeColor} text-white font-inter font-semibold text-sm hover:!shadow-custom px-3`}
            >
              <Translate text="Back to the first step" />
            </button>
          )}
          <CTAModal
            open={open}
            setOpen={setOpen}
            stepsData={stepsData}
            free={free}
          /> */}
        </div>
      </div>
    </div>
  );
};
export default StepResult;
