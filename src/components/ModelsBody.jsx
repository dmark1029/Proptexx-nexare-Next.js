"use client";
import React, { useEffect, useCallback, useRef, useState } from "react";
import "../utils/modelsStyle.css";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import StepOne from "@/components/StepOne";
import Stepper from "@/components/Stepper";
import StepFive from "@/components/StepFive";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AuhtProvider from "@/components/AuthProvider";
import { useSelector, useDispatch } from "react-redux";
import { whiteLabeled } from "@/utils/sampleData";
import { setFinalImage, setUser } from "@/Redux/slices/authSlice";
import Translate from "./Translate";
import { getAccessToken } from "@/utils/getAccessToken";
import StepFinal from "./StepFinal";
import StepResult from "./StepResult";

const ModelsBody = ({
  modelName,
  NameModel,
  imageUrlsBefore,
  imageUrlsAfter,
  imageUrlsBefore2,
  imageUrlsAfter2,
  toolSteps,
}) => {
  const [accessToken, setAccessToken] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, user } = useSelector((state) => state.auth.user);
  const { redirection } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  let free = user?.planName == "free" || !token ? true : false;
  const [lastClicked, setLastClicked] = useState("forward");
  const [step, setStep] = useState(redirection?.stepNo || 1);
  const [finalImage, SetFinalImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageDownload, setImageDownload] = useState("");
  const [progress, setProgress] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [btn, setBtn] = useState(true);
  const [backBtn, setBackBtn] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(imageUrlsBefore2[0]);

  const original = useRef(imageUrlsBefore2[0]);
  const timerRef = useRef(null);
  const progressTimeRef = useRef(200);
  const regenRef = useRef(0);

  const [dummy, setDummy] = useState(false);
  const onecredit = user?.usercredit?.[NameModel];
  const [upload, setUpload] = useState(false);
  const [isCompletedStep, setIsCompletedStep] = useState(false);
  const completedRef = useRef(0);
  const [finalImages, SetFinalImages] = useState([]);
  const [checkResult, setCheckResult] = useState([]); // indoor or outdoor image check
  const [selectedPairs, setSelectedPairs] = useState([]);
  const architectureRef = useRef("");
  const roomRef = useRef("");
  const [isDemo, setIsDemo] = useState(false);
  const disableDemo = () => {
    setIsDemo(false)
    SetFinalImages([]);
    setSelectedImage(imageUrlsBefore2[0]);
  }
  const steps = [
    {
      name: "Upload Image",
    },
    {
      name: "Review Result",
    },
  ];

  const handleForwardClick = () => {
    setCurrentIndex((currentIndex + 1) % imageUrlsBefore.length);
    setLastClicked("forward");
  };
  const handleBackClick = () => {
    setCurrentIndex(
      (currentIndex - 1 + imageUrlsBefore.length) % imageUrlsBefore.length
    );
    setLastClicked("back");
  };

  useEffect(() => {
    const fetchToken = async () => {
      const accessToken = await getAccessToken();
      setAccessToken(accessToken);
    };
    fetchToken();
  }, []);

  const completeFunction = (finalImages, pairs) => {
    setIsCompletedStep(true);
    SetFinalImages(finalImages);
    setSelectedPairs(pairs)
  }

  const regenerate = () => {
    setStep(2);
    setIsCompletedStep(false);
    SetFinalImages([]);
  }

  const customFunction = () => {
    handelSubmit();
  }

  const saveResultImages = (newImages) => {
    SetFinalImages((prevImages) => [
      ...prevImages,
      newImages,
    ]);
  }

  const apiCall = async (formData) => {
    const ApiKey = "HLOH64Q4-20230313-OOQV9VVR";
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/models/photoenhancement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": ApiKey,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (!response.message.result.imageUrl) {
            toast.error("Failed to generate Image");
            setStep(1);
            setBtn(false);
            setBackBtn(false);
            return;
          } else {
            // if (free === true) {
            //   regenRef.current = regenRef.current + 1;
            // }            
            saveResultImages(response.message.result.imageUrl);
            // setTimeout(() => {
            //   SetFinalImage(response.message.result.imageUrl);
            //   setImageDownload(response.message.result.imageUrl);
            //   setBackBtn(false);
            // }, 1000);
          }
        })
    } catch (err) {
      const errorMessage = err?.response?.data?.message;
      if (errorMessage === "Token verification failed") {
        toast.error(`Login Expire, Please login again`);
        dispatch(setUser({}));
      } else {
        toast.error(errorMessage);
      }
      setStep(1);
      setBtn(true);
      setBackBtn(false);
    };
  }

  const imageCheckAPI = async (token, img) => { // indoor or outdoor image detect
    let formData = {
      imageUrl: img
    };
    try {
      const response = await fetch('https://api.proptexx.com/cv/room-scene-emptiness-detector', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.log('error', err);
      return null;
    }
  };

  const handleImageClick = () => { // try with given images
    // if (timerRef.current) {
    //   clearInterval(timerRef.current); // clear existing timer
    // }
    // setProgress(0);
    // timerRef.current = setInterval(() => {
    //   setProgress((oldProgress) => {
    //     if (oldProgress === 100) {
    //       setBtn(false);
    //       clearInterval(timerRef.current);
    //       return 100;
    //     }
    //     let newProgress = oldProgress + 1;
    //     if (oldProgress === 50) {
    //       progressTimeRef.current = 2000;
    //     }
    //     if (oldProgress === 90) {
    //       newProgress = oldProgress;
    //     }

    //     return newProgress;
    //   });
    // }, 1300);
    setBtn(true);
    if (free && !onecredit && !upload) {
      setTimeout(() => {
        handelSubmit3();
      }, 2000);
    } else {
      handelSubmit();
    }
  };

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
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const allFilesValid = acceptedFiles.every(file => allowedTypes.includes(file.type));
    if (allFilesValid) {
      const validFiles = acceptedFiles.filter(file => allowedTypes.includes(file.type));
      setBtn(true);
      newFileUpload(validFiles);
    } else {
      alert("Unsupported Format. Please try again");
      setStep(1);
      return;
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handelImageSelect = (image, index) => {
    original.current = image;
    setSelectedImage(image);
    setImageIndex(index);
  };

  async function processFiles(files) {
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        let fileimg = file;

        if (file && file.size > 1048576) {
          const resizedBlob = await resizeImage(file, 1920, 1920);
          const randomName = generateRandomTimeName();
          const resizedFile = new File([resizedBlob], `${randomName}${file.name}`, {
            type: "image/jpeg",
          });
          fileimg = resizedFile;
        }

        return fileimg;
      })
    );

    return processedFiles;
  }


  const newFileUpload = async (files) => {
    const processedFiles = await processFiles(files);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setProgress(0);
    // timerRef.current = setInterval(() => {
    //   setProgress((oldProgress) => {
    //     if (oldProgress === 100) {
    //       setBtn(false);
    //       clearInterval(timerRef.current);
    //       return 100;
    //     }
    //     let newProgress = oldProgress + 1;

    //     if (oldProgress === 90 && mask.trim() === "") {
    //       newProgress = 90;
    //     }

    //     return newProgress;
    //   });
    // }, 1200);
    handelNewFileUpload(processedFiles);
  };

  const handelNewFileUpload = async (files) => {
    const ApiKey = "HLOH64Q4-20230313-OOQV9VVR";
    if (!files) return;
    const formData = new FormData();
    if (files.length > 1) {
      formData.append("isMultiImages", true);
    } else {
      formData.append("isMultiImages", false);
    }
    for (const file of files) {
      formData.append("image", file);
    }
    setLoading(true);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/api/models/uploadimage?modelName=${NameModel}`,
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
      .then(async (data) => {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          console.error('No access token available');
          return;
        }
        const fileUrls = data.fileurl.map(item => item.fileurl);

        await Promise.all(
          fileUrls.map(async (each, index) => {
            const apiResponse = await imageCheckAPI(accessToken, each);
            setCheckResult(prevResults => {
              const newResults = [...prevResults]; // Copy the previous array
              newResults[index] = apiResponse; // Set the response at the correct index
              return newResults;
            });
          })
        );

        original.current = fileUrls[0];
        if (data?.fileurl) {
          setLoading(false);
          setStep(2);
          setIsCompletedStep(false);
          setSelectedImage(fileUrls);
          // handelSubmit();
          // if (onecredit) {
          //   setUpload(true);
          // }
          // dispatch(
          //   setUser({
          //     token,
          //     user: data?.user,
          //   })
          // );
        } else {
          alert("Upload Failed");
          setStep(1);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const handelSubmit3 = async () => {
    const filterImage = imageUrlsAfter2.find(
      (item, index) => index == imageIndex
    );
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/api/models/dummypmagepreview`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_url: filterImage }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setBtn(false);
        SetFinalImages(data.image);
        setStep(2);
        setIsCompletedStep(true);
        setSelectedImage(selectedImage);
      });
    setDummy(true);
  };

  const handelSubmit = async () => {
    setLoading(true);
    setIsDemo(true);
    let formData = {};
    formData = {
      image_url: selectedImage,
      modelName
    }
    await apiCall(formData);
    setLoading(false);
    setBackBtn(false);
    setStep(5);
    setBtn(false);
    // setIsCompletedStep(true);
  };

  useEffect(() => {
    if (step == 1) {
      SetFinalImage("");
      setUpload(false);
    }
    if (dummy) {
      setDummy(false);
      return;
    }
  }, [step]);

  const handlePositionChange = useCallback((position) => {
    setSliderPosition(position);
  }, []);

  return (
    <AuhtProvider>
      <div className={`flex flex-col ${step == 2 ? 'max-w-[1700px]' : 'max-w-[1100px]'} m-[50px_auto] w-[90%]`}>
        <p
          className={`backtoStep ${backBtn ? "disabled" : ""}`}
          onClick={() => {
            if (step === 1) {
              router.push("/");
            } else if (
              step == 2 &&
              free == true &&
              regenRef.current > 1 &&
              !onecredit &&
              !upload
            ) {
              setStep(1);
              setIsDemo(false);
              regenRef.current = 0;
            } else {
              setStep(1);
              setIsDemo(false);
              setSelectedImage(imageUrlsBefore2[0]);
              SetFinalImages([]);
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
          {step === 1 ? (
            <Translate text="Back to store" />
          ) : (
            <Translate text={`Back`} />
          )}
        </p>

        <div className="virtualStagingParaBox">
          {/* <p className="virtualStagingPara">
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
            <span className="capitalize">
              <Translate text={`AI ${modelName}`} />
            </span>
          </p> */}

          {/* step 5 in the past*/}
          <div className="flex justify-center items-center">
            {step === 2 && !isCompletedStep && (
              <>
                <StepFinal
                  checkResult={checkResult}
                  setStep={setStep}
                  selectedImage={selectedImage}
                  customFunction={customFunction}
                  completedRef={completedRef}
                  completeFunction={completeFunction}
                  user={user}
                  architectureRef={architectureRef}
                  roomRef={roomRef}
                />
              </>
            )}
            {step === 2 && isCompletedStep && (
              <>
                <StepResult
                  finalImages={finalImages}
                  selectedImage={selectedImage}
                  handlePositionChange={handlePositionChange}
                  sliderPosition={sliderPosition}
                  btn={btn}
                  setStep={setStep}
                  free={free}
                  stepsData={{ step }}
                  NameModel="stagingCredit"
                  upload={upload}
                  selectedPairs={selectedPairs}
                  regenerate={regenerate}
                  setIsDemo={disableDemo}
                />
              </>
            )}
          </div>
          <div className="flex justify-center items-center">
            {isDemo && step === 5 && (
              <>
                <StepResult
                  finalImages={finalImages}
                  selectedImage={selectedImage}
                  handlePositionChange={handlePositionChange}
                  sliderPosition={sliderPosition}
                  btn={btn}
                  setStep={setStep}
                  free={free}
                  stepsData={{ step }}
                  NameModel="stagingCredit"
                  upload={upload}
                  selectedPairs={selectedPairs}
                  regenerate={regenerate}
                  isDemo={isDemo}
                  setIsDemo={disableDemo}
                />
              </>
            )}
          </div>
          {/* {step == 2 && (
            <div>
              <>
                <Stepper
                  stepperClass="otherModelsStepBoxText"
                  progressSteps={steps}
                  step={step}
                />
              </>
              <p className="step5Para !text-mainColor">
                <Translate text="Step 2" />{" "}
                <span className="step3ParaSpan">
                  - <Translate text={"Review Result"} />
                </span>
              </p>
              <StepFive
                modelName={modelName}
                NameModel={NameModel}
                finalImage={finalImage}
                selectedImage={selectedImage}
                handlePositionChange={handlePositionChange}
                sliderPosition={sliderPosition}
                imageDownload={imageDownload}
                progress={progress}
                btn={btn}
                setStep={setStep}
                step={step}
                free={free}
                SetFinalImage={SetFinalImage}
                upload={upload}
                setUpload={setUpload}
              />
            </div>
          )} */}
          {/* step 1 */}
          {step == 1 && (
            <>
              <StepOne
                currentIndex={currentIndex}
                NameModel={NameModel}
                setCurrentIndex={setCurrentIndex}
                mainText={`82% of buyers’ agents said ${modelName} made it easier for a buyer to visualize the property as a future home`}
                handlePositionChange={handlePositionChange}
                handleBackClick={handleBackClick}
                handleForwardClick={handleForwardClick}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                isDragActive={isDragActive}
                selectedImage={selectedImage}
                handelImageSelect={handelImageSelect}
                handleImageClick={handleImageClick}
                sliderPosition={sliderPosition}
                setIsVisible={setIsVisible}
                isVisible={isVisible}
                lastClicked={lastClicked}
                imageUrlsBefore2={imageUrlsBefore2}
                imageUrlsBefore={imageUrlsBefore}
                imageUrlsAfter={imageUrlsAfter}
                free={free}
                step={step}
                loading={loading}
                downSlide={{
                  mainHeading: `How to use the ${modelName} tool`,
                  toolSteps,
                }}
                modelName={modelName}
                isDemo={isDemo}
              />
            </>
          )}
        </div>
      </div>
    </AuhtProvider>
  );
};

export default ModelsBody;
