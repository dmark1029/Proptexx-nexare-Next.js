"use client";
import { React, useState, useRef } from "react";
import { whiteLabeled } from "@/utils/sampleData";
import { useRouter } from "next/navigation";
import TooltipThemeProvider from "@/components/TooltipThemeProvider";
import { Button, Tooltip } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CTAModal from "@/components/CTAModal";
import { LoadScript } from "@react-google-maps/api";
import Translate from "@/components/Translate";
import { setUser } from "@/Redux/slices/authSlice";

const libraries = ["places"];

const DescriptionGeneration = () => {
  const { token, user } = useSelector((state) => state.auth.user);
  let free = user?.planName == "free" || !token ? true : false;
  const dispatch = useDispatch();
  const [places, setPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const count = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const onecredit = user?.usercredit?.descriptionGeneratorCredit;
  const propertyType = [
    "Apartment",
    "Condominium",
    "House",
    "Villa",
    "Office",
    "Land",
  ];
  const offerType = ["For Sale", "For Rent"];
  const exteriorType = [
    "Contemporary",
    "French",
    "Italian",
    "Mediterranean",
    "Modern",
    "Roman",
    "Spanish",
    "Tudor",
    "Victorian",
    "Villa",
    "Bungalow",
    "Multi Level House",
    "Century Home",
    "Farm house",
    "Art Nouveau",
    "Biedermeier",
    "Baroque",
    "Renaissance",
    "Gothic",
  ];
  const buildMaterial = [
    "Concrete",
    "Wood",
    "Brick",
    "Siding",
    "Stucco",
    "Stone",
  ];
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [descriptionData, setDescriptionData] = useState({
    location: "",
    material: "",
    building_style: "",
    architecture: "",
    area: "",
    offer_type: "",
    objects: [],
  });
  const [generatedText, SetGeneratedText] = useState("");

  const copyToClipboard = () => {
    setOpen(true);
    navigator.clipboard.writeText(generatedText);
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  };

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const autocompleteRef = useRef(null);

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      setQuery(place.formatted_address);
      setResults([]);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const changeFunction = (e) => {
    if (
      e.target.name == "bedroom" ||
      e.target.name == "floor" ||
      e.target.name == "bathroom"
    ) {
      setDescriptionData({
        ...descriptionData,
        objects: [
          ...descriptionData.objects,
          [e.target.name, parseInt(e.target.value)],
        ],
      });
    } else {
      setDescriptionData({
        ...descriptionData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const submit = async (e) => {
    if (free && !onecredit) {
      setOpen1(true);
    } else {
      e.preventDefault();
      SetGeneratedText("");
      setLoading(true);
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URI}/api/models/descriptiongeneration`,
          descriptionData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.data == undefined) {
            toast.error("Failed to Generate Description");
            return;
          } else if (response.data) {
            SetGeneratedText(response.data.text);
            dispatch(
              setUser({
                token,
                user: response.data.user,
              })
            );
            setLoading(false);
          } else {
            toast.error(`Failed To Generate Description`);
            setLoading(false);
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
            toast.error(`Failed To Generate Description`);
          }
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <div className="w-[90%] items-start flex-nowrap m-[auto] max-w-[1000px] grid grid-cols-[1fr] md:!grid-cols-[1fr_400px] md:!gap-[40px]">
        <div className="w-[100%]">
          <p
            className="flex items-center ml-[-5px] mt-[40px] mb-[40px] text-[0.9rem] text-gray-700 cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            <svg
              className="h-[18px] mr-[10px]"
              viewBox="0 0 26 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.9551 19.0566L7.68829 11.3378C7.42422 11.1042 7.31251 10.7996 7.31251 10.4999C7.31251 10.2003 7.42362 9.89667 7.64573 9.66206L14.9551 1.94331C15.4223 1.45428 16.1941 1.43397 16.6816 1.89557C17.1742 2.35921 17.1895 3.13362 16.7273 3.61909L10.2121 10.4999L16.7324 17.3808C17.1942 17.8664 17.1768 18.6376 16.6848 19.1043C16.1941 19.5644 15.4223 19.5441 14.9551 19.0566Z"
                fill={whiteLabeled ? "#c82021" : "#000000"}
              />
            </svg>
            <Translate text="Back to store" />
          </p>

          <form className="mt-6" onSubmit={submit}>
            <div className="flex flex-wrap justify-between">
              <h1 className="text-[1.8rem] text-[#333333] font-bold flex justify-start items-center">
                <svg
                  className="mr-[10px] mt-[-3px]"
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 384 512"
                  fill="#000000"
                >
                  <path d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                </svg>
                <Translate text="AI Property Description Generator" />
              </h1>
              <p className="text-[0.9rem] mt-[5px] text-[#333333]">
                <Translate text="Instantly create catchy and engaging property descriptions" />
              </p>
              <div className="w-full mb-4 mt-[30px]">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  <Translate text="Property Location" />
                </label>
                <LoadScript
                  googleMapsApiKey="AIzaSyA9VSywiGyE-2Oe3eV5v3tay3krzx8c5i0"
                  libraries={libraries}
                >
                  <input
                    type="text"
                    value={query}
                    name="location"
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none"
                    onChange={handleInputChange}
                    onFocus={(e) => {
                      const autocomplete =
                        new window.google.maps.places.Autocomplete(e.target);
                      autocompleteRef.current = autocomplete;
                      autocomplete.addListener(
                        "place_changed",
                        handlePlaceSelect
                      );
                    }}
                  />
                  {results.length > 0 && (
                    <ul>
                      {results.map((place, index) => (
                        <li key={index}>{place.formatted_address}</li>
                      ))}
                    </ul>
                  )}
                </LoadScript>
              </div>
              <div className="w-1/2 mb-4">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  <Translate text="Property Type" />
                </label>
                <select
                  id="type"
                  name="architecture"
                  onChange={changeFunction}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none appearance-none bg-transparent opacity-80"
                  required
                >
                  {propertyType.map((item) => (
                    <option value={`${item}`} key={item}>
                      <Translate text={item} />
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2 mb-4 pl-2">
                <label
                  htmlFor="offer"
                  className="block text-sm font-medium text-gray-700"
                >
                  <Translate text="Offer Type" />
                </label>
                <select
                  id="offer"
                  name="offer_type"
                  onChange={changeFunction}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none appearance-none bg-transparent opacity-80"
                  required
                >
                  {offerType.map((item) => (
                    <option value={`${item}`} key={item}>
                      <Translate text={item} />
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full mb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  <Translate text="Price" />
                </label>
                <div className="relative group flex">
                  <select
                    id="price_currency"
                    name="price_currency"
                    onChange={changeFunction}
                    className="p-2 border rounded-l-md focus:outline-none appearance-none bg-transparent opacity-80 text-[14px]"
                  >
                    <option value="USD">USD</option>
                  </select>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    className="p-2 w-full border-t border-b border-r rounded-r-md focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="w-[100%] mb-4 md:!w-1/3">
                <label
                  htmlFor="bedroom"
                  className="block text-sm font-medium text-gray-700"
                >
                  # <Translate text="Bedrooms" />
                </label>
                <select
                  id="bedroom"
                  name="bedroom"
                  onChange={changeFunction}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none appearance-none bg-transparent opacity-80"
                >
                  <option value="">--</option>
                  {count.map((item) => (
                    <option value={`${item}`} key={item}>
                      <Translate text={item} />
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-[100%] mb-4 md:!pl-2 md:!w-1/3">
                <label
                  htmlFor="bathroom"
                  className="block text-sm font-medium text-gray-700"
                >
                  # <Translate text="Bathrooms" />
                </label>
                <select
                  id="bathroom"
                  name="bathroom"
                  onChange={changeFunction}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none appearance-none bg-transparent opacity-80"
                >
                  <option value="">--</option>
                  {count.map((item) => (
                    <option value={`${item}`} key={item}>
                      <Translate text={item} />
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-[100%] mb-4 md:!pl-2 md:!w-1/3">
                <label
                  htmlFor="bedroom"
                  className="block text-sm font-medium text-gray-700"
                >
                  # <Translate text="Floors" />
                </label>
                <select
                  id="bedroom"
                  name="floor"
                  onChange={changeFunction}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none appearance-none bg-transparent opacity-80"
                >
                  <option value="">--</option>
                  {count.map((item) => (
                    <option value={`${item}`} key={item}>
                      <Translate text={item} />
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full mb-4">
                <label
                  htmlFor="area"
                  className="block text-sm font-medium text-gray-700"
                >
                  # <Translate text="Lot Size" />
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    id="area"
                    name="area"
                    onChange={changeFunction}
                    className="p-2 border rounded-l-md flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    step="0.01"
                  />
                  <div className="-ml-px">
                    <select
                      id="area_unit"
                      name="area_unit"
                      onChange={changeFunction}
                      className="p-2 border-t border-b border-r rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-600 appearance-none bg-transparent opacity-80"
                    >
                      <option value="1">sq m</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="w-full mb-4">
                <label
                  htmlFor="architecture"
                  className="block text-sm font-medium text-gray-700"
                >
                  <Translate text="Exterior Type" />
                </label>
                <select
                  id="architecture"
                  name="building_style"
                  onChange={changeFunction}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none appearance-none bg-transparent opacity-80"
                >
                  <option value="">--</option>
                  {exteriorType.map((item) => (
                    <option value={`${item}`} key={item}>
                      <Translate text={item} />
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full mb-4">
                <label
                  htmlFor="architecture"
                  className="block text-sm font-medium text-gray-700"
                >
                  <Translate text="Build Material" />
                </label>
                <select
                  id="material"
                  name="material"
                  onChange={changeFunction}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none appearance-none bg-transparent opacity-80"
                >
                  <option value="">--</option>
                  {buildMaterial.map((item) => (
                    <option value={`${item}`} key={item}>
                      <Translate text={item} />
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full mb-4">
                <label
                  for="additional"
                  className="block text-sm font-medium text-gray-700"
                >
                  <Translate text="Interior Highlights & Features" />
                </label>
                <textarea
                  id="additional"
                  name="additional"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none"
                  maxlength="100"
                ></textarea>
                <div id="additional-txt" className="text-sm"></div>
              </div>
              <div className="flex items-end w-full mt-2">
                <div className="w-full">
                  {free && !onecredit ? (
                    <TooltipThemeProvider>
                      <Tooltip
                        TransitionProps={{ timeout: 600 }}
                        title={
                          <div className="w-56 p-3">
                            <button
                              className="!bg-mainColor text-sm  text-white w-full py-1.5 mb-4 mt-2 rounded"
                              onClick={() => {
                                if (whiteLabeled) router.push("/login");
                                else setOpen1(true);
                              }}
                            >
                              {whiteLabeled ? (
                                <Translate text="Login to get access" />
                              ) : (
                                <Translate text="Upgrade Plan" />
                              )}
                            </button>
                            <p className="text-bold">
                              <Translate text="Upgrade to generate description" />
                            </p>
                          </div>
                        }
                      >
                        <button
                          onClick={submit}
                          id="btn-generate"
                          name="btn-generate"
                          className={`${
                            free && !onecredit ? "opacity-30" : null
                          } w-full !bg-mainColor text-white p-2 rounded-md cursor-pointer focus:outline-none`}
                        >
                          <Translate text="Generate" />
                        </button>
                      </Tooltip>
                    </TooltipThemeProvider>
                  ) : (
                    <input
                      type="submit"
                      id="btn-generate"
                      name="btn-generate"
                      className={`${
                        free && !onecredit ? "opacity-30" : null
                      } w-full !bg-mainColor text-white p-2 rounded-md cursor-pointer focus:outline-none`}
                      value="Generate"
                    />
                  )}
                  <CTAModal open={open1} setOpen={setOpen1} stepsData={{}} />
                </div>
              </div>

              <div className="flex justify-between w-full mt-4">
                <div className="text-blue-500" id="usage-message"></div>
                <div></div>
              </div>
            </div>
          </form>
        </div>
        {generatedText && (
          <div
            id="result"
            className="flex-fill pt-lg-4 pl-lg-4 p-[20px] bg-slate-200 mt-[60px] mb-[50px] rounded-[5px] max-w-[100%] md:!max-w-[400px]"
          >
            <p className="text-[#464649]">
              <Translate text={generatedText} />
            </p>
            <TooltipThemeProvider>
              <Tooltip
                open={open}
                TransitionProps={{ timeout: 600 }}
                title={
                  <div className="p-3">
                    <Translate text="Copied" />
                  </div>
                }
              >
                <button
                  onClick={copyToClipboard}
                  className="max-w-[140px] rounded-[5px] w-[100%] !bg-mainColor text-[#ffffff] h-[40px] flex justify-center items-center ml-[auto] cursor-pointer mt-[20px]"
                  alt="Copy to clipboard"
                >
                  <Translate text="Copy Text" />
                </button>
              </Tooltip>
            </TooltipThemeProvider>
          </div>
        )}
        {loading && (
          <div
            id="result"
            className="flex-fill flex justify-center items-center pt-lg-4 pl-lg-4 max-w-[400px] w-[100%] min-h-[120px] p-[20px] bg-slate-200 ml-[40px] mt-[60px] rounded-[5px]"
          >
            <div
              className="spinner mx-3 mt-[20px]"
              style={{
                borderTopColor: "black",
                width: "50px",
                height: "50px",
                margin: "auto",
              }}
              id="spinner"
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionGeneration;
