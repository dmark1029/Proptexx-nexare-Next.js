"use client";
import { React, useState } from "react";
import { whiteLabeled } from "@/utils/sampleData";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Bar } from "react-chartjs-2";
import BeforeAfterModal from "@/components/BeforeAfterModal";
import Translate from "@/components/Translate";
Chart.register(CategoryScale);
const Dashboard = () => {
  const { token, user } = useSelector((state) => state.auth.user);
  let free = user?.planName == "free" || !token ? true : false;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [datas, setDatas] = useState(null);
  const [dataLoad, setDataLoad] = useState(false);
  const [allData, setAllData] = useState(null);
  const [modalImage, setModalImage] = useState({});

  const generateRandomRGB = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return { r, g, b };
  };

  // Helper function to convert RGB values to a CSS color string
  const rgbToCSS = (r, g, b, a = 1) => {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  const modelColors = {
    virtual_staging: { r: 50, g: 115, b: 220 },
    "virtual renovation": { r: 0, g: 128, b: 0 },
    grass: { r: 215, g: 65, b: 0 },
    enhancement: { r: 255, g: 165, b: 0 },
    sky: { r: 125, g: 165, b: 0 },
    "object removal": { r: 85, g: 15, b: 0 },
  };

  useEffect(() => {
    if (!dataLoad) {
      fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/users/singleuserusage`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setAllData(data?.usage);
          const datasets = [];
          data?.usage.forEach((item) => {
            let color = modelColors[item.optJson.model] || generateRandomRGB();
            datasets.push({
              label: item.optJson.model,
              data: [1],
              borderColor: rgbToCSS(color.r, color.g, color.b),
              backgroundColor: rgbToCSS(color.r, color.g, color.b, 0.5),
              fill: false,
            });
          });
          setDatas(datasets);
        })
        .catch((error) => {
          console.error(error.message);
        });

      // if (datas) {
      //   setDataLoad(true);
      //   var ctx = document.getElementById("myChart").getContext("2d");
      //   var myChart = new Chart(ctx, {
      //     // type: "bar",
      //     data: {
      //       labels: [
      //         "Sunday",
      //         "Monday",
      //         "Tuesday",
      //         "Wednesday",
      //         "Thursday",
      //         "Friday",
      //         "Saturday",
      //       ],
      //       datasets: datas,
      //     },
      //   });
      // }
    }
  }, [token]);
  const ViewImages = (originalImage, finalImage, imgId) => {
    setModalImage({ originalImage, finalImage, imgId });
    setOpen(true);
  };
  const mydata = [
    {
      id: 1,
      year: 2016,
      userGain: 80000,
      userLost: 823,
    },
    {
      id: 2,
      year: 2017,
      userGain: 45677,
      userLost: 345,
    },
    {
      id: 3,
      year: 2018,
      userGain: 78888,
      userLost: 555,
    },
    {
      id: 4,
      year: 2019,
      userGain: 90000,
      userLost: 4555,
    },
    {
      id: 5,
      year: 2020,
      userGain: 4300,
      userLost: 234,
    },
  ];
  return (
    <div className="max-w-[1100px] w-[90%] flex flex-col m-[30px_auto]">
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
      {/* <div className="mb-[20px]">
        <div className="flex justify-start items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="2.4em"
            className="mr-[20px]"
            viewBox="0 0 512 512"
            fill="#000000"
          >
            <path d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
          </svg>
          <h1 className="text-[2rem] text-[#2f2f33]">
            <Translate text="Usage" />
          </h1>
        </div>
        <p className="text-[0.9rem] text-[#3b3b3b]">
          <Translate text="Below you will find a summary of your usage" />
        </p>
      </div> */}

      {/* <div className="w-[100%] flex">
        <div className="border border-gray-400 pt-0 rounded-[5px]  w-full h-fit my-auto  shadow-xl">
          <Bar
            data={{
              labels: mydata.map((data) => data.year),
              datasets: [
                {
                  label: "Users Gained ",
                  data: mydata.map((data) => data.userGain),
                  backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0",
                  ],
                  borderColor: "black",
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Users Gained between 2016-2020",
                },
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
      </div> */}

      <div className="w-[100%] m-[50px_0px] flex overflow-auto flex-col border border-[#d4d4d4]  rounded-[5px] border-b-transparent">
        <table className="w-[100%] text-left min-w-[740px]">
          <tr className="text-[#494949] !bg-[#f2f2f2] p-[0px_10px] border-b border-[#dbdbdb]">
            <th className="p-[10px]">
              <Translate text="ID" />
            </th>
            <th className="p-[10px]">
              <Translate text="Date" />
            </th>
            <th className="p-[10px]">
              <Translate text="Service Name" />
            </th>
            <th></th>
          </tr>
          {allData?.map((item, index) => (
            <tr
              key={index}
              className="text-[#2b2b2b] border-b text-[0.9rem] border-[#dbdbdb]"
            >
              <td className="p-[8px_10px]">
                <Translate text={item?._id} />
              </td>
              <td className="p-[8px_10px]">
                <Translate text={item?.createdAt} />
              </td>
              <td className="p-[8px_10px]">
                <Translate text={item?.optJson?.model} />
              </td>
              <td className="p-[8px_10px]">
                <span
                  onClick={() =>
                    ViewImages(item?.optJson.image, item?.response, item?._id)
                  }
                  className="max-w-[90px] cursor-pointer w-[100%] h-[30px] rounded-[5px] flex justify-center items-center text-[#ffffff] text-[0.8rem] !bg-mainColor"
                >
                  <Translate text="View" />
                </span>
              </td>
            </tr>
          ))}
        </table>
      </div>
      <BeforeAfterModal open={open} setOpen={setOpen} stepsData={modalImage} />
    </div>
  );
};
export default Dashboard;
