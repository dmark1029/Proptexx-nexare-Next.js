"use client";
import React, { useEffect, useCallback, useRef, useState } from "react";
import "../../styles/ObjectRemoval.css";
import Box from "@mui/material/Box";
import { useDropzone } from "react-dropzone";
import { fabric } from "fabric";
import Stepper from "@/components/Stepper";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import StepOne from "@/components/StepOne";
import { objectDummymask, objectImageUrlsBefore2 } from "@/utils/imagesPath";
import StepSix from "@/components/StepSix";
import StepFive from "@/components/StepFive";
import { toast } from "react-toastify";
import { whiteLabeled } from "@/utils/sampleData";
import CTAModal from "@/components/CTAModal";
import TooltipThemeProvider from "@/components/TooltipThemeProvider";
import { Tooltip } from "@mui/material";
import Translate from "@/components/Translate";
import { setUser } from "@/Redux/slices/authSlice";

const ObjectRemoval = () => {
  const dispatch = useDispatch();
  const [lastClicked, setLastClicked] = useState("forward");
  const [step, setStep] = useState(1);
  const room_objectRef = useRef("walls");
  const [loading, setLoading] = useState(false);
  const [mask, setMask] = useState("");
  const [imageDownload, setImageDownload] = useState("");
  const [realImage, setRealImage] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mask2, setMask2] = useState("");
  const [finalImage, SetFinalImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0); // Set default index
  const [progress, setProgress] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [btn, setBtn] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [buttonText, setButtonText] = useState("Confirm mask & continue");
  const [selectedImage, setSelectedImage] = useState(objectImageUrlsBefore2[0]);
  const [open, setOpen] = useState(false);
  const [overridePrompt, setOverridePrompt] = useState(null);

  const maskUrlRef = useRef("https://i.ibb.co/QdndvZ3/1.png");
  const canvasRef = useRef(null);
  const eraseActive = useRef();
  const drawActive = useRef();
  const eraseRange = useRef(null);
  const drawRange = useRef(null);
  const scale = useRef(null);
  const maskDiv = useRef(null);
  const brushColor = useRef("White");
  const brushSize = useRef(50);
  const original = useRef(objectImageUrlsBefore2[0]);
  const brushCircle = useRef(null);
  const timerRef = useRef(null);
  const regenerateRef = useRef(false);
  const progressTimeRef = useRef(200);
  const roomRef = useRef("bedroom");
  const architectureRef = useRef("coastal");
  const regenRef = useRef(0);
  const linkRef = useRef("");
  const orgWidthRef = useRef(0);
  const orgHeightRef = useRef(0);
  const { token, user } = useSelector((state) => state.auth.user);
  const router = useRouter();
  let free = user?.planName == "free" || !token ? true : false;

  const [selectedObjects, setSelectedObjects] = useState([]);
  const baseImageRef = useRef(null);
  const layersRef = useRef({});
  const mergedCanvasRef = useRef(null);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [restore, setRestore] = useState(false);
  const onecredit = user?.usercredit?.objectRemovalCredit;
  const [upload, setUpload] = useState(false);

  const imageUrlsBefore = [
    "objhome_img/before1.jpg",
    "objhome_img/before2.jpg",
    "objhome_img/before3.jpg",
    "objhome_img/before4.jpg",
    "objhome_img/before5.jpeg",
    "objhome_img/before6.jpg",
  ];
  const imageUrlsAfter = [
    "objhome_img/after1.jpg",
    "objhome_img/after2.jpg",
    "objhome_img/after3.jpg",
    "objhome_img/after4.jpg",
    "objhome_img/after5.jpg",
    "objhome_img/after6.jpg",
  ];

  const steps = [
    {
      name: "Upload Image",
    },
    {
      name: "Select Layout",
    },
    {
      name: "Review Result",
    },
  ];

  const colorobject = {
    bed: "#CC05FF",
    cabinet: "#E005FF",
    ceiling: "#787850",
    chair: "#CC4603",
    cushion: "#FFC207",
    door: "#08FF33",
    floor: "#503232",
    pillow: "#00ADFF",
    walls: "#787878",
    windowpane: "#E6E6E6",
  };
  const imageSrc = "https://i.ibb.co/QdndvZ3/1.png";

  /////////////////////////////////////////
  useEffect(() => {
    if (step == 2) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = maskUrlRef.current; // TODO: Replace with your image path
      img.onload = () => {
        const containerWidth = 500;
        scale.current = containerWidth / img.width;
        const containerHeight = img.height * scale.current;
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
  }, [step, forceUpdate, token]);

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

  const toggleObject = (objectName) => {
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
  useEffect(() => {
    const canvas = baseImageRef.current;
    if (!canvas) return; // Ensure canvas is available

    const ctx = canvas.getContext("2d");

    const detectColorAndToggleLayer = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const imageData = ctx.getImageData(x, y, 1, 1).data;
      const clickedColor = rgbToHex(imageData[0], imageData[1], imageData[2]);

      // Find object by color
      const objectName = Object.keys(colorobject).find(
        (key) => colorobject[key] === clickedColor
      );

      if (objectName) {
        if (!selectedObjects.includes(objectName)) {
          toggleObject(objectName);
        }
      }
    };

    // Add event listeners
    canvas.addEventListener("mousemove", detectColorAndToggleLayer);
    canvas.addEventListener("click", detectColorAndToggleLayer);

    return () => {
      // Clean up event listeners
      canvas.removeEventListener("mousemove", detectColorAndToggleLayer);
      canvas.removeEventListener("click", detectColorAndToggleLayer);
    };
  }, [imageSrc, colorobject, selectedObjects, toggleObject]);

  // Convert RGB values to Hex
  const rgbToHex = (r, g, b) => {
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  };

  ////////////////////Cutome Function///////////////////////////////////////////////////////////////////////
  const customFunction = (storage, path) => {
    if (
      (user === true && storage !== "virtualstage4" && path) ||
      (free && regenRef.current <= 1 && !path) ||
      (!free && !path)
    ) {
      setStep((prevStep) => prevStep + 1);
      if (free && !onecredit && !upload ? handelSubmit4() : handelSubmit2());
    } else if (free && !onecredit && !upload) {
      setStep((prevStep) => prevStep + 1);
      handelSubmit4();
    } else if (!free || onecredit || upload) {
      setStep((prevStep) => prevStep + 1);
      handelSubmit2();
    }
  };

  const handelSubmit3 = async () => {
    setTimeout(() => {
      setBtn(false);
    }, 5000);
  };

  const handelSubmit4 = async () => {
    ("submit 4");
    const filterImage = objectDummymask.find(
      (item, index) => item.image == selectedImage
    );

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

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/api/models/dummypmagepreview`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image_url: filterImage.result }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (free == true) {
          // regenRef.current = regenRef.current + 1;
        }
        createFinalImage(data.image);
        regenerateRef.current = true;
        original.current = data.image;
      });
    setLoading(false);
  };
  //////////////////////////////////states ended///////////////////////////////////////////////////////////////

  const localState = () => {
    let login = user;
    if (!login) {
      nextPage();
      handelSubmit2();
    } else {
      const virtualstage = {
        image: original.current,
        room_type: roomRef.current,
        architecture_style: architectureRef.current,
        mask: mask,
        mask2: mask2,
        mask_url: maskUrlRef.current,
        step: step,
      };
      var jsonData = JSON.stringify(virtualstage);
      localStorage.setItem("virtualstage", jsonData);
      router.push(`/register`);
    }
  };

  const regenerate = () => {
    setMask("");
    if (free && regenRef.current <= 1) {
      nextPage();
    }
    !free && nextPage();

    if (free && regenRef.current > 1) {
      const objectremoval2 = {
        image: realImage,
        room_type: roomRef.current,
        architecture_style: architectureRef.current,
        mask: mask,
        mask2: mask2,
        mask_url: maskUrlRef.current,
        step: 2,
        preview: finalImage,
        regen: regenRef.current,
        download: imageDownload,
        canvas: canvasRef.current,
        regenerate: regenerateRef.current,
        link: linkRef.current,
      };
      var jsonData = JSON.stringify(objectremoval2);
      localStorage.setItem("objectremoval2", jsonData);

      const button = document.getElementById("open_limit_re");
      if (button) {
        button.click();
      } else {
        console.log("button not found");
      }
    }
  };

  useEffect(() => {
    var storedData = localStorage.getItem("virtualstage");
    var parsedData = JSON.parse(storedData);
    if (parsedData) {
      setRealImage(parsedData.image);
      setMask2(parsedData.mask2);
      roomRef.current = parsedData.room_type;
      architectureRef.current = parsedData.architecture_style;
      setMask(parsedData.mask);
      original.current = parsedData.image;
      maskUrlRef.current = parsedData.mask_url;
      canvasRef.current = parsedData.canvas;
      localStorage.removeItem("virtualstage");
      setStep(parsedData.step);
      let login = user;
      if (login === true) {
        setStep(parsedData.step + 1);
        handelSubmit2();
      } else {
        setStep(parsedData.step);
      }
    }

    var storedData2 = localStorage.getItem("objectremoval2");
    var parsedData2 = JSON.parse(storedData2);
    if (parsedData2) {
      setRealImage(parsedData2.image);
      setMask2(parsedData2.mask2);
      roomRef.current = parsedData2.room_type;
      architectureRef.current = parsedData2.architecture_style;
      regenRef.current = parsedData2.regen;
      setMask(parsedData2.mask);
      setImageDownload(parsedData2.download);
      original.current = parsedData2.image;
      SetFinalImage(parsedData2.preview);
      maskUrlRef.current = parsedData2.mask_url;
      setBtn(false);
      linkRef.current = parsedData2.link;
      canvasRef.current = parsedData2.canvas;
      regenerateRef.current = parsedData2.regenerate;
      localStorage.removeItem("objectremoval2");
      setStep(parsedData2.step);
      let login = user;
      if (login === true) {
        setStep(parsedData2.step + 1);
      } else {
        setStep(parsedData2.step);
      }
    }
  }, []);
  /////////////////////////////////////set required data in local ended////////////////////////////////////////////

  const handleForwardClick = () => {
    setCurrentIndex((currentIndex + 1) % imageUrlsBefore.length);
    setLastClicked("forward"); // Go to next image
  };
  const handleBackClick = () => {
    setCurrentIndex(
      (currentIndex - 1 + imageUrlsBefore.length) % imageUrlsBefore.length
    ); // Go to previous image
    setLastClicked("back");
  };
  ///////////////////back and forward image click ended///////////////////////////////////
  const nextPage = () => {
    setStep((prevStep) => prevStep + 1);
  };
  const prevPage = () => {
    if (step == 2) {
      regenerateRef.current = false;
    }
    if (step == 1) {
      regenerateRef.current = false;
      localStorage.removeItem("objectremoval2");
    } else {
      if (!loading) {
        setStep((prevStep) => prevStep + -1);
      }
    }
    if (step == 3 || step == 4) {
      setMask("");
    }
  };

  ////////////////////back and forward button ended////////////////////////////////////

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
    setLoading(true);
    setMask("");
    setMask2("");
    setBtn(true);
    setRealImage("");
    maskUrlRef.current = "";
    original.current = " ";
    if (file) {
      setLoading(true);
      newFileUpload(file);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const handleImageClickme = () => {
    setIsVisible(!isVisible); // Toggle visibility state when image is clicked
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
    }, progressTimeRef.current);
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.type)) {
      handelNewFileUpload(fileimg);
    } else {
      alert("Unsupport Format");
      setLoading(false);
    }
  };
  const handelNewFileUpload = async (fileimg) => {
    const ApiKey = process.env.REACT_APP_API_KEY;
    if (!fileimg) return;
    const formData = new FormData();
    formData.append("image", fileimg);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/api/models/uploadimage?modelName=objectRemovalCredit`,
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
        setSelectedImage(data.fileurl);
        regenRef.current = 0;
        if (original.current) {
          setRealImage(data.fileurl);
          original.current = data.fileurl;
          regenerateRef.current = false;
          setImageDownload("");
          if (onecredit) {
            setUpload(true);
          }
          dispatch(
            setUser({
              token,
              user: data?.user,
            })
          );
          nextPage();
          setLoading(false);
        } else {
          toast.error("Failed to upload");
          setLoading(false);
        }
      })
      .catch((err) => toast.error("Failed to upload"));
  };

  //////////////first step mask generate and upload image ended/////////////////////////////

  /*Create Canvas*/
  let isDrawing = false;
  let currentPath = null;
  const paths = useRef([]);

  useEffect(() => {
    if (step == 1) {
      SetFinalImage(null);
      setUpload(false);
    }
    if (step == 1 && regenerateRef.current) {
      original.current = "";
      setSelectedImage(null);
      regenerateRef.current = false;
    }
    if (step == 2) {
      const canvasNew = new fabric.Canvas("c");
      canvasRef.current = canvasNew;
      const url = mask;
      const isEmptyMask = url === ""; // Check if the mask URL is empty

      if (isEmptyMask) {
        const containerWidth = maskDiv.current?.clientWidth;
        const imgor = new Image();
        imgor.src = original.current;
        imgor.onload = () => {
          const heightRatio = imgor.naturalHeight / imgor.naturalWidth;
          scale.current = containerWidth / imgor.naturalWidth;
          const containerHeight = imgor.naturalHeight * scale.current;
          canvasRef.current.setWidth(containerWidth);
          canvasRef.current.setHeight(containerHeight);
          orgWidthRef.current = imgor.naturalWidth;
          orgHeightRef.current = imgor.naturalHeight;
          const emptyImage = new fabric.Image(null, {
            left: 0,
            top: 0,
            width: imgor.naturalWidth,
            height: imgor.naturalHeight,
            backgroundColor: "black",
          });
          canvasRef.current.setZoom(scale.current);
          canvasRef.current.add(emptyImage).renderAll();
          canvasRef.current.skipTargetFind = true;
        };
      } else {
        fabric.Image.fromURL(url, (img) => {
          var containerWidth = maskDiv.current?.clientWidth;
          scale.current = containerWidth / img.width;
          var containerHeight = img.height * scale.current;
          canvasRef.current.setZoom(scale.current);
          canvasRef.current.setWidth(containerWidth);
          canvasRef.current.setHeight(containerHeight);
          const oImg = img.set({ left: 0, top: 0, selectable: false });
          canvasRef.current.add(oImg).renderAll();
        });
      }

      canvasRef.current.on("mouse:down", (o) => {
        if (free && !onecredit && !upload) return;
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
        if ((free && !onecredit && !upload) || !isDrawing) return;
        const pointer = canvasRef.current.getPointer(o.e);
        let points = [pointer.x, pointer.y];
        currentPath.path.push(["L", ...points]);
        currentPath.dirty = true;
        canvasRef.current.renderAll();
      });

      canvasRef.current.on("mouse:up", (o) => {
        if (free && !onecredit && !upload) return;
        isDrawing = false;
        paths.current.push(currentPath);
        currentPath = null;
        canvasRef.current.selection = true;
      });

      // Clean up function
      return () => {
        canvasRef.current.dispose();
      };
    }
  }, [step, free]);
  const handleEraseLine = (e) => {
    brushSize.current = e.target.value;
    eraseRange.current.style.background = `linear-gradient(to right, #ffffff ${brushSize.current}%, #a1a1a1 ${brushSize.current}%)`;
    drawRange.current.style.background = `linear-gradient(to right, #333333 ${drawRange.current.value}%, #d6d6d6 ${drawRange.current.value}%)`;
    if (brushCircle.current) {
      brushCircle.current.style.width = `${
        brushSize.current * scale.current
      }px`;
      brushCircle.current.style.height = `${
        brushSize.current * scale.current
      }px`;
    }
    eraserMask();
  };

  /*Draw Button Active*/
  const handleDrawLine = (e) => {
    brushSize.current = e.target.value;
    drawRange.current.style.background = `linear-gradient(to right, #ffffff ${brushSize.current}%, #a1a1a1 ${brushSize.current}%)`;
    eraseRange.current.style.background = `linear-gradient(to right, #333333 ${eraseRange.current.value}%, #d6d6d6 ${eraseRange.current.value}%)`;
    if (brushCircle.current) {
      brushCircle.current.style.width = `${
        brushSize.current * scale.current
      }px`;
      brushCircle.current.style.height = `${
        brushSize.current * scale.current
      }px`;
    }
    drawMask();
  };

  /*Change Brush Color For Erase*/
  const eraserMask = () => {
    brushColor.current = "Black";
    const spanElementErase = eraseActive.current.querySelector("span");
    const spanElementDraw = drawActive.current.querySelector("span");
    const svgElementDraw = drawActive.current.querySelector("svg path");
    const svgElementErase = eraseActive.current.querySelector("svg path");
    svgElementDraw.setAttribute("fill", "back");
    svgElementErase.setAttribute("fill", "white");
    spanElementErase.style.color = "#ffffff";
    spanElementDraw.style.color = "#333333";
    eraseActive.current.style.backgroundColor = "#000000";
    eraseActive.current.style.color = "#ffffff !important";
    drawActive.current.style.backgroundColor = "transparent";
    eraseRange.current.style.background = `linear-gradient(to right, #ffffff ${eraseRange.current.value}%, #d6d6d6 ${eraseRange.current.value}%)`;
    drawRange.current.style.background = `linear-gradient(to right, #333333 ${drawRange.current.value}%, #d6d6d6 ${drawRange.current.value}%)`;
    brushSize.current = eraseRange.current.value;
    if (brushCircle.current) {
      brushCircle.current.style.width = `${
        brushSize.current * scale.current
      }px`;
      brushCircle.current.style.height = `${
        brushSize.current * scale.current
      }px`;
    }
  };

  /*Change Brush Color To Draw*/
  const drawMask = () => {
    const spanElementErase = eraseActive.current.querySelector("span");
    const spanElementDraw = drawActive.current.querySelector("span");
    const svgElementDraw = drawActive.current.querySelector("svg path");
    const svgElementErase = eraseActive.current.querySelector("svg path");
    svgElementDraw.setAttribute("fill", "white");
    svgElementErase.setAttribute("fill", "black");
    spanElementErase.style.color = "#333333";
    spanElementDraw.style.color = "#ffffff";
    brushColor.current = "White";
    drawActive.current.style.backgroundColor = "#000000";
    drawActive.current.style.color = "#ffffff";
    eraseActive.current.style.backgroundColor = "transparent";
    eraseRange.current.style.background = `linear-gradient(to right, #333333  ${eraseRange.current.value}%, #d6d6d6 ${eraseRange.current.value}%)`;
    drawRange.current.style.background = `linear-gradient(to right, #ffffff ${drawRange.current.value}%, #d6d6d6 ${drawRange.current.value}%)`;
    brushSize.current = drawRange.current.value;
    if (brushCircle.current) {
      brushCircle.current.style.width = `${
        brushSize.current * scale.current
      }px`;
      brushCircle.current.style.height = `${
        brushSize.current * scale.current
      }px`;
    }
  };

  /* Undo Button */
  const undoLast = () => {
    if (paths.current.length > 0) {
      const lastPath = paths.current.pop();
      canvasRef.current.remove(lastPath);
      canvasRef.current.renderAll();
    }
  };

  /* Draw Button*/
  const reset = () => {
    if (paths.current.length > 0) {
      paths.current.forEach((path) => canvasRef.current.remove(path));
      paths.current = []; // reset the paths array
      canvasRef.current.renderAll();
    }
  };

  const handleMouseMove = (event) => {
    setPosition({
      x:
        event.clientX -
        (brushSize.current / 2) * scale.current -
        event.currentTarget.getBoundingClientRect().left,
      y:
        event.clientY -
        (brushSize.current / 2) * scale.current -
        event.currentTarget.getBoundingClientRect().top,
    });
  };
  const handleTouchMove = (event) => {
    setPosition({
      x:
        event.touches[0].clientX -
        (brushSize.current / 2) * scale.current -
        event.currentTarget.getBoundingClientRect().left,
      y:
        event.touches[0].clientY -
        (brushSize.current / 2) * scale.current -
        event.currentTarget.getBoundingClientRect().top,
    });
  };

  ///////////////////////Mask modification ended//////////////////////////////////////////////////////

  const onStep3Click = async () => {
    if (free && !onecredit && !upload) {
      customFunction();
      return;
    }
    let check = false;
    if (!canvasRef.current) {
      check = true;
    }
    setStep(step + 1);
    SetFinalImage(null);
    setBtn(true);
    setProgress(0); // reset progress
    setLoading(true);
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
    canvasRef.current.setZoom(1);
    canvasRef.current.setWidth(orgWidthRef.current);
    canvasRef.current.setHeight(orgHeightRef.current);

    if (check) {
      maskUrlRef.current = mask;
    } else {
      const dataUrl = canvasRef.current.toDataURL();
      const responsefile = await fetch(dataUrl);
      const blob = await responsefile.blob();
      const formData = new FormData();
      formData.append("image", blob, `${Date.now()}mask.png`);
      setButtonText("<div class='spinner spinnerobj' id='spinner'></div>");
      const ApiKey = "HLOH64Q4-20230313-OOQV9VVR";
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URI}/api/models/uploadimage?modelName=objectRemovalCredit`,
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
          if (data.fileurl) {
            maskUrlRef.current = data.fileurl;
            setStep(2);
            customFunction();
            setButtonText("Confirm mask & continue");
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
            toast.error("Failed To Upload Generate Mask.");
            setButtonText("Confirm mask & continue");
          }
        })
        .catch((err) => {
          SetFinalImage(null);
          setBtn(false);
          setLoading(false);
          toast.error("Failed to upload mask");
        });
    }
  };

  ///////////////////////////upload mask on s3 ennded/////////////////////////////

  const handlePositionChange = useCallback((position) => {
    setSliderPosition(position);
  }, []);

  const handelImageSelect = (image) => {
    original.current = "";
    setRealImage("");
    original.current = image;
    setSelectedImage(image);
  };

  const handleImageClick = () => {
    regenRef.current = 0;
    setMask("");
    setMask2("");
    maskUrlRef.current = "";
    setRealImage(selectedImage);
    regenerateRef.current = false;
    setImageDownload("");
    nextPage();
    if (free && !onecredit && !upload) {
      const filterImage = objectDummymask.find(
        (item, index) => item.image == selectedImage
      );
      setMask(filterImage.mask);
      maskUrlRef.current = filterImage.mask;
      handelSubmit3();
    }
  };

  /////////////////list room and architecture_style list ended//////////////////////////////

  const handelSubmit2 = async () => {
    setBtn(true);
    SetFinalImage("");
    if (timerRef.current) {
      clearInterval(timerRef.current); // clear existing timer
    }
    setProgress(0); // reset progress
    setLoading(true);
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

    let formData = {};

    if (regenerateRef.current) {
      formData = {
        mask_url: maskUrlRef.current,
        ref: linkRef.current,
      };
    } else {
      formData = {
        image_url: original.current,
        mask_url: maskUrlRef.current,
      };
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/models/objectremoval`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        createFinalImage(data.watermarkImage);
        regenerateRef.current = true;
        original.current = data.watermarkImage;
        setImageDownload(data.link);
        linkRef.current = data.link;
        setLoading(false);
        const errorMessage = data?.message;
        if (errorMessage) {
          if (errorMessage === "Token verification failed") {
            toast.error(`Login Expire, Please login again`);
            dispatch(setUser({}));
            setStep(1);
            setLoading(false);
            setBtn(false);
            SetFinalImage("");
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error?.response?.data?.message;
        if (errorMessage) {
          if (errorMessage === "Token verification failed") {
            toast.error(`Login Expire, Please login again`);
            dispatch(setUser({}));
            setStep(1);
            setLoading(false);
            setBtn(false);
            SetFinalImage("");
          }
        } else {
          setTimeout(() => {
            setStep(2);
            toast.error("Failed, Please try again");
          }, 1000);
        }
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
    <div className="flex flex-col max-w-[1100px] m-[50px_auto] w-[90%]">
      <p
        className={`backtoStep`}
        onClick={() => {
          if (step === 1) {
            router.push("/");
            localStorage.removeItem("objectremoval2");
          } else if (step == 2) {
            original.current = "";
            setSelectedImage(null);
            regenerateRef.current = false;
            SetFinalImage(null);
            setUpload(false);
            prevPage();
          } else if (step == 3 && free && !onecredit && !upload) {
            setStep(1);
            localStorage.removeItem("objectremoval2");
            regenRef.current = 0;
          } else {
            prevPage();
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
        {free && !onecredit && !upload && step == 3 ? (
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
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_429_17976)">
              <path
                d="M0 25C0 11.1914 11.1914 0 25 0C38.8086 0 50 11.1914 50 25C50 38.8086 38.8086 50 25 50C11.1914 50 0 38.8086 0 25ZM17.0898 20.3223L21.6895 24.9121L17.0898 29.5898C16.1816 30.5078 16.1816 31.9922 17.0898 32.8223C18.0078 33.8184 19.4922 33.8184 20.3223 32.8223L24.9121 28.3105L29.5898 32.8223C30.5078 33.8184 31.9922 33.8184 32.8223 32.8223C33.8184 31.9922 33.8184 30.5078 32.8223 29.5898L28.3105 24.9121L32.8223 20.3223C33.8184 19.4922 33.8184 18.0078 32.8223 17.0898C31.9922 16.1816 30.5078 16.1816 29.5898 17.0898L24.9121 21.6895L20.3223 17.0898C19.4922 16.1816 18.0078 16.1816 17.0898 17.0898C16.1816 18.0078 16.1816 19.4922 17.0898 20.3223Z"
                fill="#000000"
              />
            </g>
            <defs>
              <clipPath id="clip0_429_17976">
                <rect width="50" height="50" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <Translate text="Object Removal" />
        </p>

        {/*///////////////////////////////////////////////// end     /////////////////////////////*/}

        {/* 2nd page */}

        {step == 2 && (
          <div>
            <>
              <>
                <Stepper
                  stepperClass="refurnishinStepBoxText"
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
                <Translate text="Optionally adjust the generated mask with brush and eraser" />
              </p>
              <div className="boxouter">
                {free && !onecredit && !upload ? (
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
                            <Translate text="Upgrade to draw and customize mask" />
                          </p>
                        </div>
                      }
                    >
                      <div
                        className={`brushBoxCard ${
                          free && !onecredit && !upload
                            ? "brushBoxCardDisable"
                            : ""
                        }`}
                        onClick={() => setOpen(true)}
                      >
                        <div className="brushSizeBox">
                          <span className="brushSizeSpan">
                            <svg
                              className="brushSizeSpansvg"
                              viewBox="0 0 30 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11 12.3422C11.0094 10.9359 11.675 9.61875 12.8 8.775L23.8953 0.450235C24.7672 -0.204046 25.9813 -0.138984 26.7828 0.604688C27.5797 1.34813 27.725 2.55656 27.1344 3.47203L19.5547 15.1922C18.8422 16.2984 17.6844 17.025 16.4047 17.2078L11 12.3422ZM15.5 18.75C15.5 21.6516 13.1516 24 10.25 24H3.5C2.67172 24 2 23.3297 2 22.5C2 21.6703 2.67172 21 3.5 21H3.72547C4.55187 21 5.1125 20.1141 5.02766 19.2938C5.00937 19.1156 5 18.9328 5 18.75C5 15.9187 7.24531 13.6078 10.0484 13.5047L15.4906 18.3984C15.4953 18.4734 15.5 18.6328 15.5 18.75Z"
                                fill="white"
                              />
                            </svg>{" "}
                            <Translate text="Brush Size" />
                          </span>
                          <Box className="sliderClass">
                            <input
                              type="range"
                              ref={drawRange}
                              min={1}
                              max={100}
                              defaultValue={50}
                              className="staging_slider"
                              id="eraseRange"
                              style={{
                                background:
                                  "linear-gradient(to right,#ffffff 50%, #d6d6d6 50%)",
                              }}
                            />
                          </Box>
                        </div>
                        <div className="EraserSizeBox">
                          <span className="eraseSizeSpan">
                            <svg
                              className="eraseSizeSpansvg"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_1_697)">
                                <path
                                  d="M12.3752 22.4578C12.3471 22.4578 12.3143 22.4999 12.2861 22.4999H7.21427C6.31896 22.4999 5.46115 22.1437 4.82833 21.5109L1.45474 18.1359C0.136709 16.8187 0.136709 14.6812 1.45474 13.364L11.8643 2.95448C13.1815 1.63635 15.319 1.63635 16.6361 2.95448L22.5049 8.86401C23.8643 10.1812 23.8643 12.3187 22.5049 13.6359L15.933 20.2499H22.8752C23.4986 20.2499 24.0002 20.7515 24.0002 21.3749C24.0002 21.9984 23.4986 22.4999 22.8752 22.4999L12.3752 22.4578ZM3.04568 16.5046L6.3799 19.8796C6.63302 20.1328 6.91896 20.2499 7.21427 20.2499H12.2861C12.5815 20.2499 12.8674 20.1328 13.0783 19.8796L16.1252 16.8749L8.62521 9.37494L3.04568 14.9531C2.60646 15.3937 2.60646 16.1062 3.04568 16.5046ZM1.45474 13.364L3.04568 14.9531L1.45474 13.364Z"
                                  fill="#404256"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_1_697">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                            <Translate text="Eraser Size" />
                          </span>
                          <div className="sliderClass">
                            <input
                              type="range"
                              ref={eraseRange}
                              min={1}
                              max={100}
                              defaultValue={50}
                              className="staging_slider"
                              id="eraseRange"
                              style={{
                                background:
                                  "linear-gradient(to right, #333333 50%, #d6d6d6 50%)",
                              }}
                            />
                          </div>
                        </div>
                        <div className="undoBox">
                          <svg
                            className="undoBoxsvg"
                            viewBox="0 0 26 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_1_702)">
                              <path
                                d="M16.5294 6.53254H9.47059V2.29724L1 7.9443L9.47059 13.5914V9.35606H16.5294C19.6353 9.35606 22.1765 11.8972 22.1765 15.0031C22.1765 18.109 19.6353 20.6502 16.5294 20.6502H9.47059V23.4737H16.5294C21.1882 23.4737 25 19.6619 25 15.0031C25 10.3443 21.1882 6.53254 16.5294 6.53254Z"
                                fill="#404256"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_1_702">
                                <rect
                                  width="24"
                                  height="24"
                                  fill="white"
                                  transform="translate(1 1)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                          <Translate text="Undo Last Change" />
                        </div>
                      </div>
                    </Tooltip>
                  </TooltipThemeProvider>
                ) : (
                  <div
                    className={`brushBoxCard ${
                      free && !onecredit && !upload ? "brushBoxCardDisable" : ""
                    }`}
                  >
                    <div
                      className="brushSizeBox"
                      ref={drawActive}
                      onClick={drawMask}
                    >
                      <span className="brushSizeSpan">
                        <svg
                          className="brushSizeSpansvg"
                          viewBox="0 0 30 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11 12.3422C11.0094 10.9359 11.675 9.61875 12.8 8.775L23.8953 0.450235C24.7672 -0.204046 25.9813 -0.138984 26.7828 0.604688C27.5797 1.34813 27.725 2.55656 27.1344 3.47203L19.5547 15.1922C18.8422 16.2984 17.6844 17.025 16.4047 17.2078L11 12.3422ZM15.5 18.75C15.5 21.6516 13.1516 24 10.25 24H3.5C2.67172 24 2 23.3297 2 22.5C2 21.6703 2.67172 21 3.5 21H3.72547C4.55187 21 5.1125 20.1141 5.02766 19.2938C5.00937 19.1156 5 18.9328 5 18.75C5 15.9187 7.24531 13.6078 10.0484 13.5047L15.4906 18.3984C15.4953 18.4734 15.5 18.6328 15.5 18.75Z"
                            fill="white"
                          />
                        </svg>{" "}
                        <Translate text="Brush Size" />
                      </span>
                      <Box className="sliderClass">
                        <input
                          type="range"
                          ref={drawRange}
                          min={1}
                          max={100}
                          onChange={handleDrawLine}
                          defaultValue={50}
                          className="staging_slider"
                          id="eraseRange"
                          style={{
                            background:
                              "linear-gradient(to right,#ffffff 50%, #d6d6d6 50%)",
                          }}
                        />
                      </Box>
                    </div>
                    <div
                      className="EraserSizeBox"
                      ref={eraseActive}
                      onClick={() => {
                        eraserMask();
                      }}
                    >
                      <span className="eraseSizeSpan">
                        <svg
                          className="eraseSizeSpansvg"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_1_697)">
                            <path
                              d="M12.3752 22.4578C12.3471 22.4578 12.3143 22.4999 12.2861 22.4999H7.21427C6.31896 22.4999 5.46115 22.1437 4.82833 21.5109L1.45474 18.1359C0.136709 16.8187 0.136709 14.6812 1.45474 13.364L11.8643 2.95448C13.1815 1.63635 15.319 1.63635 16.6361 2.95448L22.5049 8.86401C23.8643 10.1812 23.8643 12.3187 22.5049 13.6359L15.933 20.2499H22.8752C23.4986 20.2499 24.0002 20.7515 24.0002 21.3749C24.0002 21.9984 23.4986 22.4999 22.8752 22.4999L12.3752 22.4578ZM3.04568 16.5046L6.3799 19.8796C6.63302 20.1328 6.91896 20.2499 7.21427 20.2499H12.2861C12.5815 20.2499 12.8674 20.1328 13.0783 19.8796L16.1252 16.8749L8.62521 9.37494L3.04568 14.9531C2.60646 15.3937 2.60646 16.1062 3.04568 16.5046ZM1.45474 13.364L3.04568 14.9531L1.45474 13.364Z"
                              fill="#404256"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1_697">
                              <rect width="24" height="24" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        <Translate text="Eraser Size" />
                      </span>
                      <div className="sliderClass">
                        <input
                          type="range"
                          ref={eraseRange}
                          min={1}
                          max={100}
                          onChange={handleEraseLine}
                          defaultValue={50}
                          className="staging_slider"
                          id="eraseRange"
                          style={{
                            background:
                              "linear-gradient(to right, #333333 50%, #d6d6d6 50%)",
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className="undoBox"
                      onClick={(e) => {
                        e.preventDefault();
                        undoLast();
                      }}
                    >
                      <svg
                        className="undoBoxsvg"
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_1_702)">
                          <path
                            d="M16.5294 6.53254H9.47059V2.29724L1 7.9443L9.47059 13.5914V9.35606H16.5294C19.6353 9.35606 22.1765 11.8972 22.1765 15.0031C22.1765 18.109 19.6353 20.6502 16.5294 20.6502H9.47059V23.4737H16.5294C21.1882 23.4737 25 19.6619 25 15.0031C25 10.3443 21.1882 6.53254 16.5294 6.53254Z"
                            fill="#404256"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1_702">
                            <rect
                              width="24"
                              height="24"
                              fill="white"
                              transform="translate(1 1)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      <Translate text="Undo Last Change" />
                    </div>
                  </div>
                )}

                <div className="rightBoxInnter">
                  <div className="manualLayoutPara !text-mainColor">
                    <Translate text="Manual Layout" />
                  </div>

                  <div className="manualLayoutImg" style={{ height: "auto" }}>
                    <div
                      id="myElement"
                      ref={maskDiv}
                      onMouseMove={handleMouseMove}
                      onTouchMove={handleTouchMove}
                      style={{
                        backgroundImage: `url("${original.current}")`,
                        position: "relative",
                        overflow: "hidden",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div
                        ref={brushCircle}
                        className="circle"
                        style={{
                          width: `${brushSize.current * scale.current}px`,
                          height: `${brushSize.current * scale.current}px`,
                          left: `${position.x}px`,
                          top: `${position.y}px`,
                        }}
                      />
                      <div id="canvas_containerobj">
                        <canvas
                          id="c"
                          style={{ mixBlendMode: "multiply" }}
                        ></canvas>
                      </div>
                    </div>
                  </div>

                  <div className="resetConfirmBtnsBox">
                    {free && !onecredit && !upload ? (
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
                                <Translate text="Upgrade to use this feature" />
                              </p>
                            </div>
                          }
                        >
                          <button
                            className="resetmaskBtn"
                            onClick={(e) => setOpen(true)}
                          >
                            <svg
                              className="resetmaskBtnsvg"
                              viewBox="0 0 27 26"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M22.3391 2.87334L20.0656 5.14819C18.2422 3.4935 15.8469 2.50022 13.25 2.50022C8.82031 2.50022 4.93391 5.32866 3.57406 9.54084C3.31916 10.3288 3.75205 11.1758 4.54016 11.429C5.33563 11.6868 6.17422 11.2503 6.42922 10.4638C7.38594 7.49241 10.1281 5.50022 13.25 5.50022C15.0294 5.50022 16.6719 6.16491 17.9469 7.27209L15.8328 9.34397C15.0828 10.1315 15.6312 11.4721 16.7375 11.5002H23.6234C24.1109 11.4862 24.5 11.0924 24.5 10.6049V3.76772C24.5 2.64037 23.1359 2.076 22.3391 2.87334ZM21.9594 14.5752C21.1653 14.3203 20.3244 14.7539 20.0703 15.5404C19.1141 18.508 16.3719 20.5002 13.25 20.5002C11.4706 20.5002 9.82812 19.8355 8.55313 18.7283L10.625 16.6565C11.4172 15.869 10.8688 14.5283 9.7625 14.5002H2.87469C2.39 14.5143 2 14.908 2 15.3955V22.2346C2 23.3615 3.36266 23.9258 4.15953 23.1285L6.43297 20.8537C8.25781 22.5065 10.6531 23.5002 13.2078 23.5002C17.6352 23.5002 21.5234 20.6718 22.8828 16.4596C23.1828 15.6721 22.7469 14.7862 21.9594 14.5752Z"
                                fill={whiteLabeled ? "#c82021" : "#000000"}
                              />
                            </svg>
                            <Translate text="Reset Mask" />
                          </button>
                        </Tooltip>
                      </TooltipThemeProvider>
                    ) : (
                      <button
                        disabled={free && !onecredit && !upload}
                        className="resetmaskBtn"
                        onClick={(e) => {
                          e.preventDefault();
                          reset();
                        }}
                      >
                        <svg
                          className="resetmaskBtnsvg"
                          viewBox="0 0 27 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22.3391 2.87334L20.0656 5.14819C18.2422 3.4935 15.8469 2.50022 13.25 2.50022C8.82031 2.50022 4.93391 5.32866 3.57406 9.54084C3.31916 10.3288 3.75205 11.1758 4.54016 11.429C5.33563 11.6868 6.17422 11.2503 6.42922 10.4638C7.38594 7.49241 10.1281 5.50022 13.25 5.50022C15.0294 5.50022 16.6719 6.16491 17.9469 7.27209L15.8328 9.34397C15.0828 10.1315 15.6312 11.4721 16.7375 11.5002H23.6234C24.1109 11.4862 24.5 11.0924 24.5 10.6049V3.76772C24.5 2.64037 23.1359 2.076 22.3391 2.87334ZM21.9594 14.5752C21.1653 14.3203 20.3244 14.7539 20.0703 15.5404C19.1141 18.508 16.3719 20.5002 13.25 20.5002C11.4706 20.5002 9.82812 19.8355 8.55313 18.7283L10.625 16.6565C11.4172 15.869 10.8688 14.5283 9.7625 14.5002H2.87469C2.39 14.5143 2 14.908 2 15.3955V22.2346C2 23.3615 3.36266 23.9258 4.15953 23.1285L6.43297 20.8537C8.25781 22.5065 10.6531 23.5002 13.2078 23.5002C17.6352 23.5002 21.5234 20.6718 22.8828 16.4596C23.1828 15.6721 22.7469 14.7862 21.9594 14.5752Z"
                            fill={whiteLabeled ? "#c82021" : "#000000"}
                          />
                        </svg>
                        <Translate text="Reset Mask" />
                      </button>
                    )}

                    <button
                      className="confirmandcon !bg-mainColor"
                      onClick={() => {
                        onStep3Click();
                      }}
                    >
                      {buttonText && (
                        <span
                          dangerouslySetInnerHTML={{ __html: buttonText }}
                        />
                      )}
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
                stepperClass="refurnishinStepBoxText"
                progressSteps={steps}
                step={step}
              />
            </>
            <p className="step5Para !text-mainColor">
              <Translate text="Step 3" />{" "}
              <span className="step3ParaSpan">
                - <Translate text="Review Result" />
              </span>
            </p>
            <StepFive
              modelName="object removal"
              finalImage={finalImage}
              selectedImage={selectedImage}
              handlePositionChange={handlePositionChange}
              sliderPosition={sliderPosition}
              progress={progress}
              imageDownload={imageDownload}
              btn={btn}
              customFunction={customFunction}
              setStep={setStep}
              free={free}
              step={step}
              SetFinalImage={SetFinalImage}
              NameModel="objectRemovalCredit"
              upload={upload}
              setUpload={setUpload}
            />
          </div>
        )}
        {/* step 4 */}
        {step == 4 && (
          <div>
            <>
              <Stepper
                stepperClass="refurnishinStepBoxText"
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
            {/* <div>
              <div id="canvas_container2" style={{ position: "relative" }}>
                <canvas
                  ref={baseImageRef}
                  style={{
                    position: "absolute",
                    left: "0px",
                    top: "0px",
                    opacity: "0.1",
                    zIndex: "1000",
                  }}
                ></canvas>
                <canvas
                  ref={mergedCanvasRef}
                  width={canvasWithHiegth.width}
                  height={canvasWithHiegth.height}
                ></canvas>
              </div>
            </div> */}

            <StepOne
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              mainText="82% of buyers’ agents said staging made it easier for a buyer to visualize the property as a future home"
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
              imageUrlsBefore2={objectImageUrlsBefore2}
              imageUrlsBefore={imageUrlsBefore}
              imageUrlsAfter={imageUrlsAfter}
              free={free}
              step={step}
              loading={loading}
              NameModel="objectRemovalCredit"
              downSlide={{
                mainHeading: "How to Use the Object Removal Tool",
                toolSteps: [
                  {
                    image: "/objhome_img/firstcardimage.png",
                    title: "Click to upload image",
                    des: "Add one image",
                  },
                  {
                    image: "/objhome_img/2ndcardpic.png",
                    title: "",
                    des: "Use the masking tool to highlight items and objects you would like to remove from the photo",
                  },
                  {
                    image: "/objhome_img/thirdcardpic.png",
                    title: "",
                    des: "Make further adjustments or download your image",
                  },
                ],
              }}
              modelName="object removal"
            />
          </>
        )}
      </div>
      <CTAModal open={open} setOpen={setOpen} stepsData={{ step }} />
    </div>
  );
};

export default ObjectRemoval;
