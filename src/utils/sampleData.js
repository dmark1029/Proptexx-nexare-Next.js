import { BsFillLampFill, BsSunFill } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { GiHighGrass } from "react-icons/gi";
import { RiGalleryFill } from "react-icons/ri";
import { PiNotePencilFill } from "react-icons/pi";
import { TbFileDescription } from "react-icons/tb";

let services = [
  {
    name: "Virtual Refurnishing",
    icon: <BsFillLampFill />,
    image:
      "https://storage.googleapis.com/store-gallery-img-results/banner-images/banner-virtual-staging.jpg",
    link: "/decluttering-and-staging",
    isModelTraning: false,
  },
  {
    name: "Virtual Renovation",
    icon: <AiFillHome />,
    image:
      "https://storage.googleapis.com/store-gallery-img-results/banner-images/banner-virtual-renovation.jpg",
    link: "/virtual-renovation",
    isModelTraning: false,
  },
  {
    name: "Photo Enhancement",
    icon: <RiGalleryFill />,
    image:
      "https://storage.googleapis.com/store-gallery-img-results/banner-images/banner-photo-enhancement.jpg",
    link: "/enhance/photo",
    isModelTraning: false,
  },
  {
    name: "Sky Replacement",
    icon: <BsSunFill />,
    image:
      "https://storage.googleapis.com/store-gallery-img-results/banner-images/banner-sky-replacement.jpg",
    link: "/enhance/sky",
    isModelTraning: false,
  },
  {
    name: "Grass Repair",
    icon: <GiHighGrass />,
    image:
      "https://storage.googleapis.com/store-gallery-img-results/banner-images/banner-grass-repair.jpg",
    link: "/enhance/grass",
    isModelTraning: false,
  },
  {
    name: "Object Removal",
    icon: <ImCross />,
    image:
      "https://storage.googleapis.com/store-gallery-img-results/banner-images/object_removal.png",
    link: "/object-removal",
    isModelTraning: false,
  },
  {
    name: "Virtual Staging",
    icon: <BsFillLampFill />,
    image:
      "https://storage.googleapis.com/store-gallery-img-results/banner-images/banner-virtual-staging.jpg",
    link: "/virtual-staging",
    isModelTraning: false,
  },
  // {
  //   name: "Furniture Replacement",
  //   icon: <AiFillHome />,
  //   image:
  //     "https://storage.googleapis.com/store-gallery-img-results/banner-images/banner-virtual-refurnishing.jpg",
  //   link: "/virtual-refurnishing",
  //   isModelTraning: true,
  // },
  // {
  //   name: "Image Tagging & Smart Detection",
  //   icon: <RiGalleryFill />,
  //   image:
  //     "https://storage.googleapis.com/store-gallery-img-results/banner-images/image-tagging.png",
  //   link: "/smart-detection",
  //   isModelTraning: true,
  // },
  // {
  //   name: "Image Compliance Check",
  //   icon: <RiGalleryFill />,
  //   image:
  //     "https://storage.googleapis.com/store-gallery-img-results/banner-images/image-compliance.png",
  //   link: "/image-compliance",
  //   isModelTraning: true,
  // },
];

let textServices = [
  // {
  //   name: "Description Generation",
  //   icon: <TbFileDescription />,
  //   image:
  //     "https://storage.googleapis.com/store-gallery-img-results/banner-images/banner-description-generation.jpg",
  //   link: "description_generation",
  //   isModelTraning: true,
  // },
  // {
  //   name: "Alt Text Generation",
  //   icon: <PiNotePencilFill />,
  //   image:
  //     "https://storage.googleapis.com/store-gallery-img-results/banner-images/banner-alt-text-generation.jpg",
  //   link: "/image_caption",
  //   isModelTraning: true,
  // },
];

let comingSoon = [
  // {
  //   name: "MLS Compliance Check",
  //   icon: <AiFillHome />,
  //   image:
  //     "https://storage.googleapis.com/store-gallery-img-results/banner-images/mls_compliance.png",
  // },
  // {
  //   name: "Listing Marketability & Quality Score",
  //   icon: <AiFillHome />,
  //   image:
  //     "https://storage.googleapis.com/store-gallery-img-results/banner-images/listing_mid.png",
  // },
  // {
  //   name: "Room Decluttering (AI)",
  //   icon: <PiNotePencilFill />,
  //   image:
  //     "https://storage.googleapis.com/store-gallery-img-results/banner-images/room_declutter.png",
  // },
  // {
  //   name: "Text Compliance Check",
  //   icon: <PiNotePencilFill />,
  //   image:
  //     "https://storage.googleapis.com/store-gallery-img-results/banner-images/text-compliance.png",
  // },
  // {
  //   name: "Text Correction",
  //   icon: <PiNotePencilFill />,
  //   image:
  //     "https://storage.googleapis.com/store-gallery-img-results/banner-images/text-correct.png",
  // },
];
const whiteLabeled = false;

const plans = {
  FREE: "free",
  PRO: "pro",
  PREMIUM: "premium",
  POWER_USER: "power_user",
  BASIC: "basic",
};

const versionPoints = [
  {
    version: "",
    list: [
      "Refurnishing model with 4 generated outputs",
      "Enhanced dashboard with users analytics",
      "Theme customization for widget owner via dashboard",
      "Light and dark mode for an end user",
      "Feedback option",
    ],
  },
  {
    version:
      process.env.NEXT_PUBLIC_REACT_ENV === "development"
        ? "main1 v1"
        : "main v1",
    list: [
      "Refurnishing model with 4 generated outputs",
      "Enhanced dashboard with users analytics",
      "Theme customization for widget owner via dashboard",
      "Light and dark mode for an end user",
      "Feedback option",
    ],
  },
  {
    version:
      process.env.NEXT_PUBLIC_REACT_ENV === "development"
        ? "main1 v2"
        : "main v2",
    list: [
      "Flexibility to re-position widget for widget owner",
      "Flexibility to hide the floating icon if linked to any button",
      "Widget icon dragging for end user",
      "Capture listing URL in data endpoint and widget owner dashboard",
    ],
  },
  {
    version:
      process.env.NEXT_PUBLIC_REACT_ENV === "development"
        ? "main1 v2.1.0"
        : "main v2.1.0",
    list: [
      "Flexibility to re-position widget for widget owner",
      "Flexibility to hide the floating icon if linked to any button",
      "Widget icon dragging for end user",
      "Capture listing URL in data endpoint and widget owner dashboard",
      "Translate the widget language to other languages in real-time",
    ],
  },
  {
    version:
      process.env.NEXT_PUBLIC_REACT_ENV === "development"
        ? "main1 v2.1.1"
        : "main v2.1.1",
    list: [
      "Flexibility to re-position widget for widget owner",
      "Flexibility to hide the floating icon if linked to any button",
      "Widget icon dragging for end user",
      "Capture listing URL in data endpoint and widget owner dashboard",
      "Translate the widget language to other languages in real-time",
      "Virtual staging model with 1 generated output",
    ],
  },
  {
    version:
      process.env.NEXT_PUBLIC_REACT_ENV === "development"
        ? "guest1 v1"
        : "guest v1",
    list: [
      "Flexibility to re-position widget for widget owner",
      "Flexibility to hide the floating icon if linked to any button",
      "Widget icon dragging for end user",
      "Capture listing URL in data endpoint and widget owner dashboard",
      "Translate the widget language to other languages in real-time",
      "Virtual staging model with 1 generated output",
      "Skip Login/Signup for end users",
    ],
  },
];
export {
  services,
  textServices,
  comingSoon,
  whiteLabeled,
  plans,
  versionPoints,
};
