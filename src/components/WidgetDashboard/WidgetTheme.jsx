"use client";

import React, { useEffect, useState, cloneElement, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  widgetColorPicker,
  circleSelectedImg,
  widgetSelectedColor,
} from "@/utils/widgetDashboard";
import { toast } from "react-toastify";

const WidgetTheme = ({
  widgetAxis,
  setWidgetAxis,
  widgetLogo,
  setWidgetLogo,
}) => {
  const [selectedColorSvg, setSelectedColorSvg] = useState(
    widgetSelectedColor[0].svg
  );
  const [selectedSvgIndex, setSelectedSvgIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const { token, user } = useSelector((state) => state.auth.user);

  const onDrop = useCallback((acceptedFiles, name) => {
    if (acceptedFiles[0]) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "image/svg+xml",
      ];
      if (allowedTypes.includes(acceptedFiles[0].type)) {
        handelNewFileUpload(acceptedFiles[0], name);
      } else {
        alert("Unsupport Format");
        return;
      }
    }
  }, []);

  const handelNewFileUpload = async (file, name) => {
    let fileimg = file;
    setLoading(true);
    const ApiKey = "HLOH64Q4-20230313-OOQV9VVR";
    if (!file) return;
    const formData = new FormData();
    formData.append("image", fileimg);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/api/models/uploadimage?modelName=`,
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
        if (data?.fileurl) {
          setLoading(false);
          if (name === "textLogo") {
            setWidgetLogo((prevState) => ({
              ...prevState,
              logoText: data?.fileurl?.[0]?.fileurl || prevState.logoText, // Keeping previous value if data is not available
            }));
          } else {
            setWidgetLogo((prevState) => ({
              ...prevState,
              logoIcon: data?.fileurl?.[0]?.fileurl || prevState.logoIcon, // Keeping previous value if data is not available
            }));
          }
        } else {
          alert("Upload Failed");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // Get theme
  const fetchThemeData = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URI}/api/themes/getsingletheme?refDomain=${user?.joinedOrigin}`;
    try {
      const response = await axios.get(url);
      if (response.data && response.data.success) {
        setTheme(response.data.theme);
        const getThemeIndex = widgetColorPicker.findIndex(
          (item) => item.mainColor == response.data.theme.mainColor
        );
        setSelectedSvgIndex(getThemeIndex);
      }
    } catch (error) {
      console.error("Error fetching theme data:", error);
    }
  };
  // update theme

  const updateTheme = async () => {
    const selectedThemeColor = widgetColorPicker.find(
      (_, index) => index == selectedSvgIndex
    );
    const data = {
      refDomain: user?.joinedOrigin,
      mainColor: selectedThemeColor.mainColor,
      secondaryColor: selectedThemeColor.secondaryColor,
      bgColor: selectedThemeColor.bgColor,
      textColor: selectedThemeColor.textColor,
    };

    try {
      const updatedTheme = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URI}/api/themes/updatetheme`,
        data
      );
      if (updatedTheme) toast.success("Theme updated successfully");
      else toast.error("Theme not updated");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const updateAxis = async () => {
    try {
      if (
        widgetAxis?.xAxis <= 9 ||
        widgetAxis?.yAxis <= 9 ||
        widgetAxis?.xAxis > 90 ||
        widgetAxis?.yAxis > 90
      ) {
        toast.error("Position not valid, Please enter values between 10-90");
        return;
      }

      const updatedTheme = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URI}/api/widget/widgetposition`,
        {
          xAxis: widgetAxis?.xAxis,
          yAxis: widgetAxis?.yAxis,
          isNotfloatingIcon: widgetAxis?.isNotfloatingIcon,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (updatedTheme) toast.success("Position updated successfully");
      else toast.error("Position not updated");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateLogo = async () => {
    try {
      const updatedTheme = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URI}/api/widget/widgetlogo`,
        {
          logoWithText: widgetLogo?.logoText,
          logoIcon: widgetLogo?.logoIcon,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (updatedTheme) toast.success("Logo updated successfully");
      else toast.error("Logo not updated");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Theme Svgs
  const handleSvgClick = (index) => {
    if (selectedSvgIndex === index) {
      setSelectedSvgIndex(null);
    } else {
      setSelectedSvgIndex(index);
      setSelectedColorSvg(widgetSelectedColor[index].svg);
    }
  };

  useEffect(() => {
    fetchThemeData(window.location.host);
  }, []);

  return (
    <>
      <div
        className="bg-[#E8E8E8] flex flex-col"
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        <div className="flex flex-col bg-white items-center pt-[40px] pl-5 gap-[10px]">
          <p className="text-[20px] font-bold text-[#4F4E69] leading-[24px]">
            {`${user?.firstName} ${user?.lastName}`}
          </p>
          <p className="text-[16px] font-normal text-[#959299] leading-[21.82px] pb-[40px]">
            Admin
          </p>
        </div>
        <div className="mt-10 px-5">
          <p className="text-[16px] font-bold leading-[19.2px] text-[#4F4E69]">
            Primary Color
          </p>

          <div
            className=" gap-[6px] mt-[23px] grid grid-cols-6  "
            style={{ gridGap: "15px 0px" }}
          >
            {widgetColorPicker.map((item, index) => (
              <div key={index} onClick={() => handleSvgClick(index)}>
                <div className="flex flex-row justify-center items-center">
                  {index === selectedSvgIndex
                    ? cloneElement(circleSelectedImg[index].svg)
                    : cloneElement(item.svg)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <hr
          className="w-full mt-[40px]"
          style={{ borderTop: "2px dotted #BEBEBE" }}
        />

        <div className="mt-[40.49px] pl-[22.89px]   ">
          <p className="text-[#4F4E69] leading-[19.2px] font-bold text-[16px] mb-[25px]">
            Theme
          </p>
          <div className="flex">{selectedColorSvg && selectedColorSvg}</div>
          <div className=" ">
            <button
              className="  mt-[30px] w-[245px] rounded-[5] hover:bg-black hover:text-[white] text-[#000000] font-semibold"
              style={{
                border: "1px solid black ",
                padding: "10px 17px 10px 17px",
              }}
              onClick={updateTheme}
            >
              Save Changes
            </button>
          </div>
        </div>
        <hr
          className="w-full mt-[60px]   "
          style={{ borderTop: "2px dotted #BEBEBE" }}
        />
        <div className="w-[90%] mx-auto flex flex-col items-start mt-[20px]">
          <strong className="text-[#333333] mb-[10px]">Widget Position</strong>
          <div className="flex mb-[10px] items-center w-full">
            <span className="text-[#333333] font-[600] mr-[10px] w-auto">
              X-axis:
            </span>
            <input
              className="h-[40px] border bg-[#f0f0f0ed] px-[20px] w-auto outline-none"
              type="number"
              min={0}
              value={widgetAxis?.xAxis}
              onChange={(e) =>
                setWidgetAxis({ ...widgetAxis, xAxis: e.target.value })
              }
              max={100}
              placeholder="x-axis"
            />
            <span className="text-[#333333] text-[0.8rem] ml-[10px]">%</span>
          </div>
          <div className="flex items-center w-full">
            <span className="text-[#333333] font-[600] mr-[10px] w-auto">
              Y-axis:
            </span>
            <input
              className="h-[40px] border bg-[#f0f0f0ed] px-[20px] w-auto outline-none"
              type="number"
              min={0}
              max={100}
              value={widgetAxis?.yAxis}
              onChange={(e) =>
                setWidgetAxis({ ...widgetAxis, yAxis: e.target.value })
              }
              placeholder="y-axis"
            />
            <span className="text-[#333333] text-[0.8rem] ml-[10px]">%</span>
          </div>
          <div className="flex items-center mt-[20px]">
            <span className="text-[#333333] font-[600] mr-[10px]">
              Show Icon:
            </span>
            {widgetAxis.isNotfloatingIcon ? (
              <label
                class="relative inline-flex items-center cursor-pointer"
                onClick={() =>
                  setWidgetAxis({
                    ...widgetAxis,
                    isNotfloatingIcon: false,
                  })
                }
              >
                <input type="checkbox" value="" class="sr-only peer" disabled />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-0.5 rtl:peer-checked:after:-translate-x-0.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-500"></div>
              </label>
            ) : (
              <label
                class="relative inline-flex items-center cursor-pointer"
                onClick={() =>
                  setWidgetAxis({
                    ...widgetAxis,
                    isNotfloatingIcon: true,
                  })
                }
              >
                <input
                  type="checkbox"
                  value=""
                  class="sr-only peer"
                  checked
                  disabled
                />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
              </label>
            )}
          </div>
          <button
            className="mb-[30px]  mt-[30px] w-[245px] rounded-[5] hover:bg-black hover:text-[white] text-[#000000] font-semibold"
            style={{
              border: "1px solid black ",
              padding: "10px 17px 10px 17px",
            }}
            onClick={updateAxis}
          >
            Save Changes
          </button>
        </div>

        <hr
          className="w-full mt-[60px]   "
          style={{ borderTop: "2px dotted #BEBEBE" }}
        />
        <div className="w-[90%] mx-auto flex flex-col items-start mt-[20px]">
          <strong className="text-[#333333] mb-[10px]">Widget Logo</strong>
          <div className="grid grid-cols-[80px_1fr] gap-3 mb-[15px] items-center w-full">
            <div className="w-full">
              <img
                src={widgetLogo?.logoText}
                alt="logo"
                className="max-h-[45px] object-contain object-center"
              />
            </div>
            <div className="relative w-full">
              <label
                className={`w-full h-[40px] flex justify-center items-center text-[0.7rem] text-[#ffffff] bg-black rounded-[5px] ${
                  loading && "opacity-45"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  fill="#ffffff"
                  className="h-[20px] mr-[8px]"
                >
                  <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                </svg>
                Upload Text Logo
              </label>
              <input
                className="w-full h-full opacity-0 flex justify-center items-center text-[0.7rem] text-[#ffffff] bg-black rounded-[5px] absolute left-0 top-0 "
                type="file"
                id="uploadlogoText"
                onChange={(e) => {
                  const identifier = "textLogo";
                  onDrop(e.target.files, identifier);
                  e.target.value = null;
                }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-[80px_1fr] gap-3 mb-[10px] items-center w-full">
            <div className="w-full">
              <img
                src={widgetLogo?.logoIcon}
                alt="logo"
                className="max-h-[40px] object-center w-full object-contain"
              />
            </div>
            <div className="relative w-full">
              <label
                htmlFor="uploadlogoText2"
                className={`w-full h-[40px] flex justify-center items-center text-[0.7rem] text-[#ffffff] bg-black rounded-[5px] ${
                  loading && "opacity-45"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  fill="#ffffff"
                  className="h-[20px] mr-[8px]"
                >
                  <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                </svg>
                Upload Logo Icon
              </label>
              <input
                className="w-full h-full opacity-0 flex justify-center items-center text-[0.7rem] text-[#ffffff] bg-black rounded-[5px] absolute left-0 top-0 "
                type="file"
                id="uploadlogoText2"
                onChange={(e) => {
                  const identifier = "logoIcon"; // or you can get this dynamically
                  onDrop(e.target.files, identifier);
                  e.target.value = null;
                }}
                disabled={loading}
              />
            </div>
          </div>

          <button
            className="mb-[30px]  mt-[30px] w-[245px] rounded-[5] hover:bg-black hover:text-[white] text-[#000000] font-semibold"
            style={{
              border: "1px solid black ",
              padding: "10px 17px 10px 17px",
            }}
            onClick={updateLogo}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};

export default WidgetTheme;
