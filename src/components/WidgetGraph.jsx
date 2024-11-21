import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { GridComponent, TooltipComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, TooltipComponent, LineChart, CanvasRenderer]);

const WidgetGraph = ({
  newUsersData,
  startdate,
  enddate,
  handleStartDateChange,
  handleEndDateChange,
}) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const chartRef = useRef(null);
  let myChart = null;

  useEffect(() => {
    if (!newUsersData.length || !chartRef.current) return;

    const creationDates = newUsersData.map((user) => user.createdAt);
    const userCountPerDay = creationDates.reduce((countMap, date) => {
      const day = date.split("T")[0];
      countMap[day] = (countMap[day] || 0) + 1;
      return countMap;
    }, {});

    const formattedLabels = Object.keys(userCountPerDay).map((day) =>
      formatDate(day)
    );
    const data = Object.values(userCountPerDay);

    const options = {
      tooltip: {
        trigger: "axis",

        axisPointer: {
          type: "line",
          lineStyle: {
            type: "dotted",
            color: "#aaa",
          },
        },

        showContent: true,
        alwaysShowContent: false,
        formatter: function (params) {
          return `<div style="
          position: relative; 
          background-color: black;
          border-radius: 6px; 
          color: #fff; 
          padding: 6px 10px; 
          font-size: 14px;
          text-align: center;
          box-shadow: 0 3px 6px 0 rgba(0,0,0,0.16);
        ">
          New Users<br/>${params[0].value}
          <div style="
            position: absolute; 
            bottom: -10px; 
            left: 50%; 
            border-top: 10px solid #000; 
            border-left: 10px solid transparent; 
            border-right: 10px solid transparent; 
            transform: translateX(-50%);
          "></div>
        </div>`;
        },
        backgroundColor: "black",
        borderColor: "transparent",
        textStyle: {
          color: "#fff",
        },
        extraCssText: "box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);",
        textStyle: {
          color: "#000",
        },
        backgroundColor: "#ffffff",
        borderColor: "#dddddd",
        borderWidth: 1,
        textStyle: {
          color: "#000",
        },
        padding: 10,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: formattedLabels,
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 80,
        interval: 20,
      },
      series: [
        {
          data: data,
          type: "line",
          smooth: true,
          lineStyle: {
            width: 6,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#0233E4" },
              { offset: 1, color: "#47C462" },
            ]),
          },
          itemStyle: {
            borderColor: "white",
            borderWidth: 2,

            color: "#AE8FF7",
          },
          label: {
            formatter: function (params) {},
            position: "top",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(2, 51, 228, 0.1)" },
              { offset: 1, color: "rgba(71, 196, 98, 0.1)" },
            ]),
          },

          symbolSize: 14,
          emphasis: {
            focus: "series",
            itemStyle: {
              borderColor: "white",
              borderWidth: 2,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: "rgba(0,0,0,0.5)",
              color: "white",
            },
            scaleSize: 20,
          },
        },
      ],
    };

    myChart = echarts.init(chartRef.current);
    myChart.setOption(options);

    return () => {
      if (myChart != null) {
        myChart.dispose();
      }
    };
  }, [newUsersData]);

  return (
    <div className="bg-white w-full h-[381px] rounded-[10px]">
      <div
        className="flex justify-between !flex-col md:!flex-row gap-2"
        style={{ padding: "38px 25px 0px 25px" }}
      >
        <p className="font-bold text-[20px] leading-[24px] text-[#4F4E69]">
          User Analytics
        </p>
        <div className="flex">
          <input
            type="date"
            className="date-input graph-date"
            value={startdate}
            onChange={handleStartDateChange}
          />
          <input
            type="date"
            className="date-input graph-date"
            value={enddate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>
      <div
        ref={chartRef}
        className="w-full"
        style={{ height: "calc(100% - 3.25rem)" }}
      />
    </div>
  );
};

export default WidgetGraph;
