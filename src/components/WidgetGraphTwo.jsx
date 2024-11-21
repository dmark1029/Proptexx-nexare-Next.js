import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { TitleComponent } from "echarts/components";

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  TitleComponent,
]);

const WidgetGraphTwo = ({ WidgetGraphTwoApi }) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("");
  const [displayData, setDisplayData] = useState({
    percentage: 0,
    label: "Loading...",
  });
  const chartRef = useRef(null);

  const updateChartData = (percentage) => {
    const myChart = echarts.getInstanceByDom(chartRef.current);
    if (myChart) {
      const options = getChartOptions(percentage);
      myChart.setOption(options);
      setDisplayData({ percentage: percentage, label: "Active Users" });
    }
  };

  const calculateActiveUsersPercentage = (data) => {
    const activeUsersCount = data.filter((user) => user.active)?.length;
    return Math.round((activeUsersCount / WidgetGraphTwoApi?.length) * 100);
  };

  const handleGridClick = (value) => {
    let timeFrameDate;
    let timeFrameText;
    switch (value) {
      case "newUsersLast1Day":
        timeFrameDate = new Date(Date.now() - 864e5);
        timeFrameText = "Last 24 Hours";
        break;
      case "newUsersLast7Days":
        timeFrameDate = new Date(Date.now() - 7 * 864e5);
        timeFrameText = "Last Week";
        break;
      case "newUsersLast30Days":
        timeFrameDate = new Date(Date.now() - 30 * 864e5);
        timeFrameText = "Last Month";

        break;
      case "allusers":
        timeFrameDate = new Date(
          Math.min(...WidgetGraphTwoApi.map((user) => new Date(user.createdAt)))
        );
        timeFrameText = "All Time";

      default:
        timeFrameText = "";
        break;
    }
    setSelectedTimeFrame(timeFrameText);
    const filteredData = WidgetGraphTwoApi.filter(
      (user) => new Date(user.createdAt) >= timeFrameDate
    );
    const perc = calculateActiveUsersPercentage(filteredData);
    updateChartData(perc);
  };

  const getChartOptions = (activeUsersPercentage) => {
    return {
      title: {
        show: false,
      },
      tooltip: {
        trigger: "item",
        textStyle: {
          color: "#000000",
          fontSize: 16,
        },
        backgroundColor: "#FFFFFF",

        z: 10000000,
        zlevel: 10000,
        extraCssText:
          "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); position: absolute;",
      },

      legend: {
        show: false,
      },
      series: [
        {
          name: "User Status",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "40",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: activeUsersPercentage,
              name: "Active Users",
              itemStyle: { color: "#FFC836" },
            },
            {
              value: 100 - activeUsersPercentage,
              name: "Inactive Users",
              itemStyle: { color: "#DEE9FF" },
            },
          ],
        },
      ],
    };
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current);

    if (WidgetGraphTwoApi.length) {
      const percentage = calculateActiveUsersPercentage(WidgetGraphTwoApi);
      const options = getChartOptions(percentage);
      myChart.setOption(options);
      setDisplayData({ percentage: percentage, label: "Active Users" });
    }

    return () => {
      myChart.dispose();
    };
  }, [WidgetGraphTwoApi]);

  return (
    <div
      className="bg-blue-500 p-4 text-white rounded-lg shadow-md relative"
      style={{
        background: "linear-gradient(180deg, #3068E3 0%, #1C49B5 100%)",
        width: "342px",
        height: "381px",
        overflow: "hidden",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-lg font-bold">New Users</p>
          {/* <p className="text-sm">{selectedTimeFrame}</p> */}
        </div>
        <div>
          <select
            className="bg-blue-700 text-white p-2 rounded-md cursor-pointer"
            onChange={(e) => handleGridClick(e.target.value)}
          >
            <option value="allusers" className="py-2 text-sm">
              All Time
            </option>
            <option value="newUsersLast1Day" className="py-2 text-sm ">
              Last 24 Hours
            </option>
            <option value="newUsersLast7Days" className="py-2 text-sm">
              Last Week
            </option>
            <option value="newUsersLast30Days" className="py-2 text-sm">
              Last Month
            </option>
          </select>
        </div>
      </div>

      <div
        ref={chartRef}
        className="w-full h-full"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
        }}
      ></div>

      <div
        className="absolute top-[125px] left-0 w-full h-full flex flex-col items-center justify-center"
        style={{ zIndex: 1 }}
      >
        <svg
          width="342"
          height="180"
          viewBox="0 0 342 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.2"
            d="M107.705 24.1053C134.557 -5.22396 180.1 -7.23243 209.43 19.6192L387.988 183.094C417.317 209.946 419.326 255.489 392.474 284.819L199.269 495.851C172.417 525.18 126.874 527.189 97.5443 500.337L-81.0144 336.862C-110.344 310.01 -112.352 264.467 -85.5005 235.138L107.705 24.1053Z"
            fill="#3EAEFF"
          />
        </svg>
      </div>
      <div
        className="absolute top-[125px] left-0 w-full h-full flex flex-col items-center justify-center"
        style={{ zIndex: 1 }}
      >
        <svg
          width="342"
          height="128"
          viewBox="0 0 342 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.2"
            d="M107.2 23.5076C134.052 -5.8216 179.595 -7.83009 208.925 19.0216L336.83 136.122C366.159 162.973 368.167 208.517 341.316 237.846L199.773 392.449C172.922 421.778 127.378 423.786 98.0488 396.935L-29.8561 279.834C-59.1854 252.983 -61.1939 207.439 -34.3422 178.11L107.2 23.5076Z"
            fill="#2DFFCC"
          />
        </svg>
      </div>
      <div className="absolute top-[100px] left-0 w-full h-full flex flex-col items-center justify-center">
        <div className="text-center absolute" style={{ zIndex: 1 }}>
          <p className="text-[30px] font-semibold leading-[36px] text-white">
            {displayData.percentage}%
          </p>
          <p className="text-[16px] font-normal leading-[21.82px] text-[#E7EFFF] mb-[24px]">
            {displayData.label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WidgetGraphTwo;
