"use client";
import React, { useEffect, useCallback, useRef, useState } from "react";
import "@/styles/VirtualStaging.css";
import { useDropzone } from "react-dropzone";
import {
  imageUrlsBefore2,
  stagingImageUrlsBefore2,
  stagingImageUrlsBeforePaid2,
} from "@/utils/imagesPath";
import StepOne from "@/components/StepOne";
import Stepper from "@/components/Stepper";
import StepThree from "@/components/StepThree";
import StepFinal from "@/components/StepFinal";
import StepFour from "@/components/StepFour";
import StepFive from "@/components/StepFive";
import StepSix from "@/components/StepSix";
import { dummyImages } from "@/utils/dummyImagestaging";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import AuhtProvider from "@/components/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import { whiteLabeled } from "@/utils/sampleData";
import Translate from "@/components/Translate";
import { set } from "date-fns";
import { stagingData } from "@/utils/data";
import { setUser, setLanguage } from "@/Redux/slices/authSlice";
import { getAccessToken } from "@/utils/getAccessToken";
import StepResult from "@/components/StepResult";

const VirtualStagingContent = ({ crmToken }) => {
  const [accessToken, setAccessToken] = useState(null);
  const router = useRouter();

  const { user } = useSelector((state) => state.auth.user);
  let free = user?.planName == "free" ? true : false;
  const [lastClicked, setLastClicked] = useState("forward");
  const [step, setStep] = useState(1);
  const [finalImage, SetFinalImage] = useState("");
  const [finalImages, SetFinalImages] = useState([]);
  const [imageDownload, setImageDownload] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeIndex, setActiveIndex] = useState(0);
  const [btn, setBtn] = useState(true);
  const [backBtn, setBackBtn] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState([
    "https://storage.googleapis.com/store-gallery-img-results/staging/input_images/1.jpg"
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeIndexTypeModern, setActiveIndexTypeModern] = useState(0);
  const [upload, setUpload] = useState(false);
  const timerRef = useRef(null);
  const progressTimeRef = useRef(200);
  const [mask, setMask] = useState("");
  const tryimageRef = useRef(false);
  const roomRef = useRef("bedroom");
  const regenRef = useRef(0);
  const architectureRef = useRef("modern");
  const completedRef = useRef(0);
  const [doPreprocessLoading, setDoPreprocessLoading] = useState(false);
  const onecredit = user?.usercredit?.stagingCredit;
  const [isCompletedStep, setIsCompletedStep] = useState(false);
  const isCompleted = useRef(false);
  const [checkResult, setCheckResult] = useState([]);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [isDemo, setIsDemo] = useState(false);
  const dispatch = useDispatch();
  const disableDemo = () => {
    setIsDemo(false)
    SetFinalImages([]);
    setIsCompletedStep(false);
    setSelectedImage(["https://storage.googleapis.com/store-gallery-img-results/staging/input_images/1.jpg"]);
  }

  const saveResultImages = (newImages) => {
    SetFinalImages((prevImages) => [
      ...prevImages,
      newImages,
    ]);
  }
  const downloadResultImages = (newImages) => {
    setImageDownload((prevImages) => [
      ...prevImages,
      newImages,
    ]);
  }

  useEffect(() => {
    const fetchTokenAndCheckImages = async () => {
      await retrieveCRMUser();
      console.log('signed in user in virtual staging', user);
      const accessToken = await getAccessToken();
      setAccessToken(accessToken);
      setCheckResult([]);
      let currentUrl = window.location.href;
      let dataAPI = '';

      switch (true) {
        case currentUrl.includes('ilist'):
          dataAPI = 'https://backend.proptexx.com/api/getDetailsIlist';
          break;
        case currentUrl.includes('c21'):
          dataAPI = 'https://backend.proptexx.com/api/getDetailsC21';
          break;
        case currentUrl.includes('cb'):
          dataAPI = 'https://backend.proptexx.com/api/getDetailsCb';
          break;
        case currentUrl.includes('exp'):
          dataAPI = 'https://backend.proptexx.com/api/getDetailsExp';
          break;
        case currentUrl.includes('kwcp'):
          dataAPI = 'https://backend.proptexx.com/api/getDetailsKwcp';
          break;
        case currentUrl.includes('realsmart'):
          dataAPI = 'https://backend.proptexx.com/api/getDetailsRealsmart';
          break;
        case currentUrl.includes('viking'):
          dataAPI = 'https://backend.proptexx.com/api/getDetailsViking';
          break;
        case currentUrl.includes('realty'):
          dataAPI = 'https://backend.proptexx.com/api/getDetailsRealty';
          break;
      }

      const response = await fetch(dataAPI,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (response.ok) {
          const temp = data.images.map((item) => item.imageURL || item.imageUrl);
          if (temp.length) {
            setSelectedImage(temp);
            const imageCheck = async () => {
              const results = await Promise.all(
                temp.map(async (image) => {
                  const apiResponse = await imageCheckAPI(accessToken, image);
                  return apiResponse;
                })
              );
              setCheckResult(results);
            };
            await imageCheck();
            setStep(2);
          }
        }
      }
    };
    fetchTokenAndCheckImages();
  }, []);

  useEffect(() => {
    if (step == 1) {
      isCompleted.current = false
    }
  }, [step])

  const imageUrlsBefore = [
    "virtualhome_img/before1.jpg",
    "virtualhome_img/before2.jpg",
    "virtualhome_img/before3.jpg",
    "virtualhome_img/before4.jpg",
    "virtualhome_img/before5.jpeg",
    "virtualhome_img/before6.jpg",
  ];

  const imageUrlsAfter = [
    "virtualhome_img/after1.jpg",
    "virtualhome_img/after2.jpg",
    "virtualhome_img/after3.jpg",
    "virtualhome_img/after4.jpg",
    "virtualhome_img/after5.jpg",
    "virtualhome_img/after6.jpg",
  ];
  const steps = [
    {
      name: "Upload Image",
    },
    {
      name: "Select Room Type",
    },
    {
      name: "Select Furnishing Style",
    },
    {
      name: "Review Result",
    },
  ];

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

  const customFunction = (storage, path) => {
    if (
      (user === true && storage !== "virtualstage4" && path) ||
      (free && regenRef.current <= 1 && !path) ||
      (!free && !path)
    ) {
      console.log(1)
      // setStep((prevStep) => prevStep + 1);
      if (path) tryimageRef.current && free ? handelSubmit3() : handelSubmit2();
    } else if (free && !onecredit && !upload) {
      console.log(2)
      // setStep((prevStep) => prevStep + 1);
      handelSubmit3();
    } else if (!free || onecredit || upload) {
      console.log(3)
      // setStep((prevStep) => prevStep + 1);
      handelSubmit2();
    }
  };

  const handleForwardClick = () => {
    setCurrentIndex((currentIndex + 1) % imageUrlsBefore2.length);
    setLastClicked("forward"); // Go to next image
  };
  const handleBackClick = () => {
    setCurrentIndex(
      (currentIndex - 1 + imageUrlsBefore.length) % imageUrlsBefore.length
    );
    setLastClicked("back");
  };
  // 1st
  const handelImageSelect = (image) => {
    setSelectedImage(image);
  };

  ////////resize///////////////////////////////////////////////////////////////////////////
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
    if (free && onecredit && !upload) {
      router.push("/plans");
    } else {
      // setMask("");
      setSelectedImage("");
      if (acceptedFiles[0]) {
        const allowedTypes = [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/webp",
        ];

        setBtn(true);

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setProgress(0);
        timerRef.current = setInterval(() => {
          setProgress((oldProgress) => {
            if (oldProgress === 100) {
              setBtn(false);
              clearInterval(timerRef.current);
              return 100;
            }
            let newProgress = oldProgress + 1;
            if (mask.trim() === "" && oldProgress === 50) {
              progressTimeRef.current = 2000;
            }
            if (oldProgress === 80 && mask.trim() === "") {
              newProgress = 80;
            }

            return newProgress;
          });
        }, progressTimeRef.current);

        if (allowedTypes.includes(acceptedFiles[0].type)) {
          const validFiles = acceptedFiles.filter(file => allowedTypes.includes(file.type));
          handelNewFileUpload(validFiles);
        } else {
          alert("Unsupport Format");
          setStep(1);
          return;
        }
      }
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handelNewFileUpload = async (files) => {
    const ApiKey = "HLOH64Q4-20230313-OOQV9VVR";
    const formData = new FormData();
    setLoading(true);
    if (files.length > 1) {
      formData.append("isMultiImages", true);
    } else {
      formData.append("isMultiImages", false);
    }

    for (const file of files) {
      let fileimg = file;
      if (file && file.size > 1048576) {
        const resizedBlob = await resizeImage(file, 1920, 1920);
        const randomName = generateRandomTimeName();
        const resizedFile = new File([resizedBlob], `${randomName}${file.name}`, {
          type: "image/jpeg",
        });
        fileimg = resizedFile;
      }
      formData.append("image", fileimg);
    }

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/api/models/uploadimage?modelName=stagingCredit`,
      {
        method: "POST",
        headers: {
          "x-api-key": ApiKey,
        },
        body: formData,
      }
    )
      .then((res) => res.json())
      .then(async (data) => {
        console.log('data', data);
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

        if (data?.fileurl) {
          setLoading(false);
          setSelectedImage(fileUrls);
          setStep(2);
          setIsCompletedStep(false);
          // try {
          //   tryimageRef.current = false;
          //   regenRef.current = 0;
          //   if (onecredit) {
          //     setUpload(true);
          //   }
          //   handelSubmit(data.fileurl);
          //   dispatch(
          //     setUser({
          //       token,
          //       user: data?.user,
          //     })
          //   );
          // } catch (err) {
          //   console.log(err);
          // }
        } else {
          alert("Upload Failed");
          setStep(1);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const retrieveCRMUser = async () => {
    let currentUrl = window.location.href;
    let tempUrl = currentUrl.includes('ilist') ? 'https://backend.proptexx.com/api/getUserDetail' : 'https://backend-rep.proptexx.com/api/getUserDetail'
    const response = await fetch(tempUrl,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      const data = await response.json();
      const language = data.countryLanguage || 'en';
      dispatch(setLanguage(language));
      dispatch(
        setUser({
          user: data,
        })
      );
    }
  }

  const imageCheckAPI = async (token, img) => {
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

  const handelSubmitForGallery = async () => {
    console.log('2')
    setBackBtn(true);
    setIsDemo(true);
    setTimeout(() => {
      setBtn(false);
      setBackBtn(false);
      if (step == 1) {
        setStep(2);
      }
    }, 3000);
  };

  const backToCRM = () => {
    let currentUrl = window.location.href;

    switch (true) {
      case currentUrl.includes('ilist'):
        window.location.href = 'https://iconnect10.gryphtech.com/Application#/listings';
        break;
      case currentUrl.includes('c21'):
        window.location.href = 'https://www.21onlineplus.com/Application#/listings';
        break;
      case currentUrl.includes('exp'):
        window.location.href = 'https://expglobal.realestateplatform.com/Application#/listings';
        break;
      case currentUrl.includes('kwcp'):
        window.location.href = 'https://www.kwcontrolpanel.com/Application#/listings';
        break;
      case currentUrl.includes('viking'):
        window.location.href = 'https://vk.realestateplatform.com/Application#/listings';
        break;
      case currentUrl.includes('cb'):
        window.location.href = 'https://cb.realestateplatform.com/Application#/listings';
        break;
      case currentUrl.includes('realsmart'):
        window.location.href = 'https://www.realsmartsystem.com/Application#/listings';
        break;
      case currentUrl.includes('realty'):
        window.location.href = 'https://zoneglobal.ai/Application#/listings';
        break;
      default:
        console.warn('No matching provider found.');
    }
  }

  const handelSubmit = async () => {
    if (Array.isArray(selectedImage)) {
      setSelectedImage(selectedImage[0]);
    }
    setBackBtn(true);
    setIsDemo(true);
    setTimeout(() => {
      setBtn(false);
      setBackBtn(false);
      if (step == 1) {
        setStep(2);
      }
    }, 1000);
  };

  // 2nd
  const handleImageClick = async () => {
    // if (timerRef.current) {
    //   clearInterval(timerRef.current); // clear existing timer
    // }
    // setProgress(0); // reset progress
    setDoPreprocessLoading(true);

    try {
      console.log(selectedImage)
      if (selectedImage) {
        // timerRef.current = setInterval(() => {
        //   setProgress((oldProgress) => {
        //     if (oldProgress === 100) {
        //       setBtn(false);
        //       clearInterval(timerRef.current);
        //       return 100;
        //     }
        //     let newProgress = oldProgress + 1;
        //     if (mask.trim() === "" && oldProgress === 50) {
        //       progressTimeRef.current = 2000;
        //     }
        //     if (oldProgress === 80 && mask.trim() === "") {
        //       newProgress = 80;
        //     }

        //     return newProgress;
        //   });
        // }, progressTimeRef.current);

        setBtn(true);
        tryimageRef.current = true;
        regenRef.current = 0;
        free && !onecredit && !upload
          ? handelSubmitForGallery()
          : handelSubmit();
        setDoPreprocessLoading(false);
      } else {
        toast.error("Image cannot be process");
        setStep(1);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePositionChange = useCallback((position) => {
    setSliderPosition(position);
  }, []);

  const onButtonClick = (index) => {
    setActiveIndex(index);
  };

  const handleRoomTypeSelection = (selectedRoomType) => {
    roomRef.current = selectedRoomType;
    setActiveIndexTypeModern(0);
    // setOverridePrompt("");
    architectureRef.current =
      stagingData[selectedRoomType]?.architecture_style[0]?.style;
  };

  // 4th
  const handelSubmit3 = async () => {
    setBtn(true);
    SetFinalImage("");
    if (timerRef.current) {
      clearInterval(timerRef.current); // clear existing timer
    }
    setProgress(0); // reset progress
    timerRef.current = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timerRef.current);
          return 100;
        }
        let newProgress = oldProgress + 1;
        if (oldProgress === 80 && finalImage === "") {
          newProgress = 80;
        }
        return newProgress;
      });
    }, 500);
    // Assuming these are the values from your selection
    let commonValue = null;
    if (selectedImage == stagingImageUrlsBefore2[0]) {
      commonValue = "virtual-staging-sample";
    } else if (selectedImage == stagingImageUrlsBefore2[1]) {
      commonValue = "64b78bd551240";
    } else if (selectedImage == stagingImageUrlsBefore2[2]) {
      commonValue = "64b78bfd990ad";
    } else if (selectedImage == stagingImageUrlsBefore2[3]) {
      commonValue = "64b78c21a71b3";
    } else if (selectedImage == stagingImageUrlsBefore2[4]) {
      commonValue = "64b78c4c8ce08";
    } else if (selectedImage == stagingImageUrlsBefore2[5]) {
      commonValue = "64b78c77d3232";
    }

    const selectedRoom = roomRef.current;
    const selectedStyle = architectureRef.current;

    // Extract the common value from the selected image using a regex (assuming the structure remains consistent)
    const match = selectedImage.match(/([^\/]+)\.jpg$/);
    // const commonValue = "64b78bd551240"; // Adjust the slice value based on the length of the common ID
    // Filter images based on the common value, selectedRoom and selectedStyle
    const filteredImages = dummyImages.filter((url) =>
      url.includes(
        `${commonValue}_${selectedRoom}_${selectedStyle.toLowerCase()}`
      )
    );
    // Select one image randomly
    const randomImage = filteredImages.length
      ? filteredImages[Math.floor(Math.random() * filteredImages.length)]
      : null;

    let formData = {};
    formData = {
      imageUrl: randomImage ? randomImage : selectedImage,
      architecture_style: selectedStyle,
      do_preprocess: true,
      room_type: selectedRoom,
    };
    const ApiKey = "HLOH64Q4-20230313-OOQV9VVR";

    console.log('selected image', selectedImage);
    // try {
    //   await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/models/virtualStaging`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "x-api-key": ApiKey,
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: JSON.stringify(formData),
    //     }
    //   )
    //     .then((response) => response.json())
    //     .then((data) => {
    //       if (free == true) {
    //         // regenRef.current = regenRef.current + 1;..
    //       }
    //       createDummyFinalImage(data.message.result.imageUrl);
    //     });
    // } catch (err) {
    //   toast.error("Image can't be process");
    //   setStep(1);
    // }
  };

  const createDummyFinalImage = async (data) => {
    setTimeout(() => {
      setProgress(100);
      SetFinalImage(data);
      setBtn(false);
    }, 1000);
  };

  const handelSubmit2 = async () => {
    setBtn(true);
    if (free && !onecredit && !upload) {
      handelSubmit3();
      return;
    }
    SetFinalImage();
    var storedData = localStorage.getItem("virtualstage");
    var parsedData = JSON.parse(storedData);
    let formData = {};
    if (!accessToken) {
      console.error('No access token available');
      return;
    }
    const selectedRoom = roomRef.current;
    const selectedStyle = architectureRef.current;
    for (const image of selectedImage) {
      formData = {
        imageUrl: image,
        room_type: selectedRoom,
        architecture_style: selectedStyle,
        do_preprocess: true,
      };
      await apiCall(formData);
    }
  };

  const apiCall = async (formData) => {
    const ApiKey = "HLOH64Q4-20230313-OOQV9VVR";
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/models/virtualStaging`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": ApiKey,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!data.message.result.imageUrl) {
        throw new Error("Failed to generate final image");
      }

      // if (free === true) {
      //   regenRef.current = regenRef.current + 1;
      // }
      saveResultImages(data.message.result.imageUrl);
      downloadResultImages(data.message.result.imageUrl);
      // SetFinalImage(data.message.result.imageUrl);
      // setProgress(100);
      // setBtn(false);
      // setBackBtn(false);

    } catch (error) {
      toast.error(error.message);
      const file = acceptedFiles[0];
      setBtn(false);
      setBackBtn(false);
      setStep(1);
    }
  }

  const updateFinalImage = (index, previewData) => {
    if (index === 0) {
      setProgress(100);
    }
    SetFinalImage((prevFinalImage) => {
      const newFinalImage = [...prevFinalImage];
      newFinalImage[index] = previewData;
      return newFinalImage;
    });
  };

  return (<AuhtProvider>
    <div className={`flex flex-col ${step == 2 ? 'max-w-[1700px]' : 'max-w-[1100px]'} m-[50px_auto] w-[90%]`}>
      <p
        className={`backtoStep w-fit text-base ${backBtn ? "disabled" : ""} hover:bg-Color`}
        onClick={backToCRM}
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
        <Translate text="Return / Exit" />
      </p>

      {/*///////////////////////////////////////////////// top progress bar     /////////////////////////////*/}
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
          <Translate text="AI Virtual Staging" />
        </p> */}

        {/* 2rd page  */}
        <div className="flex justify-center items-center 123">
          {step === 2 && !isCompletedStep && (
            <>
              <StepFinal
                checkResult={checkResult}
                onButtonClick={onButtonClick}
                handleRoomTypeSelection={handleRoomTypeSelection}
                roomRef={roomRef}
                activeIndex={activeIndex}
                setStep={setStep}
                free={free}
                doPreprocessLoading={doPreprocessLoading}
                selectedImage={selectedImage}
                customFunction={customFunction}
                architectureRef={architectureRef}
                completedRef={completedRef}
                completeFunction={completeFunction}
                user={user}
                isDemo={isDemo}
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
                isDemo={isDemo}
                setIsDemo={disableDemo}
                crmToken={crmToken}
              />
            </>
          )}
        </div>

        {/* 3th step  */}
        {step == 3 && (
          <div>
            <>
              <Stepper
                stepperClass="stagingStepBoxText"
                progressSteps={steps}
                step={step}
              />
            </>
            <p className="step3Para">
              <Translate text="Step 3" />{" "}
              <span className="step3ParaSpan">
                - <Translate text="Select Furnishing Style" />
              </span>
            </p>
            <p className="furnishstyledPara">
              <Translate text="Please select furnishing style below" />
            </p>
            <StepFour
              roomRef={roomRef}
              free={free}
              architectureRef={architectureRef}
              customFunction={customFunction}
              user={user}
              data={stagingData[roomRef.current].architecture_style}
              activeIndexTypeModern={activeIndexTypeModern}
              setActiveIndexTypeModern={setActiveIndexTypeModern}
              progress={progress}
            />
          </div>
        )}
        {/* step 4 */}
        {step == 4 && (
          <div>
            <>
              <Stepper
                stepperClass="stagingStepBoxText"
                progressSteps={steps}
                step={step}
              />
            </>
            <p className="step5Para !text-mainColor">
              <Translate text="Step 4" />{" "}
              <span className="step3ParaSpan">
                - <Translate text="Review Result" />
              </span>
            </p>
            <StepFive
              modelName="virtual staging"
              finalImage={finalImage}
              selectedImage={selectedImage}
              handlePositionChange={handlePositionChange}
              sliderPosition={sliderPosition}
              imageDownload={imageDownload}
              progress={progress}
              btn={btn}
              customFunction={customFunction}
              setStep={setStep}
              free={free}
              step={step}
              stepsData={{ step }}
              NameModel="stagingCredit"
              SetFinalImage={SetFinalImage}
              upload={upload}
              setUpload={setUpload}
            />
          </div>
        )}
        {/* step 5 */}
        {step == 5 && (
          <div>
            <>
              <Stepper
                stepperClass="stagingStepBoxText"
                progressSteps={steps}
                step={step}
              />
            </>
            <p className="step5Para !text-mainColor">
              <Translate text="Step 4" />{" "}
              <span className="step3ParaSpan">
                - <Translate text="Regeneration" />
              </span>
            </p>
            <StepSix
              setStep={setStep}
              free={free}
              customFunction={handelSubmit2}
              finalImage={finalImage}
              SetFinalImage={SetFinalImage}
              // overridePrompt={overridePrompt}
              // setOverridePrompt={setOverridePrompt}
              setUpload={setUpload}
            />
          </div>
        )}
        {/* step 1 */}
        {step == 1 && (
          <>
            <StepOne
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              mainText="82% of buyers’ agents said staging made it easier for a buyer to
              visualize the property as a future home"
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
              imageUrlsBefore2={
                free && !onecredit && !upload
                  ? stagingImageUrlsBefore2
                  : stagingImageUrlsBeforePaid2
              }
              imageUrlsBefore={imageUrlsBefore}
              imageUrlsAfter={imageUrlsAfter}
              free={free}
              loading={loading}
              stepsData={{ step }}
              NameModel="stagingCredit"
              downSlide={{
                mainHeading: "How to use the Virtual Staging tool",
                toolSteps: [
                  {
                    image: "/virtualhome_img/firstcardimage.png",
                    title: "Click to upload image",
                    des: "Add one image",
                  },
                  {
                    image: "/virtualhome_img/2ndcardpic.png",
                    title: "Select room type and style",
                    des: "",
                  },
                  {
                    image: "/virtualhome_img/thirdcardpic.png",
                    title: "Download the staged image from your library",
                    des: "Free plan users can regenerate the same image one time, while premium users have unlimited regenerations and watermark-free downloads.",
                  },
                ],
              }}
              modelName="staging"
            />
          </>
        )}
      </div>
    </div>
  </AuhtProvider>);
}

export default VirtualStagingContent;