"use client";
import AuhtProvider from "@/components/AuthProvider";
import CTAModal from "@/components/CTAModal";
import StepOne from "@/components/StepOne";
import TooltipThemeProvider from "@/components/TooltipThemeProvider";
import Translate from "@/components/Translate";
import { altDummyImages, altDummytext } from "@/utils/imagesPath";
import { whiteLabeled } from "@/utils/sampleData";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../../styles/imageCaption.css";
import { setUser } from "@/Redux/slices/authSlice";

const VirtualRefurnishing = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth.user);

  let free = user?.planName == "free" || !token ? true : false;
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [generatedText, SetGeneratedText] = useState("Copied");
  const [isCopied, setIsCopied] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [btn, setBtn] = useState(true);
  const [backBtn, setBackBtn] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loadImg, setLoadImg] = useState(false);
  const [selectedImage, setSelectedImage] = useState(altDummytext[0].image);
  const [submit, setsubmit] = useState(false);
  const original = useRef(altDummytext[0].image);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(false);
  const onecredit = user?.usercredit?.altTextGeneratorCredit;
  const [upload, setUpload] = useState(false);

  //////////resize///////////////////////////////////////////////////////////////////////////
  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);

      image.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = image;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.75
        );
      };

      image.onerror = (err) => {
        reject(err);
        console.log(err, "error");
      };
    });
  };

  function generateRandomTimeName() {
    const timestamp = Date.now(); // Current time in milliseconds since 1970
    const randomNum = Math.floor(Math.random() * 1000); // Random number between 0 and 999
    return `${timestamp}-${randomNum}`;
  }

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    original.current = " ";
    if (file) {
      newFileUpload(file);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handelImageSelect = (image) => {
    original.current = image;
    setSelectedImage(image);
  };
  const copyToClipboard = () => {
    setOpen2(true);
    navigator.clipboard.writeText(generatedText);
    setIsCopied(true);
    setTimeout(() => {
      setOpen2(false);
      setIsCopied(false);
    }, 2000);
  };

  const newFileUpload = async (file) => {
    let fileimg = file;
    if (file && file.size > 1048576) {
      // 1 MB in bytes
      const resizedBlob = await resizeImage(file, 1920, 1920);
      const randomName = generateRandomTimeName();
      const resizedFile = new File([resizedBlob], `${randomName}${file.name}`, {
        type: "image/jpeg",
      });
      fileimg = resizedFile;
    }
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.type)) {
      setStep((prevStep) => prevStep + 1);
      setLoadImg(true);
      setBtn(true);
      SetGeneratedText("");
    } else {
      alert("Unsupport Format");
      return;
    }
    if (allowedTypes.includes(file.type)) {
      handelNewFileUpload(fileimg);
    } else {
      alert("Unsupport Format");
    }
  };

  const handelNewFileUpload = async (file) => {
    const ApiKey = "HLOH64Q4-20230313-OOQV9VVR";
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/api/models/uploadimage?modelName=altTextGeneratorCredit`,
      {
        method: "POST",
        headers: {
          "x-api-key": ApiKey,
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        original.current = data.fileurl;
        if (original.current) {
          setSelectedImage(data.fileurl);
          original.current = data.fileurl;
          setLoadImg(false);
          handelSubmit();
          if (onecredit) {
            setUpload(true);
          }
          dispatch(
            setUser({
              token,
              user: data?.user,
            })
          );
        } else {
          alert("Upload Failed");
          setStep(1);
          setLoadImg(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleImageClick = () => {
    setStep((prevStep) => prevStep + 1);
    setBtn(true);
    SetGeneratedText("");
    if (free && !onecredit && !upload) {
      handelSubmit2();
    } else {
      handelSubmit();
    }
  };

  const handelSubmit2 = async () => {
    const filterImage = altDummytext.find(
      (item, index) => item.image == selectedImage
    );

    setTimeout(() => {
      SetGeneratedText(filterImage.result);
      setBackBtn(false);
      setsubmit(false);
      setBtn(false);
    }, 2000);
  };

  const handelSubmit = async () => {
    setBackBtn(true);
    setBtn(true);
    if (submit == true) {
      return;
    }
    setsubmit(true);

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URI}/api/models/textgeneration`,
        {
          image_url: original.current,
          model: "alt_text",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data == undefined) {
          toast.error("Failed to generate image caption");
          setStep(1);
          setBtn(false);
          setBackBtn(false);
          setsubmit(false);
          return;
        } else if (response.data) {
          SetGeneratedText(response.data.text);
          setUpload(false);
          false;
          dispatch(
            setUser({
              token,
              user: response.data.user,
            })
          );
          setBtn(false);
          setBackBtn(false);
          setsubmit(false);
        } else {
          toast.log("Failed to generate image caption");
          setsubmit(false);
        }
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.message;
        if (errorMessage) {
          if (errorMessage === "Token verification failed") {
            toast.error(`Login Expire, Please login again`);
            dispatch(setUser({}));
          }
        } else {
          toast.error(`Failed to generate image caption`);
        }
        setStep(1);
        setBtn(false);
        setsubmit(false);
        setBackBtn(false);
      });
  };

  ///////////////////////////upload mask on s3 ennded/////////////////////////////

  return (
    <AuhtProvider>
      <div className="flex flex-col max-w-[1100px] m-[50px_auto] w-[90%]">
        <p
          className={`backtoStep ${backBtn ? "disabled" : ""}`}
          onClick={() => {
            if (step === 1) {
              router.push("/");
            } else {
              setStep((prevStep) => prevStep - 1);
              SetGeneratedText("");
            }
          }}
        >
          <svg
            className="backtoStepsvg"
            viewBox="0 0 26 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.9551 19.0566L7.68829 11.3378C7.42422 11.1042 7.31251 10.7996 7.31251 10.4999C7.31251 10.2003 7.42362 9.89667 7.64573 9.66206L14.9551 1.94331C15.4223 1.45428 16.1941 1.43397 16.6816 1.89557C17.1742 2.35921 17.1895 3.13362 16.7273 3.61909L10.2121 10.4999L16.7324 17.3808C17.1942 17.8664 17.1768 18.6376 16.6848 19.1043C16.1941 19.5644 15.4223 19.5441 14.9551 19.0566Z"
              fill={whiteLabeled ? "#c82021" : "#000000"}
            />
          </svg>{" "}
          {step === 2 ? (
            <Translate text="Back to upload" />
          ) : (
            step === 1 && <Translate text="Back to store" />
          )}
        </p>

        <div className="virtualStagingParaBox">
          <p className="virtualStagingPara">
            <svg
              className="virtualStagingParasvg"
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M30 33.8066V28.3333C30 27.8912 29.8244 27.4673 29.5119 27.1547C29.1993 26.8422 28.7754 26.6666 28.3333 26.6666H25C24.558 26.6666 24.1341 26.8422 23.8215 27.1547C23.5089 27.4673 23.3333 27.8912 23.3333 28.3333V33.8032C20.8004 34.4515 18.5147 35.8317 16.7617 37.7715C15.0086 39.7112 13.8661 42.1245 13.4767 44.7099C13.4387 44.9509 13.4533 45.1973 13.5195 45.4321C13.5858 45.6669 13.7021 45.8846 13.8604 46.0702C14.0188 46.2558 14.2154 46.4049 14.4369 46.5073C14.6584 46.6096 14.8994 46.6629 15.1433 46.6632H38.2167C38.4607 46.6629 38.7017 46.6096 38.9231 46.5073C39.1446 46.4049 39.3412 46.2558 39.4996 46.0702C39.658 45.8846 39.7743 45.6669 39.8405 45.4321C39.9067 45.1973 39.9214 44.9509 39.8833 44.7099C39.4914 42.1217 38.3446 39.7067 36.5866 37.7672C34.8285 35.8277 32.5374 34.45 30 33.8066ZM45.4633 20.9299L37.13 4.26325C36.9929 3.98489 36.7807 3.75036 36.5175 3.58605C36.2542 3.42174 35.9503 3.33419 35.64 3.33325H17.6933C17.3846 3.33388 17.0822 3.42023 16.8197 3.58267C16.5572 3.74511 16.345 3.97727 16.2067 4.25325L7.87334 20.9199C7.74639 21.1733 7.68612 21.4548 7.69824 21.7379C7.71036 22.021 7.79447 22.2964 7.94261 22.5379C8.09075 22.7795 8.29804 22.9793 8.54488 23.1185C8.79173 23.2576 9.06998 23.3315 9.35334 23.3333H36.6667V28.3333C36.6667 28.7753 36.8423 29.1992 37.1548 29.5118C37.4674 29.8243 37.8913 29.9999 38.3333 29.9999C38.7754 29.9999 39.1993 29.8243 39.5119 29.5118C39.8244 29.1992 40 28.7753 40 28.3333V23.3333H43.98C44.2623 23.3313 44.5394 23.2576 44.7855 23.1192C45.0315 22.9808 45.2384 22.7822 45.3866 22.542C45.5349 22.3018 45.6197 22.0278 45.6331 21.7459C45.6465 21.4639 45.5881 21.1831 45.4633 20.9299Z"
                fill={whiteLabeled ? "#c82021" : "#000000"}
              />
            </svg>
            <Translate text="Alt Text Generation" />
          </p>

          {/* 2nd page */}

          {step == 2 && (
            <>
              <p className="mt-[15px]">
                <Translate
                  text="Optimize Metadata, Improve SEO and Property Marketability
                Performance."
                />
              </p>

              {loadImg ? (
                <div className="flex justify-center items-center w-[100%] mt-[50px]">
                  <img
                    className="w-[100%] max-w-[300px] max-h-[200px] object-contain object-center h-[100%]"
                    src="/loading-nexare.gif"
                    alt="loading"
                    style={{ filter: "brightness(0%)" }}
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <div className="w-[100%] max-h-[400px] overflow-hidden rounded-[20px] mt-[40px] flex justify-center items-center">
                    <img
                      className="w-[100%] object-contain object-center h-[100%]"
                      src={original.current}
                      alt="uploaded image"
                    />
                  </div>
                  <p className="text-[1rem] text-[#313135] mt-[30px] flex w-[100%] mr-[auto] font-medium">
                    <Translate text="Generated Alt Text" />
                  </p>
                  {generatedText ? (
                    <div className="!bg-[#e9ecf3] p-[20px] w-[100%] rounded-[10px] mt-[5px] font-medium border-[1px] border-[#e2e2e2] flex justify-center items-center">
                      <p className="text-[#3e3e3e] flex flex-col justify-center items-center w-[100%]">
                        <Translate text={generatedText} />
                        <TooltipThemeProvider>
                          <Tooltip
                            open2={open2}
                            TransitionProps={{ timeout: 600 }}
                            title={
                              <div className="p-3">
                                {isCopied ? "Copied" : "Copy"}
                              </div>
                            }
                          >
                            <button
                              onClick={copyToClipboard}
                              className="max-w-[140px] rounded-[5px] w-[100%] !bg-mainColor text-[#ffffff] h-[40px] flex justify-center items-center cursor-pointer mt-[10px]"
                              alt="Copy to clipboard"
                            >
                              <Translate text="Copy Text" />
                            </button>
                          </Tooltip>
                        </TooltipThemeProvider>
                      </p>
                    </div>
                  ) : (
                    <div className="spinner mx-3 mt-[20px]" id="spinner"></div>
                  )}
                  <div className="flex w-[100%] flex-col-reverse gap-2 md:!grid md:!grid-cols-[1fr] md:!gap-2 md:!mt-3.5 mt-[20px]">
                    <button
                      hidden={btn}
                      disabled={btn}
                      onClick={() => {
                        setStep(1);
                        SetGeneratedText("");
                      }}
                      className="cursor-pointer !text-mainColor w-full h-10 rounded-[5px] border-[0.0520833333vw] !border-mainColor bg-white text-accent font-inter font-semibold text-sm hover:!shadow-md disabled:!bg-[#777e91] disabled:text-[#ddd] disabled:cursor-not-allowed"
                    >
                      <Translate text="I want to try on a new image" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          {/* step 1 */}
          {step == 1 && (
            <>
              <StepOne
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                mainText="Optimize Metadata, Improve SEO and Property Marketability Performance."
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                isDragActive={isDragActive}
                selectedImage={selectedImage}
                handelImageSelect={handelImageSelect}
                handleImageClick={handleImageClick}
                setIsVisible={setIsVisible}
                isVisible={isVisible}
                imageUrlsBefore2={altDummyImages}
                free={free}
                step={step}
                loading={loading}
                downSlide={{
                  mainHeading: "How to use the alt text generation tool",
                  toolSteps: [
                    {
                      image: "/image_caption/firstcardimage.png",
                      title: "Click to upload image",
                      des: "",
                    },
                    {
                      image: "/image_caption/2ndcardpic.png",
                      title: "Click on Generate Alt Text",
                      des: "",
                    },
                  ],
                }}
                modelName="alt text generation"
                NameModel="altTextGeneratorCredit"
              />
            </>
          )}
        </div>
        <CTAModal open={open} setOpen={setOpen} stepsData={{ step }} />
      </div>
    </AuhtProvider>
  );
};

export default VirtualRefurnishing;
