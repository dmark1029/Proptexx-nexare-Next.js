"use client";
import React, { useEffect, useCallback, useRef, useState } from "react";
import "../../styles/decluttering.css";
import { useDropzone } from "react-dropzone";
import { fabric } from "fabric";
import { decluttering, imageUrlsBefore2 } from "@/utils/imagesPath";
import StepOne from "@/components/StepOne";
import Stepper from "@/components/Stepper";
import StepThree from "@/components/StepThree";
import StepFour from "@/components/StepFour";
import StepFive from "@/components/StepFive";
import StepSix from "@/components/StepSix";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import AuhtProvider from "@/components/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import { whiteLabeled } from "@/utils/sampleData";
import Translate from "@/components/Translate";
import { declutteringDummy } from "@/utils/dummyDecluttering";
import { refurnishingData } from "@/utils/data";
import { setUser } from "@/Redux/slices/authSlice";
import { getAccessToken } from "@/utils/getAccessToken";
import StepFinal from "@/components/StepFinal";
import StepResult from "@/components/StepResult";

const Cluttering = () => {
  const [accessToken, setAccessToken] = useState(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth.user);

  let free = user?.planName == "free" || !token ? true : false;
  const [lastClicked, setLastClicked] = useState("forward");
  const [step, setStep] = useState(1);
  const [customize, setCustomize] = useState(false);
  const [mask, setMask] = useState("");
  const [finalImage, SetFinalImage] = useState("");
  const [imageDownload, setImageDownload] = useState("");
  const [overridePrompt, setOverridePrompt] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeIndex, setActiveIndex] = useState(0);
  const [btn, setBtn] = useState(true);
  const [backBtn, setBackBtn] = useState(false);
  const [upload, setUpload] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(decluttering[0]);
  const [loading, setLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [scale, setScale] = useState(0);
  const [activeIndexTypeModern, setActiveIndexTypeModern] = useState(0);

  const canvasRef = useRef(null);
  const maskDiv = useRef(null);
  const brushColor = useRef("White");
  const brushSize = useRef(50);
  const timerRef = useRef(null);
  const progressTimeRef = useRef(200);
  const tryimageRef = useRef(false);
  const roomRef = useRef("bedroom");
  const regenRef = useRef(0);
  const architectureRef = useRef("modern");
  const onecredit = user?.usercredit?.cluterringCredit;
  const completedRef = useRef(0);
  const [isCompletedStep, setIsCompletedStep] = useState(false);
  const isCompleted = useRef(false);
  const [checkResult, setCheckResult] = useState([]);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [isDemo, setIsDemo] = useState(false);
  const [finalImages, SetFinalImages] = useState([]);
  const [doPreprocessLoading, setDoPreprocessLoading] = useState(false);

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

  const imageUrlsBefore = [
    "https://storage.googleapis.com/store-gallery-img-results/refurnishing_example_gallery/before/5.jpg",
    "https://storage.googleapis.com/store-gallery-img-results/refurnishing_example_gallery/before/2.webp",
    "https://storage.googleapis.com/store-gallery-img-results/refurnishing_example_gallery/before/3.jpg",
    "https://storage.googleapis.com/store-gallery-img-results/refurnishing_example_gallery/before/4.jpg",
    "https://storage.googleapis.com/store-gallery-img-results/refurnishing_example_gallery/before/1.jpg",
    "https://storage.googleapis.com/store-gallery-img-results/refurnishing_example_gallery/before/6.jpg",
  ];

  const imageUrlsAfter = [
    "https://storage.googleapis.com/store-gallery-img-results/refurnishing_example_gallery/after/5.jpg",
    "https://storage.googleapis.com/store-gallery-img-results/refurnishing_example_gallery/after/2.jpg",
    "https://storage.googleapis.com/store-gallery-img-results/refurnishing_example_gallery/after/3.jpg",
    "https://storage.googleapis.com/store-gallery-img-results/refurnishing_example_gallery/after/4.jpg",
    "https://storage.googleapis.com/store-gallery-img-results/refurnishing_example_gallery/after/1.jpg",
    "https://storage.googleapis.com/store-gallery-img-results/refurnishing_example_gallery/after/6.jpg",
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

  const customFunction = (storage, path) => {
    if (
      (user === true && storage !== "virtualstage4" && path) ||
      (free && regenRef.current <= 1 && !path) ||
      (!free && !path)
    ) {
      // setStep((prevStep) => prevStep + 1);
      if (path)
        tryimageRef.current && free && !upload
          ? handelSubmit3()
          : handelSubmit2();
    } else if (free && !onecredit && !upload) {
      // setStep((prevStep) => prevStep + 1);
      handelSubmit3();
    } else if (!free || upload || onecredit) {
      // setStep((prevStep) => prevStep + 1);
      handelSubmit2();
    }
  };

  let isDrawing = false;
  let currentPath = null;
  const paths = useRef([]);

  useEffect(() => {
    const fetchToken = async () => {
      const accessToken = await getAccessToken();
      setAccessToken(accessToken);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (step == 1) {
      isCompleted.current = false
    }
  }, [step])

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

  useEffect(() => {
    if (step == 1) {
      setUpload(false);
    }
    if (step == 3 || step == 2 || step == 1) {
      setOverridePrompt("");
      SetFinalImage("");
    }
    if (customize && step == 2) {
      const canvasNew = new fabric.Canvas("c");
      canvasRef.current = canvasNew;
      const url = mask;

      fabric.Image.fromURL(url, (img) => {
        var containerWidth = maskDiv.current?.clientWidth;
        scale.current = containerWidth / img.width;
        var containerHeight = img.height * scale.current;
        orgWidthRef.current = img.width;
        orgHeightRef.current = img.height;
        canvasRef.current.setZoom(scale.current);
        canvasRef.current.setWidth(containerWidth);
        canvasRef.current.setHeight(containerHeight);
        const oImg = img.set({ left: 0, top: 0, selectable: false });
        canvasRef.current.add(oImg).renderAll();

        canvasRef.current.on("mouse:down", (o) => {
          canvasRef.current.selection = false; // Disable selection while drawing
          isDrawing = true;
          const pointer = canvasRef.current.getPointer(o.e);
          let points = [pointer.x, pointer.y];
          currentPath = new fabric.Path(`M ${points.join(" ")} `, {
            fill: "",
            stroke: brushColor.current,
            strokeWidth: brushSize.current,
            selectable: false,
            strokeLineCap: "round",
            objectCaching: false, // Turn off object caching
          });
          canvasRef.current.add(currentPath);
        });

        canvasRef.current.on("mouse:move", (o) => {
          if (!isDrawing) return;
          const pointer = canvasRef.current.getPointer(o.e);
          let points = [pointer.x, pointer.y];
          currentPath.path.push(["L", ...points]);
          currentPath.dirty = true;
          canvasRef.current.renderAll();
        });

        canvasRef.current.on("mouse:up", (o) => {
          isDrawing = false;
          paths.current.push(currentPath);
          currentPath = null;
          canvasRef.current.selection = true; // Enable selection after drawing
        });
      });

      // Clean up function
      return () => {
        canvasRef.current.dispose();
      };
    }
  }, [customize, step]);

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
    setSelectedImageIndex(
      `${free && !onecredit ? decluttering : decluttering}`.indexOf(image)
    );
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
    const file = acceptedFiles[0];
    if (free && !onecredit) {
      router.push("/plans");
    } else {
      setMask("");
      setSelectedImage("");
      if (acceptedFiles[0]) {
        const allowedTypes = [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/webp",
        ];
        setBtn(true);
        setCustomize(false);

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
            if (oldProgress === 90 && mask.trim() === "") {
              newProgress = 90;
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
      `${process.env.NEXT_PUBLIC_API_URI}/api/models/uploadimage?modelName=clutteringCredit`,
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

        if (data?.fileurl) {
          setLoading(false);
          setSelectedImage(fileUrls);
          setStep(2);
          setIsCompletedStep(false);
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

  useEffect(() => {
    if (customize && step == 10) {
      const canvasNew = new fabric.Canvas("c");

      fabric.Image.fromURL(mask, (img) => {
        var containerWidth = maskDiv.current?.clientWidth;
        const scales = containerWidth / img.width;
        setScale(scales);
        canvasNew.setZoom(scales);
        canvasNew.setWidth(containerWidth);
        canvasNew.setHeight(img.height * scales);
        const oImg = img.set({ left: 0, top: 0, selectable: false });
        canvasNew.add(oImg).renderAll();

        canvasNew.on("mouse:down", (o) => {
          canvasNew.selection = false;
          isDrawing = true;
          const pointer = canvasNew.getPointer(o.e);
          let points = [pointer.x, pointer.y];
          currentPath = new fabric.Path(`M ${points.join(" ")} `, {
            fill: "",
            stroke: brushColor.current,
            strokeWidth: brushSize.current,
            selectable: false,
            strokeLineCap: "round",
            objectCaching: false,
          });
          canvasNew.add(currentPath);
        });

        canvasNew.on("mouse:move", (o) => {
          if (!isDrawing) return;
          const pointer = canvasNew.getPointer(o.e);
          let points = [pointer.x, pointer.y];
          currentPath.path.push(["L", ...points]);
          currentPath.dirty = true;
          canvasNew.renderAll();
        });

        canvasNew.on("mouse:up", (o) => {
          isDrawing = false;
          paths.current.push(currentPath);
          currentPath = null;
          canvasNew.selection = true; // Enable selection after drawing
        });
      });
      canvasRef.current = canvasNew;

      // Clean up function
      return () => {
        canvasNew.dispose();
      };
    }
  }, [customize, step]);

  // 2nd
  const handleImageClick = () => {
    setStep(2);
    setBtn(true);
    // setCustomize(false);
    // tryimageRef.current = true;
    // regenRef.current = 0;
    free && handelSubmitForGallery();
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
    setOverridePrompt("");
    architectureRef.current =
      refurnishingData[selectedRoomType]?.architecture_style[0]?.style;
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
        if (oldProgress === 90 && finalImage === "") {
          newProgress = 90;
        }
        return newProgress;
      });
    }, 500);

    const imageURLs = [
      "https://storage.googleapis.com/store-gallery-img-results/staging/64b78bd551240_bedroom_modern_2.jpg",
      "https://storage.googleapis.com/store-gallery-img-results/staging/64b78bd551240_bedroom_modern_3.jpg",
      "https://storage.googleapis.com/store-gallery-img-results/staging/64b78bd551240_bedroom_modern_4.jpg",
      "https://storage.googleapis.com/store-gallery-img-results/staging/64b78bd551240_bedroom_modern_5.jpg",
    ];

    // Assuming these are the values from your selection
    let commonValue = null;
    if (selectedImage == decluttering[0]) {
      commonValue = "gallery-results/1";
    } else if (selectedImage == decluttering[1]) {
      commonValue = "gallery-results/2";
    } else if (selectedImage == decluttering[2]) {
      commonValue = "gallery-results/3";
    } else if (selectedImage == decluttering[3]) {
      commonValue = "gallery-results/4";
    } else if (selectedImage == decluttering[4]) {
      commonValue = "gallery-results/5";
    } else if (selectedImage == decluttering[5]) {
      commonValue = "gallery-results/6";
    }

    const selectedRoom = roomRef.current;
    const selectedStyle = architectureRef.current;

    // Extract the common value from the selected image using a regex (assuming the structure remains consistent)
    const match = selectedImage.match(/([^\/]+)\.jpg$/);
    // const commonValue = "64b78bd551240"; // Adjust the slice value based on the length of the common ID
    // Filter images based on the common value, selectedRoom and selectedStyle
    const filteredImages = declutteringDummy.filter((url) =>
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
      image_url: randomImage ? randomImage : selectedImage,
      architecture_style: selectedStyle,
      room_type: selectedRoom,
      do_preprocess: true
    };
    const ApiKey = "HLOH64Q4-20230313-OOQV9VVR";

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/models/virtualRefurnishing`,
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
        .then((data) => {
          if (free == true) {
            // regenRef.current = regenRef.current + 1;..
          }
          createFinalImage3(data.message.result.imageUrl);
        });
    } catch (err) {
      toast.error("Image can't be process");
      setStep(1);
    };
  };

  const createFinalImage3 = async (data) => {
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
        if (oldProgress === 90 && finalImage === "") {
          newProgress = 90;
        }
        return newProgress;
      });
    }, 500);
    var storedData = localStorage.getItem("virtualstage");
    var parsedData = JSON.parse(storedData);
    let formData = {};
    formData = {
      image_url: selectedImage,
      room_type: roomRef.current,
      architecture_style: architectureRef.current,
      do_preprocess: true
    };
    const ApiKey = "HLOH64Q4-20230313-OOQV9VVR";

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/models/virtualRefurnishing`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": ApiKey,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!data.message.result.imageUrl) {
        throw new Error("Failed to generate final image");
      }

      if (free === true) {
        regenRef.current = regenRef.current + 1;
      }

      SetFinalImage(data.message.result.imageUrl);
      setProgress(100);
      setImageDownload(data.message.result.imageUrl);

      // Continue with the rest of your code after all API calls are completed
      setBtn(false);
      setBackBtn(false);

      if (!overridePrompt) {
        if (roomRef.current == "bathroom") {
          setOverridePrompt(
            "a photograph of a bathroom, adrie bathroom set,  sink and bathtub, bathroom set by Kelly Clarkson home, interior design, HD, 4K high resolution"
          );
        } else if (roomRef.current == "kitchen") {
          setOverridePrompt(
            "a photograph of a kitchen, adrie kitchen set,  counter and kitchen island space, kitchen set by Kelly Clarkson home, interior design, HD, 4K high resolution"
          );
        } else if (roomRef.current == "bedroom") {
          setOverridePrompt(
            "a photograph of a bedroom, adrie bedroom set,  bed, bedroom set by Kelly Clarkson home, interior design, furniture stock, HD, 4K high resolution"
          );
        } else if (roomRef.current == "living room") {
          setOverridePrompt(
            "a photograph of a living room, adrie living room set,  3 piece sofa set, living room set by Kelly Clarkson home, interior design, furniture stock, HD, 4K high resolution"
          );
        }
      }
    } catch (error) {
      toast.error("Failed to generate final image");
      setBtn(false);
      setBackBtn(false);
      setStep(3);
      if (!refurnishingData) {
        toast.error("Failed to generate mask");
        setBtn(false);
        setBackBtn(false);
        setStep(1);
        return;
      }
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
            Authorization: `Bearer ${token}`,
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

  return (
    <AuhtProvider>
      <div className={`flex flex-col ${step == 2 ? 'max-w-[1700px]' : 'max-w-[1100px]'} m-[50px_auto] w-[90%]`}>
        <p
          className={`backtoStep ${backBtn ? "disabled" : ""}`}
          onClick={() => {
            if (step === 1) {
              router.push("/");
            } else if (step == 4 && free == true && regenRef.current > 1) {
              setStep(1);
              localStorage.removeItem("virtualstage2");
              localStorage.removeItem("virtualstage4");
              regenRef.current = 0;
            } else if (step !== 1) {
              setStep(1);
              setIsDemo(false);
              setSelectedImage("https://storage.googleapis.com/store-gallery-img-results/staging/input_images/1.jpg");
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
          {free == true && step === 4 && regenRef.current > 1 ? (
            <Translate text="Back to upload" />
          ) : step === 1 ? (
            <Translate text="Back to store" />
          ) : (
            <Translate text={`Back to Step ${step - 1}`} />
          )}
        </p>

        {/*///////////////////////////////////////////////// top progress bar     /////////////////////////////*/}
        <div className="virtualStagingParaBox">
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
                data={refurnishingData[roomRef.current].architecture_style}
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
                modelName="virtual refurnishing"
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
                NameModel="cluterringCredit"
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
                overridePrompt={overridePrompt}
                setOverridePrompt={setOverridePrompt}
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
                mainText="82% of buyers’ agents said virtual refurnishing made it easier for a buyer to
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
                imageUrlsBefore2={decluttering}
                imageUrlsBefore={imageUrlsBefore}
                imageUrlsAfter={imageUrlsAfter}
                free={free}
                loading={loading}
                stepsData={{ step }}
                NameModel="cluterringCredit"
                downSlide={{
                  mainHeading: "How to use the Virtual Staging tool",
                  toolSteps: [
                    {
                      image: "/virtualhome_img/firstcardimage.png",
                      title: "Click to upload image",
                      des: "Add one image",
                    },
                    {
                      image: "/virtualhome_img/roomtypedecluttering.png",
                      title: "Select room type and style",
                      des: "",
                    },
                    {
                      image: "/virtualhome_img/thirdcardpic.png",
                      title: "Download the refurnished image from your library",
                      des: "Free plan users can regenerate the same image one time, while premium users have unlimited regenerations and watermark-free downloads.",
                    },
                  ],
                }}
                modelName="virtual refurnishing "
              />
            </>
          )}
        </div>
      </div>
    </AuhtProvider>
  );
};

export default Cluttering;
