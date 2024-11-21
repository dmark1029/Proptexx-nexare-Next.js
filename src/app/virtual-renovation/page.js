"use client";
import React, { useEffect, useCallback, useRef, useState } from "react";
import "../../styles/VirtualRenovation.css";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { LinearProgress } from "@mui/material";
import StepOne from "@/components/StepOne";
import Stepper from "@/components/Stepper";
import StepFour from "@/components/StepFour";
import StepFive from "@/components/StepFive";
import StepSix from "@/components/StepSix";
import { renoImageUrlsBefore2 } from "@/utils/imagesPath";
import { toast } from "react-toastify";
import { dummyImages } from "@/utils/deummyreno";
import { useRouter } from "next/navigation";
import AuhtProvider from "@/components/AuthProvider";
import { whiteLabeled } from "@/utils/sampleData";
import { useDispatch, useSelector } from "react-redux";
import Translate from "@/components/Translate";
import { renovationData } from "@/utils/data";
import { setUser } from "@/Redux/slices/authSlice";

const VirtualRenovation = () => {
  // let user = true;
  const router = useRouter();
  const { token, user } = useSelector((state) => state.auth.user);
  const { redirection } = useSelector((state) => state.auth);
  let free = user?.planName == "free" || !token ? true : false;
  const [lastClicked, setLastClicked] = useState("forward");
  const [step, setStep] = useState(redirection?.stepNo || 1);
  const [mask, setMask] = useState("");
  const [realImage, setRealImage] = useState("");
  const [imageDownload, setImageDownload] = useState("");
  const [finalImage, SetFinalImage] = useState("");
  const [mask_url, setMaskUrl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [btn, setBtn] = useState(true);
  const [backBtn, setBackBtn] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(renoImageUrlsBefore2[0]);
  const [customize2, setCustomize2] = useState(false);
  const [noDetect, setNodetect] = useState(false);
  const [canvasWithHiegth, setCanvasWithHiegth] = useState({
    width: 0,
    height: 0,
  });
  const [upload, setUpload] = useState(false);
  const dispatch = useDispatch();
  const [colorobject, setColorObject] = useState({});
  const [restore, setRestore] = useState(false);
  const [submit, setsubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const scale = useRef(null);
  const maskDiv = useRef(null);
  const original = useRef(renoImageUrlsBefore2[0]);
  const timerRef = useRef(null);
  const progressTimeRef = useRef(200);
  const roomRef = useRef("bedroom");
  const materialTypeRef = useRef("wooden");
  const maskUrlRef = useRef(mask_url);
  const room_objectRef = useRef("wall");
  const regenRef = useRef(0);
  const tryimageRef = useRef(false);
  const [, setDummy] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const baseImageRef = useRef(null);
  const layersRef = useRef({});
  const mergedCanvasRef = useRef(null);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [activeIndexTypeModern, setActiveIndexTypeModern] = useState(0);
  const [overridePrompt, setOverridePrompt] = useState(null);
  const onecredit = user?.usercredit?.renovationCredit;

  const imageUrlsBefore = [
    "renovation_images/before1.jpg",
    "renovation_images/before2.jpg",
    "renovation_images/before3.jpg",
    "renovation_images/before4.jpg",
    "renovation_images/before5.jpg",
    "renovation_images/before6.jpg",
  ];

  const imageUrlsAfter = [
    "renovation_images/after1.jpg",
    "renovation_images/after2.jpg",
    "renovation_images/after3.jpg",
    "renovation_images/after4.jpg",
    "renovation_images/after5.jpg",
    "renovation_images/after6.jpg",
  ];

  const steps = [
    {
      name: "Upload Image",
    },
    {
      name: "Select Room Type",
    },
    {
      name: "Select Furnishing Material",
    },
    {
      name: "Review Result",
    },
  ];

  useEffect(() => {
    if (step == 1) {
      setUpload(false);
    }
    if (customize2 && step == 2) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = maskUrlRef.current; // TODO: Replace with your image path
      img.onload = () => {
        const containerWidth = maskDiv.current.clientWidth;
        scale.current = containerWidth / img.width;
        const containerHeight = img.height * scale.current;
        setCanvasWithHiegth({
          width: containerWidth,
          height: containerHeight,
        });
        const canvas = baseImageRef.current;
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, containerWidth, containerHeight); // Added width and height
        createLayers(ctx);
        // Select and show the first object after layers are created
        if (forceUpdate == false) {
          if (colorobject && Object.keys(colorobject).length > 0) {
            const firstObjectName = Object.keys(colorobject)[0];
            toggleObject(firstObjectName);
          }
        }
      };
    }
  }, [customize2, step, forceUpdate, token]);

  const createLayers = (ctx) => {
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
    const pixels = imageData.data;

    Object.entries(colorobject).forEach(([objectName, color]) => {
      const [r, g, b] = hexToRgb(color);
      const layerCanvas = document.createElement("canvas");
      layerCanvas.width = ctx.canvas.width;
      layerCanvas.height = ctx.canvas.height;
      const layerCtx = layerCanvas.getContext("2d");
      const layerImageData = layerCtx.createImageData(
        ctx.canvas.width,
        ctx.canvas.height
      );
      const colorThresholds = {
        "#00ADFF": 63,
        "#FF0000": 40,
        "#CC05FF": 20,
        "#E005FF": 20,
        // ... other colors
      };

      const threshold = colorThresholds[color] || 30;

      for (let i = 0; i < pixels.length; i += 4) {
        if (
          colorDistance([r, g, b], [pixels[i], pixels[i + 1], pixels[i + 2]]) <
          threshold
        ) {
          layerImageData.data[i] = pixels[i];
          layerImageData.data[i + 1] = pixels[i + 1];
          layerImageData.data[i + 2] = pixels[i + 2];
          layerImageData.data[i + 3] = 255; // Alpha channel
        }
      }

      layerCtx.putImageData(layerImageData, 0, 0);
      layersRef.current[objectName] = layerCanvas;
    });
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  const colorDistance = (color1, color2) => {
    return Math.sqrt(
      Math.pow(color1[0] - color2[0], 2) +
        Math.pow(color1[1] - color2[1], 2) +
        Math.pow(color1[2] - color2[2], 2)
    );
  };

  const regenerateprev = () => {
    setCustomize2(false);
    setStep(2);
    setTimeout(() => {
      setCustomize2(true);
      mergeLayers(selectedObjects); // Merge and show previously selected layers
    }, 1000);
  };

  const toggleObject = (objectName) => {
    setActiveIndexTypeModern("null");
    let timeoutset = 0;
    if (forceUpdate == false) {
      timeoutset = 10;
      setForceUpdate(true);
    } else {
      timeoutset = 0;
    }
    setTimeout(() => {
      if (restore == true) {
        mergeLayers(selectedObjects);
        setRestore(false);
      } else {
        setSelectedObjects((prev) => {
          const newSelected = prev.includes(objectName) ? [] : [objectName];
          mergeLayers(newSelected);
          if (newSelected.length > 0) {
            room_objectRef.current = newSelected[0];
          }
          return newSelected;
        });
      }
    }, timeoutset);
  };

  const mergeLayers = (layers) => {
    const canvas = mergedCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    layers.forEach((objectName) => {
      ctx.drawImage(layersRef.current[objectName], 0, 0);
    });
  };

  const recreateCanvas = () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = maskUrlRef.current;
    img.onload = () => {
      const canvas = baseImageRef.current;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      createLayers(ctx);
      mergeLayers(selectedObjects);
    };
  };

  const customFunction = (storage, path) => {
    if (selectedObjects.length === 0) {
      toast.error("*Minimum one room object must be selected");
      return;
    }
    if (
      (user && storage !== "virtualreno2" && path) ||
      (free && regenRef.current <= 1 && !path) ||
      (!free && !path)
    ) {
      setStep((prevStep) => prevStep + 1);
      if ((path && !free) || (path && (onecredit || upload))) handelSubmit2();
      else handelSubmit4();
    } else if ((free && regenRef.current > 1) || path) {
      setStep((prevStep) => prevStep + 1);
      handelSubmit4();
    }
  };
  useEffect(() => {
    const dateReStoring = (state) => {
      var storedData = localStorage.getItem(state);
      var parsedData = JSON.parse(storedData);
      if (parsedData) {
        roomRef.current = parsedData.room_type;
        const newindex = Object.keys(renovationData).indexOf(
          roomRef.current.toLowerCase()
        );
        (maskUrlRef.current = parsedData.mask),
          (original.current = parsedData.image),
          (materialTypeRef.current = parsedData.material_style);
        room_objectRef.current = parsedData.objectRef;
        setMask(parsedData.mask);
        setActiveIndexTypeModern(parsedData.activeIndexTypeModern);
        setSelectedImage(parsedData.image);
        setStep(parsedData.step);
        setBtn(false);
        setRestore(true);
        setRealImage(parsedData.image);
        setSelectedObjects(parsedData?.colors);
        setColorObject(parsedData?.colors2);
        tryimageRef.current = parsedData.try;

        if (state === "virtualreno2") {
          regenRef.current = parsedData.regen;
          setImageDownload(parsedData.download);
          SetFinalImage(parsedData.preview);
        }
        if (state !== "virtualreno2") {
          if (user === true) {
            setStep(parsedData.step + 1);
            state === "virtualreno" && handelSubmit2();
          }
        }
        localStorage.removeItem(state);
      }
    };
    dateReStoring("virtualreno");
    dateReStoring("virtualreno2");
  }, []);

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

  ///////////////////back and forward image click ended///////////////////////////////////
  const nextPage = () => {
    if (step == 2 && selectedObjects.length === 0) {
      toast.error("*Minimum one room object must be selected");
      return;
    }
    setStep((prevStep) => prevStep + 1);
  };
  const handelImageSelect = (image) => {
    original.current = image;
    setSelectedImage(image);
  };

  const handleImageClick = () => {
    tryimageRef.current = true;
    setCustomize2(false);
    setColorObject({});
    setSelectedObjects([]);
    setForceUpdate(false);
    setNodetect(false);
    baseImageRef.current = null;

    if (timerRef.current) {
      clearInterval(timerRef.current); // clear existing timer
    }
    setProgress(0); // reset progress
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
    }, 1300);
    setRealImage(original.current);
    setStep((prevStep) => prevStep + 1);
    setMask("");
    setMaskUrl("");
    setBtn(true);
    maskUrlRef.current = "";
    if (free && !onecredit) {
      handelSubmit3();
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

  ////////////////////back and forward button ended////////////////////////////////////

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setMask("");
    setMaskUrl("");
    setRealImage("");
    maskUrlRef.current = "";
    original.current = " ";
    if (file) {
      newFileUpload(file);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
      setBtn(true);
      setCustomize2(false);
      setColorObject({});
      setSelectedObjects([]);
      setForceUpdate(false);
      setNodetect(false);
      baseImageRef.current = null;
    } else {
      alert("Unsupport Format");
      return;
    }

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

        if (oldProgress === 90 && mask.trim() === "") {
          newProgress = 90;
        }

        return newProgress;
      });
    }, 1200);
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
    setLoading(true);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/api/models/uploadimage?modelName=renovationCredit`,
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
          setLoading(false);
          setStep((prevStep) => prevStep + 1);
          setRealImage(data.fileurl);
          setSelectedImage(data.fileurl);
          original.current = data.fileurl;
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
          setLoading(false);
          alert("Upload Failed");
          setStep(1);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handelSubmit3 = async () => {
    let colordummy = {};
    setTimeout(() => {
      if (original.current == "https://i.ibb.co/bbFZgX3/obj-rem-gal-3.jpg") {
        setMask("https://i.ibb.co/QdndvZ3/1.png");
        maskUrlRef.current = "https://i.ibb.co/QdndvZ3/1.png";
        colordummy = { floor: "#503232", wall: "#787878" };
        roomRef.current = "bedroom";
      } else if (
        original.current == "https://i.ibb.co/khcxggx/vir-reno-2.jpg"
      ) {
        setMask("https://i.ibb.co/Vgc4WnQ/2.png");
        maskUrlRef.current = "https://i.ibb.co/Vgc4WnQ/2.png";
        colordummy = { floor: "#503232", wall: "#787878" };
        roomRef.current = "bedroom";
      } else if (
        original.current == "https://i.ibb.co/wypMqQr/vir-reno-3.jpg"
      ) {
        setMask("https://i.ibb.co/rbSg6kB/3.png");
        maskUrlRef.current = "https://i.ibb.co/rbSg6kB/3.png";
        colordummy = { floor: "#503232", wall: "#787878" };
        roomRef.current = "bedroom";
      } else if (
        original.current == "https://i.ibb.co/HC2zqdK/vir-reno-4.jpg"
      ) {
        setMask("https://i.ibb.co/YLQzTq4/4.png");
        maskUrlRef.current = "https://i.ibb.co/YLQzTq4/4.png";
        colordummy = { floor: "#503232", wall: "#787878" };
        roomRef.current = "bedroom";
      } else if (
        original.current == "https://i.ibb.co/d6Jz2DB/vir-reno-5.jpg"
      ) {
        setMask("https://i.ibb.co/Jkjv5fM/5.png");
        maskUrlRef.current = "https://i.ibb.co/Jkjv5fM/5.png";
        colordummy = { floor: "#503232", wall: "#787878" };
        roomRef.current = "living room";
      } else if (
        original.current == "https://i.ibb.co/HpRZX9Y/vir-reno-6.jpg"
      ) {
        setMask("https://i.ibb.co/hmDq6XN/6.png");
        maskUrlRef.current = "https://i.ibb.co/hmDq6XN/6.png";
        colordummy = { floor: "#503232", wall: "#787878" };
        roomRef.current = "living room";
      }

      setProgress(100);
      setBtn(false);
      setBackBtn(false);
      setsubmit(false);
      const filterColors = (colors) => {
        const unwantedKeys = ["bed"];
        const filteredColors = Object.keys(colors)
          .filter((key) => !unwantedKeys.includes(key))
          .reduce((obj, key) => {
            obj[key] = colors[key];
            return obj;
          }, {});

        return filteredColors;
      };

      const filteredColors = filterColors(colordummy);
      setColorObject(filteredColors);
      if (Object.keys(filteredColors).length === 0) {
        setNodetect(true);
      }
      setColorObject(filteredColors);
      if (step == 1) {
        setCustomize2(true);
      }
    }, 5000);
    setDummy(true);
  };

  const handelSubmit4 = async () => {
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

    // Assuming these are the values from your selection
    let commonValue = null;
    if (selectedImage == "https://i.ibb.co/bbFZgX3/obj-rem-gal-3.jpg") {
      commonValue = "1";
    } else if (selectedImage == "https://i.ibb.co/khcxggx/vir-reno-2.jpg") {
      commonValue = "2";
    } else if (selectedImage == "https://i.ibb.co/wypMqQr/vir-reno-3.jpg") {
      commonValue = "3";
    } else if (selectedImage == "https://i.ibb.co/HC2zqdK/vir-reno-4.jpg") {
      commonValue = "4";
    } else if (selectedImage == "https://i.ibb.co/d6Jz2DB/vir-reno-5.jpg") {
      commonValue = "5";
    } else if (selectedImage == "https://i.ibb.co/HpRZX9Y/vir-reno-6.jpg") {
      commonValue = "6";
    }

    const selectedObj = selectedObjects[0].replace(/ /g, "_").toLowerCase();
    const selectedRoom = roomRef.current.replace(/ /g, "_").toLowerCase();

    // Extract the common value from the selected image using a regex (assuming the structure remains consistent)
    const match = selectedImage.match(/([^\/]+)\.jpg$/);
    // const commonValue = "64b78bd551240"; // Adjust the slice value based on the length of the common ID
    // Filter images based on the common value, selectedRoom and selectedStyle
    const filteredImages = dummyImages.filter((url) =>
      url.includes(
        `${commonValue}_${selectedObj}_${selectedRoom}_${materialTypeRef.current}`
      )
    );
    // Select one image randomly
    const randomImage = filteredImages.length
      ? filteredImages[Math.floor(Math.random() * filteredImages.length)]
      : null;
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/api/models/dummypmagepreview`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image_url: randomImage }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (free == true) {
          // regenRef.current = regenRef.current + 1;
        }
        createFinalImage3(data.image);
        setImageDownload(data.link);
      });
  };
  const createFinalImage3 = async (data) => {
    setTimeout(() => {
      setProgress(100);
      SetFinalImage(data);
      setBtn(false);
    }, 1000);
  };

  const handelSubmit = async () => {
    setBackBtn(true);
    if (submit == true) {
      return;
    }
    setsubmit(true);
    const data = {
      image_url: original.current,
      room_type: roomRef.current,
      modelName: "virtual renovation",
      return_mask: true,
    };
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URI}/api/models/virtualRenovation`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data == undefined) {
          toast.error("Failed to generate mask");
          setStep(1);
          setBtn(false);
          setBackBtn(false);
          setsubmit(false);
          return;
        } else if (response.data) {
          roomType();
          setTimeout(() => {
            setMask(response.data.image);
            setsubmit(false);
            maskUrlRef.current = response.data.image;
            const filteredColors = ["floor", "wall", "ceiling"].reduce(
              (acc, item) => {
                if (response?.data?.detected_objects[item]) {
                  acc[item] = response?.data?.detected_objects[item];
                }
                return acc;
              },
              {}
            );

            if (Object.keys(filteredColors).length === 0) {
              setNodetect(true);
            }
            setColorObject(filteredColors);
          }, 1000);
        } else {
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
          toast.error(`Failed To Generate Mask`);
        }
        setStep(1);
        setBtn(false);
        setsubmit(false);
        setBackBtn(false);
      });
  };

  const bathroomList = ["bathroom", "laundry"];
  const livingList = [
    "basement",
    "living room",
    "office",
    "closet",
    "game room",
    "cinema room",
    "library builing",
    "loft design",
    "wine room",
    "bar",
    "storage room",
    "lobby",
    "billiard room",
    "mud room",
    "studio",
    "hearth room",
    "play room",
    "computer room",
    "amusement room",
  ];
  const kitchenList = ["kitchen", "dining", "pantry", "informal dining room"];
  const bedroomList = ["bedroom", "children room", "empty room"];

  const roomType = async () => {
    setBackBtn(true);
    const data = {
      image_url: original.current,
      model_name: "room_type",
    };
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URI}/api/models/roomtype`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.room_type == undefined) {
          toast.error("Failed to get room type");
          setStep(1);
          setBtn(false);
          setBackBtn(false);
          return;
        } else if (response.data.room_type) {
          setProgress(100);
          let roomtyperes = response.data.room_type.toLowerCase();
          if (bedroomList.includes(roomtyperes)) {
            roomRef.current == "bedroom";
          } else if (kitchenList.includes(roomtyperes)) {
            roomRef.current = "kitchen";
          } else if (livingList.includes(roomtyperes)) {
            roomRef.current = "living room";
          } else if (bathroomList.includes(roomtyperes)) {
            roomRef.current = "bathroom";
          } else {
            roomRef.current = "bedroom";
          }

          if (step == 1) {
            setCustomize2(true);
          }
        } else {
          toast.error("Failed to get room type");
        }
      })
      .catch((error) => {
        toast.error(`Failed to get room type`);
        setStep(1);
        setBtn(false);
        setBackBtn(false);
      });
  };

  useEffect(() => {
    if (step == 2 && restore == true) {
      setTimeout(() => {
        recreateCanvas();
      }, 100);
    }
    if (step == 2 && baseImageRef.current != null) {
      setTimeout(() => {
        regenerateprev();
      }, 100);
    }
  }, [step]);

  ///////////////////////////upload mask on s3 ennded/////////////////////////////

  const handlePositionChange = useCallback((position) => {
    setSliderPosition(position);
  }, []);

  const handelSubmit2 = async () => {
    if (submit == true) {
      return;
    }
    setsubmit(true);
    if (free && regenRef.current > 2 && !onecredit && !upload) {
      return;
    }
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
    }, 1000);
    var storedData = localStorage.getItem("virtualreno");
    var parsedData = JSON.parse(storedData);

    const formData = {
      image_url: original.current,
      room_type: roomRef.current,
      mask_url: maskUrlRef.current,
      material_type: materialTypeRef.current,
      modelName: "virtual renovation",
      room_object: parsedData?.colors || selectedObjects,
      override_prompt: overridePrompt,
    };
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/models/virtualRenovation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data == undefined) {
          toast.error("Failed To Generate Image");
          setBtn(false);
          setStep(4);
          setsubmit(false);
          return;
        }

        if (free == true) {
          regenRef.current = regenRef.current + 1;
        }
        createFinalImage(data.preview);
        setImageDownload(data.link);
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
        setsubmit(false);
      })
      .catch((error) => {
        setStep(4);
        toast.error(`Failed To Generate Mask`);
        setsubmit(false);
      });
  };
  const createFinalImage = async (data) => {
    setProgress(100);
    setTimeout(() => {
      SetFinalImage(data);
      setBtn(false);
    }, 1000);
  };
  return (
    <AuhtProvider>
      <div className="flex flex-col max-w-[1100px] m-[50px_auto] w-[90%]">
        <p
          className={`backtoStep ${backBtn ? "disabled" : ""}`}
          onClick={() => {
            if (step === 1) {
              router.push("/");
            } else if (step == 5 && free == true && regenRef.current > 1) {
              setStep(1);
              localStorage.removeItem("virtualreno2");
              regenRef.current = 0;
            } else {
              setStep((prevStep) => prevStep + -1);
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
          {free == true && step === 5 && regenRef.current > 1 ? (
            <Translate text="Back to upload" />
          ) : step === 1 ? (
            <Translate text="Back to store" />
          ) : (
            <Translate text={`Back to Step ${step - 1}`} />
          )}
        </p>

        {/*///////////////////////////////////////////////// top progress bar     /////////////////////////////*/}
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
            <Translate text="AI Virtual Renovation" />
          </p>

          {/* 2nd page */}

          {step == 2 && (
            <div>
              <>
                <>
                  <Stepper
                    stepperClass="renovationStepBoxText"
                    progressSteps={steps}
                    step={step}
                  />
                </>
                <p className="step2Para !text-mainColor">
                  <Translate text="Step 2" />{" "}
                  <span className="step2ParaSpan">
                    - <Translate text="Select Layout" />
                  </span>
                </p>

                <p className="GeneratePara">
                  <Translate
                    text="Select architectural elements to renovate by clicking below in
                  detected elements"
                  />
                </p>
                <div className="boxouter">
                  <div className="brushBoxCard">
                    <div className="detect-container">
                      <div className="detect-heading">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.3998 16.2273V13.6001C14.3998 13.3879 14.3155 13.1844 14.1655 13.0344C14.0155 12.8844 13.812 12.8001 13.5998 12.8001H11.9998C11.7877 12.8001 11.5842 12.8844 11.4341 13.0344C11.2841 13.1844 11.1998 13.3879 11.1998 13.6001V16.2257C9.98403 16.5368 8.88687 17.1993 8.04542 18.1304C7.20397 19.0615 6.65553 20.2199 6.46863 21.4609C6.45038 21.5766 6.45739 21.6948 6.48919 21.8075C6.52098 21.9203 6.57681 22.0247 6.65282 22.1138C6.72883 22.2029 6.82323 22.2745 6.92953 22.3236C7.03584 22.3728 7.15152 22.3983 7.26863 22.3985H18.3438C18.4609 22.3983 18.5766 22.3728 18.6829 22.3236C18.7892 22.2745 18.8836 22.2029 18.9596 22.1138C19.0356 22.0247 19.0915 21.9203 19.1233 21.8075C19.1551 21.6948 19.1621 21.5766 19.1438 21.4609C18.9557 20.2186 18.4052 19.0594 17.5614 18.1284C16.7175 17.1975 15.6178 16.5361 14.3998 16.2273ZM21.8222 10.0465L17.8222 2.0465C17.7564 1.91289 17.6546 1.80031 17.5282 1.72144C17.4018 1.64257 17.256 1.60055 17.107 1.6001H8.49263C8.34445 1.6004 8.19927 1.64185 8.07327 1.71982C7.94727 1.79779 7.84541 1.90923 7.77902 2.0417L3.77902 10.0417C3.71809 10.1633 3.68916 10.2984 3.69498 10.4343C3.70079 10.5702 3.74116 10.7024 3.81227 10.8183C3.88338 10.9343 3.98288 11.0302 4.10136 11.097C4.21985 11.1638 4.35341 11.1993 4.48942 11.2001H17.5998V13.6001C17.5998 13.8123 17.6841 14.0158 17.8341 14.1658C17.9842 14.3158 18.1877 14.4001 18.3998 14.4001C18.612 14.4001 18.8155 14.3158 18.9655 14.1658C19.1155 14.0158 19.1998 13.8123 19.1998 13.6001V11.2001H21.1102C21.2457 11.1991 21.3788 11.1638 21.4968 11.0974C21.6149 11.0309 21.7142 10.9356 21.7854 10.8203C21.8566 10.705 21.8973 10.5735 21.9037 10.4381C21.9102 10.3028 21.8821 10.168 21.8222 10.0465Z"
                            fill={whiteLabeled ? "#c82021" : "#000000"}
                          />
                        </svg>
                        <strong>
                          <Translate text="Detected Architectural Elements" />
                        </strong>
                      </div>
                      <div className="detect-object-label">
                        {mask && progress == 100 ? (
                          <ul>
                            {Object.keys(colorobject).map((objectName) => (
                              <li
                                key={objectName}
                                className={
                                  selectedObjects.includes(objectName)
                                    ? "active"
                                    : ""
                                }
                                onClick={() => toggleObject(objectName)}
                              >
                                <Translate text={objectName} />
                              </li>
                            ))}
                            {noDetect ? (
                              <p
                                style={{
                                  color: "red",
                                  fontSize: "0.8rem",
                                  textAlign: "center",
                                }}
                              >
                                <Translate
                                  text="*No Floor, wall, and Ceiling Detected from this
                                image"
                                />
                              </p>
                            ) : (
                              ""
                            )}
                          </ul>
                        ) : (
                          <div className="spinner mx-3" id="spinner"></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="rightBoxInnter">
                    <div className="manualLayoutPara !text-mainColor">
                      <Translate text="Manual Layout" />
                    </div>

                    <div className="manualLayoutImg" style={{ height: "auto" }}>
                      {mask && progress == 100 ? (
                        <div
                          id="myElement"
                          ref={maskDiv}
                          style={{
                            backgroundImage: `url("${realImage}")`,
                            position: "relative",
                            overflow: "hidden",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                          }}
                        >
                          <div id="canvas_container">
                            {/* <canvas
                            id="c"
                            style={{ mixBlendMode: "darken" }}
                          ></canvas> */}
                            <canvas
                              ref={baseImageRef}
                              style={{ display: "none" }}
                            ></canvas>
                            <canvas
                              ref={mergedCanvasRef}
                              width={canvasWithHiegth.width}
                              height={canvasWithHiegth.height}
                            ></canvas>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="progressBarAdvance">
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                            />
                          </div>
                          <div className="imageDivBox w-[100%] max-w-[100%]">
                            <img
                              className="imageBoxLoader"
                              style={{
                                maxHeight: "300px",
                                objectFit: "contain",
                                margin: "20px 0px",
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
                        </div>
                      )}
                    </div>
                    <div className="w-[100%] mt-[20px]">
                      <button
                        disabled={!mask || progress != 100 || noDetect || false}
                        className="confirmandcon"
                        onClick={nextPage}
                      >
                        <Translate text="Confirm layout & continue" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            </div>
          )}
          {/* 3rd page  */}
          {step == 3 && (
            <div>
              <>
                <Stepper
                  stepperClass="renovationStepBoxText"
                  progressSteps={steps}
                  step={step}
                />
              </>
              <p className="step3Para">
                <Translate text="Step 3" />{" "}
                <span className="step3ParaSpan">
                  - <Translate text="Select Furnishing Material" />
                </span>
              </p>
              <p className="furnishstyledPara">
                <Translate text="Please Select Furnishing Material below" />
              </p>
              <StepFour
                roomRef={roomRef}
                free={free}
                architectureRef={materialTypeRef}
                customFunction={customFunction}
                user={user}
                activeIndexTypeModern={activeIndexTypeModern}
                setActiveIndexTypeModern={setActiveIndexTypeModern}
                room_objectRef={room_objectRef}
                data={
                  renovationData[roomRef.current]?.[room_objectRef.current]
                    ?.material_style
                }
              />
            </div>
          )}
          {/* step 4 */}
          {step == 4 && (
            <div>
              <>
                <Stepper
                  stepperClass="renovationStepBoxText"
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
                modelName="virtual Renovation"
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
                SetFinalImage={SetFinalImage}
                NameModel="renovationCredit"
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
                  stepperClass="renovationStepBoxText"
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
                modelName="renovation"
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                mainText="82% of buyers’ agents said renovation made it easier for a buyer to visualize the property as a future home"
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
                imageUrlsBefore2={renoImageUrlsBefore2}
                imageUrlsBefore={imageUrlsBefore}
                imageUrlsAfter={imageUrlsAfter}
                free={free}
                step={step}
                NameModel="renovationCredit"
                loading={loading}
                downSlide={{
                  mainHeading: "How to Use the Virtual Renovation Tool",
                  toolSteps: [
                    {
                      image: "/renovation_images/firstcardimage.png",
                      title: "Click to upload image",
                      des: "Add one image",
                    },
                    {
                      image: "/renovation_images/2ndcardpic.png",
                      title:
                        "Select room object, room type and furnishing material",
                      des: "",
                    },
                    {
                      image: "/renovation_images/thirdcardpic.png",
                      title: "Download the renovated image from your library",
                      des: "If the image needs adjusting, you can click the revise button and input a revision details",
                    },
                  ],
                }}
              />
            </>
          )}
        </div>
      </div>
    </AuhtProvider>
  );
};

export default VirtualRenovation;
