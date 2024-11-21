import { whiteLabeled } from "@/utils/sampleData";
import { Tooltip } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
  ReactCompareSliderImage,
} from "react-compare-slider";
import CTAModal from "./CTAModal";
import TooltipThemeProvider from "./TooltipThemeProvider";
import { useSelector } from "react-redux";
import Translate from "./Translate";
import "../styles/step1.css";
import "../styles/theme.css";
import { useDispatch } from "react-redux";
import { setUser } from "@/Redux/slices/authSlice";

const StepOne = ({
  currentIndex,
  setCurrentIndex,
  mainText,
  handlePositionChange,
  handleBackClick,
  handleForwardClick,
  getRootProps,
  getInputProps,
  isDragActive,
  selectedImage,
  handelImageSelect,
  handleImageClick,
  sliderPosition,
  setIsVisible,
  isVisible,
  downSlide,
  lastClicked,
  imageUrlsBefore2,
  free,
  stepsData,
  modelName,
  NameModel,
  imageUrlsBefore,
  imageUrlsAfter,
  loading,
  isDemo
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSelected, setSelected] = useState(false);
  const userDetail = useSelector((state) => state.auth.user);
  const filterStyle = 'brightness(0) saturate(100%) invert(55%) sepia(97%) saturate(1383%) hue-rotate(174deg) brightness(85%) contrast(90%)';
  const [themeColor, setThemeColor] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth.user);

  useEffect(() => {
    console.log('name model', NameModel);
    const currentUrl = window.location.href;
    switch (true) {
      case currentUrl.includes('exp'):
        setThemeColor('bg-exp')
        break;
      case currentUrl.includes('viking'):
        setThemeColor('bg-viking')
        break;
      case currentUrl.includes('kwcp'):
        setThemeColor('bg-kwcp')
        break;
      case currentUrl.includes('cb'):
        setThemeColor('bg-cb')
        break;
      case currentUrl.includes('c21'):
        setThemeColor('bg-c21')
        break;
      case currentUrl.includes('realsmart'):
        setThemeColor('bg-realsmart')
        break;
      default:
        setThemeColor('bg-Color')
        console.warn('No matching provider found.');
    }
  }, [])

  // const getUser = async() => {
  //   console.log('1');
	// 	const userRef = "ilist-0001969";
  //   let userData = {
  //     "userRef": userRef,
  //   }
  //   await fetch('http://localhost:5000/api/getDetails',
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(userData)
  //     }
  //   )
  //   .then((res) => res.json())
  //   .then((data) => {
  //     if (data.success) {
  //       console.log('data result', data)
  //     } else {
  //       toast.error("Failed to upload");
  //     }
  //   })
	// }

  // const registerUser = async() => {
  //   const response = await fetch('http://localhost:5000/api/getUserDetail',
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   console.log('response', response);
  //   if (response) {
  //     const data = await response.json();
  //     console.log("getDetails", data);
  //     dispatch(
  //       setUser({
  //         user: data?.user,
  //       })
  //     );
  //   }
  // }

  // const showUser = () => {
  //   console.log('user', user);
  // }

  const handleSelect = () => {
    setSelected(!isSelected);
  }

  let appimg = "";
  if (pathname == "/virtual-renovation") {
    appimg = "renovation_images";
  } else if (pathname == "/virtual-staging") {
    appimg = "virtualhome_img";
  } else if (pathname == "/virtual-refurnishing") {
    appimg = "refurnishinghome_img";
  }
  return (
    <div>
      <p className="reviewresultstyledPara">
        <Translate text={mainText} />
      </p>
      <div className="flex flex-col-reverse gap-5 md:!grid md:!grid-cols-[1fr,300px] md:!gap-12 md:!mt-3.5">
        {pathname != "/image_caption" ? (
          <div className="FirstPageDivleft">
            <p className={`example-gallery font-medium !font-allround ${themeColor} !mb-0 text-sm p-[15px_20px] text-white rounded-[10px_10px_0px_0px]`}>
              <Translate text="Example Gallery" />
            </p>
            <div className="cardsBoxDivfirstPage">
              <div className="beforeAfterBoxadvancefirstPage">
                <ReactCompareSlider
                  handle={
                    <ReactCompareSliderHandle
                      buttonStyle={{
                        backdropFilter: " brightness()",
                        border: 0,
                        color: "white",
                        background: "black",
                        border:
                          "0.1041666667vw                                                        solid var(--neutrals-white, #FFF)",
                      }}
                    />
                  }
                  itemOne={
                    <ReactCompareSliderImage
                      src={imageUrlsBefore[currentIndex]}
                      className="object-cover object-center"
                    />
                  }
                  itemTwo={
                    <ReactCompareSliderImage
                      src={imageUrlsAfter[currentIndex]}
                      className="object-cover object-center"
                    />
                  }
                  onPositionChange={handlePositionChange}
                  className="flex w-full h-full"
                />
                <p
                  className={`rounded absolute text-[0.65rem] font-medium bottom-2.5 left-2.5 bg-white w-[50px] h-5 text-black flex justify-center items-center font-[Inter] leading-[150%] ${sliderPosition < 9.57 ? "opacity-0" : "opacity-100"
                    }`}
                >
                  <Translate text="Before" />
                </p>
                <p
                  className={`rounded absolute text-[0.65rem] font-medium bottom-2.5 right-2.5 bg-white w-[50px] h-5 text-black flex justify-center items-center font-[Inter] leading-[150%] ${sliderPosition > 90.43 ? "opacity-0" : "opacity-100"
                    }`}
                >
                  <Translate text="After" />
                </p>
              </div>
            </div>
            <div className="pageDiv">
              <div className="pageDivsvg" onClick={handleBackClick}>
                <svg
                  viewBox="0 0 26 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.9548 18.5566L7.688 10.8378C7.42393 10.6042 7.31222 10.2996 7.31222 9.99995C7.31222 9.70034 7.42333 9.39667 7.64544 9.16206L14.9548 1.44331C15.422 0.954285 16.1939 0.933972 16.6814 1.39557C17.1739 1.85921 17.1892 2.63362 16.7271 3.11909L10.2118 9.99995L16.7321 16.8808C17.1939 17.3664 17.1765 18.1376 16.6845 18.6043C16.1939 19.0644 15.422 19.0441 14.9548 18.5566Z"
                    fill={lastClicked === "back" ? "#000000" : "#777E91"}
                  />
                </svg>
              </div>
              <span className="pageDivSpan">
                {currentIndex + 1} of {imageUrlsBefore.length}
              </span>
              <div className="pageDivsvg " onClick={handleForwardClick}>
                <svg
                  viewBox="0 0 26 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.0452 1.44341L18.312 9.16216C18.5761 9.39575 18.6878 9.70044 18.6878 10.0001C18.6878 10.2997 18.5767 10.6033 18.3546 10.8379L11.0452 18.5567C10.578 19.0457 9.80614 19.066 9.31864 18.6044C8.82606 18.1408 8.81083 17.3664 9.27294 16.8809L15.7882 10.0001L9.26786 3.11919C8.80606 2.63362 8.82353 1.86236 9.31547 1.39568C9.80614 0.935598 10.578 0.955912 11.0452 1.44341Z"
                    fill={lastClicked === "forward" ? "#000000" : "#777E91"}
                  />
                </svg>
              </div>
            </div>
            <div className="lineFirstPage"></div>
            <div className="picsBoxDiv">
              {imageUrlsBefore.map((url, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`picbox ${index === currentIndex
                    ? "border-[2px] !border-mainColor"
                    : ""
                    } ${index === currentIndex ? "rounded" : ""}`}
                >
                  <img src={url} alt="" />
                </div>
              ))}
            </div>
          </div>
        ) : !free || userDetail?.user?.usercredit?.[NameModel] === 1 ? (
          <button
            {...getRootProps()}
            className="!mt-[40px] !bg-[#f9fdff] border-[1px] flex justify-center items-center flex-col p-[10px]"
          >
            <img
              src="images/dragndrop.png"
              className="h-[100px]"
              alt="dragndro"
            />
            <strong className="mt-[20px] text-[1.4rem] text-[#4b4b51]">
              <Translate text="Drag & Drop" />
            </strong>
            <p className="text-[14px] text-[#606060] font-light mt-[5px]">
              <Translate text="You can also browse for files" />
            </p>
            <span className="!bg-mainColor max-w-[220px] h-[41px] w-[100%] rounded-[5px] font-medium text-[14px] mt-[10px] text-[#ffffff] flex justify-center items-center">
              <Translate text="Upload your own photo1" />
            </span>
          </button>
        ) : (
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
                      <Translate text="Login to upload photo" />
                    ) : (
                      <Translate
                        text={
                          free && !userDetail?.token
                            ? "Try your image for free"
                            : "Upgrade plan"
                        }
                      />
                    )}
                  </button>
                  <p className="text-bold">
                    <Translate text="Get access to cutting-edge AI models" />
                  </p>
                </div>
              }
            >
              <div
                className="uploadImageInner !bg-[#f9fdff] !mt-[40px] border-[1px] border-dashed border-gray-400 image-captiom-upload-btn flex justify-center items-center flex-col"
                onClick={() => {
                  if (whiteLabeled) router.push("/login");
                  else setOpen(true);
                }}
              >
                <img
                  src="images/dragndrop.png"
                  className="h-[100px]"
                  alt="dragndro"
                />
                <strong className="mt-[20px] text-[1.4rem] text-[#4b4b51]">
                  <Translate text="Drag & Drop" />
                </strong>
                <p className="text-[#606060] font-light mt-[5px]">
                  <Translate text="You can also browse for files" />
                </p>
                <span className="!bg-mainColor max-w-[220px] h-[41px] w-[100%] rounded-[5px] text-[#ffffff] flex justify-center items-center">
                  <Translate text="Upload your own photo2" />
                  <svg
                    className="ml-[10px]"
                    width="14"
                    height="18"
                    viewBox="0 0 14 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_1097_12912)">
                      <path
                        d="M2.86444 7.01689V5.52939C2.86444 3.06479 4.71684 1.06689 7.00002 1.06689C9.28321 1.06689 11.1356 3.06479 11.1356 5.52939V7.01689H11.5951C12.6089 7.01689 13.4332 7.9063 13.4332 9.00023V14.9502C13.4332 16.0442 12.6089 16.9336 11.5951 16.9336H2.40493C1.3897 16.9336 0.566895 16.0442 0.566895 14.9502V9.00023C0.566895 7.9063 1.3897 7.01689 2.40493 7.01689H2.86444ZM4.70248 7.01689H9.29757V5.52939C9.29757 4.16027 8.26942 3.05023 7.00002 3.05023C5.73063 3.05023 4.70248 4.16027 4.70248 5.52939V7.01689Z"
                        fill={"#ffffff"}
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
                </span>
              </div>
            </Tooltip>
          </TooltipThemeProvider>
        )}
        <div className="FirstPageDivRight">
          <div className="uploadimageDivbox">
            <input {...getInputProps()} type="file" />
            <div>
              {isDragActive ? (
                <Translate text="Drop the files here ..." />
              ) : (
                <div className="text-center">
                  <span className="ourGalaryIn !text-white !font-allround">
                    <Translate text={`Try ${modelName} from our gallery`} />
                  </span>
                  <div className="gridForGalary">
                    {imageUrlsBefore2.map((image, index) => (
                      <div
                        key={index}
                        className={`picBoxGalaryincard ${image === selectedImage
                          ? " border-[3px] !border-white"
                          : ""
                          }`}
                        onClick={() => handelImageSelect(image, index)}
                        onContextMenu={(e) => e.preventDefault()} // Prevent context menu from appearing
                      >
                        <img
                          src={image}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    disabled={
                      !selectedImage ||
                        (modelName === "staging" && !userDetail.token)
                        ? true
                        : false
                    }
                    className="trystagingNOw !bg-[#3A393A]"
                    onClick={() => {
                      handleImageClick();
                    }}
                  >
                    {loading && isDemo ? (
                      <div
                        className="spinner spinnergoogle mx-3"
                        id="spinner"
                      ></div>
                    ) : (
                      <Translate text={`Try ${modelName} now`} />
                    )}
                  </button>
                  <button
                    {...getRootProps()}
                    className="uploadImageInner border-[1px] !text-[#3A393A]"
                  >
                    {loading && !isDemo ? (
                      <div
                        className="spinner spinnergoogle mx-3"
                        id="spinner"
                      ></div>
                    ) : (
                      <Translate text="Upload your own photo" />
                    )}
                  </button>
                  {/* <button
                    onClick={getUser}
                    className="uploadImageInner border-[1px] !text-[#3A393A]"
                  >
                    <Translate text="Get user info" />
                  </button>
                  <button
                    onClick={() => {
                      registerUser();
                    }}
                    className="uploadImageInner border-[1px] !text-[#3A393A]"
                  >
                    <Translate text="Get user info" />
                  </button>
                  <button
                    onClick={() => {
                      showUser();
                    }}
                    className="uploadImageInner border-[1px] !text-[#3A393A]"
                  >
                    <Translate text="show info" />
                  </button> */}
                  <CTAModal
                    isFree={
                      free &&
                      userDetail?.token &&
                      userDetail?.user?.usercredit?.[NameModel] == 0
                    }
                    open={open}
                    setOpen={setOpen}
                    stepsData={stepsData}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col-reverse gap-5 md:!grid md:!grid-cols-[1fr,300px] md:!mt-3.5">
        <div className="table-header gap-5">
          <div className='header-element flex items-center justify-center rounded-2xl' style={{ border: '2px solid #E7F1F9' }}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2.5">
                <img src="/photo-enhancement.png" alt="Grass Leaves" style={{ filter: filterStyle, width: '20px', height: '20px' }} />
              </div>
              <div className='text-center'>General Enhancement</div>
            </div>
          </div>
          <div className='header-element flex items-center justify-center rounded-2xl' style={{ border: '2px solid #E7F1F9' }}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2.5">
                <img src="/sky-replacement.png" alt="Grass Leaves" style={{ filter: filterStyle, width: '20px', height: '20px' }} />
              </div>
              <div className='text-center'>Sky Replacement</div>
            </div>
          </div>
          <div className='header-element flex items-center justify-center rounded-2xl' style={{ border: '2px solid #E7F1F9' }}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2.5">
                <img src="/grass-leaves-svgrepo-com.png" alt="Grass Leaves" style={{ filter: filterStyle, width: '20px', height: '20px' }} />
              </div>
              <div className='text-center'>Grass Repair</div>
            </div>
          </div>
          <div className='header-element relative flex items-center justify-center rounded-2xl' style={{ border: '2px solid #E7F1F9' }}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2.5">
                <img src="/virtual.png" alt="Grass Leaves" style={{ filter: filterStyle, width: '20px' }} />
              </div>
              <div className='text-center'>Virtual Staging</div>
            </div>
            <img className="new-badge absolute" src="/new.png" alt="new" />
          </div>
          <div className='header-element flex items-center justify-center rounded-2xl relative' style={{ border: '2px solid #E7F1F9' }}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2.5">
                <img src="/virtual.png" alt="Grass Leaves" style={{ filter: filterStyle, width: '20px', height: '20px' }} />
              </div>
              <div className='text-center'>Virtual Refurnishing</div>
            </div>
            <img className="coming-soon-badge absolute" src="/coming-soon.png" alt="coming soon" />
          </div>
        </div>
      </div>

      <div className="pics-row flex items-center gap-5 md:!grid-cols-[1fr,300px] md:!mt-3.5">
        <div className={`pics-box flex items-center justify-center ${isSelected ? 'hover' : ''}`} onClick={handleSelect}>
          <img className={`${isSelected ? 'hover' : ''}`} src="/selected.png" alt="selected image"></img>
        </div>
        <div className={`pics-box flex items-center justify-center ${isSelected ? 'hover' : ''}`} onClick={handleSelect}>
          <img className={`${isSelected ? 'hover' : ''}`} src="/selected.png" alt="selected image"></img>
        </div>
      </div> */}

      <p className="notSurePara">
        <Translate text="Not sure how to use our tool? Check out our guide" />
      </p>
      <div className="firstPageDownSide">
        <div
          className="firstpagefirstLine cursor-pointer"
          onClick={() => setIsVisible(!isVisible)}
        >
          <img src="/iicon.png" alt="" style={{ filter: "grayscale(100%)" }} />
          <p className="howtoUsePara">
            <Translate text="How to use the " />
            <span>
              <Translate text={modelName} />
            </span>
            <Translate text=" tool" />
          </p>
          <img
            src="/angle-down.png"
            className={`${isVisible ? "rotate-180" : "transform-none"
              } cursor-pointer`}
            alt=""
            style={{ filter: "grayscale(100%)" }}
          />
        </div>
        {isVisible && (
          <div className="mt-8 flex justify-between items-center flex-col sm:!flex-row gap-5">
            {downSlide?.toolSteps?.map((item, index) => (
              <div
                key={index}
                className={`${[
                  "/enhance/photo",
                  "/enhance/sky",
                  "/enhance/grass",
                  "/image_caption",
                ].includes(pathname)
                  ? "min-h-[450px]"
                  : "h-98"
                  } firstCardBoxSecond`}
              >
                {[
                  "/enhance/photo",
                  "/enhance/sky",
                  "/enhance/grass",
                  "/image_caption",
                  "/smart-detection",
                  "/image-compliance",
                ].includes(pathname) ? (
                  <div className="h-80 flex justify-center items-center">
                    <img className="h-full" src={item.image} alt="" />
                  </div>
                ) : (
                  <div className="h-36 flex justify-center items-center">
                    <img className="" src={item.image} alt="" />
                  </div>
                )}
                <div className="flex items-start flex-col gap-2.5 p-5">
                  <p className="step1parasecond">
                    <Translate text={`Step ${index + 1}`} />
                  </p>
                  <p className="step1para2second">
                    <Translate text={item.title} />
                  </p>
                  <p className="step1para3second2">
                    <Translate text={item.des} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepOne;
