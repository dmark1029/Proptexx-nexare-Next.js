"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import WidgetGraph from "@/components/WidgetGraph";
import WidgetGraphTwo from "@/components/WidgetGraphTwo";
import { debounce } from "@/utils/debounce";
import axios from "axios";

const WidgetAnalytics = () => {
  const { token, user } = useSelector((state) => state.auth.user);
  const [widgetTwoData, setWidgetTwoData] = useState([]);
  const [newUserList, setNewUserList] = useState([]);
  const [startdate, setStartdate] = useState(null);
  const [enddate, setEnddate] = useState(null);

  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 30);

  // Debounced data fetching

  const fetchWidgetOneData = useCallback(
    debounce(async (start, end) => {
      try {
        const queryParams = new URLSearchParams({
          start: start,
          end: end,
        }).toString();

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URI}/api/widget/getAllWidgetUsersWithoutPagination?${queryParams}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNewUserList(response?.data?.data);
      } catch (error) {
        console.log("Error fetching widget data:", error);
        // Handle the error as needed, e.g., show an error message to the user
      }
    }, 500),
    [] // Add dependencies to the dependency array
  );
  const fetchWidgetTwoData = useCallback(
    debounce(async () => {
      const WidgetGraphTwoApi = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/api/widget/getAllWidgetUsersWithoutPagination`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWidgetTwoData(WidgetGraphTwoApi?.data?.data);
    }, 500),
    []
  );

  //Start Date
  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    const currentDate = new Date().toISOString().split("T")[0];

    if (selectedStartDate > currentDate) {
      setStartdate(currentDate);
    } else {
      setStartdate(selectedStartDate);
    }

    if (selectedStartDate > enddate) {
      setEnddate(currentDate);
    }
  };

  //End Date

  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    const currentDate = new Date().toISOString().split("T")[0];

    if (selectedEndDate > currentDate) {
      setEnddate(currentDate);
    } else {
      setEnddate(selectedEndDate);
    }

    if (startdate > selectedEndDate) {
      setStartdate(selectedEndDate);
    }
  };

  useEffect(() => {
    fetchWidgetTwoData();

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    const defaultEndDate = currentDate.toISOString().split("T")[0];
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    const defaultStartDateString = defaultStartDate.toISOString().split("T")[0];
    setStartdate(defaultStartDateString);
    setEnddate(defaultEndDate);
  }, []);

  useEffect(() => {
    if (startdate && enddate) {
      fetchWidgetOneData(startdate, enddate);
    }
  }, [startdate, enddate]);

  return (
    <>
      <div className="p-2 md:p-8 !grid !grid-cols-1 md:!grid-cols-[2fr_1fr] gap-10 md:gap-8 w-full">
        <div className="flex flex-col gap-2.5 w-full bg-white pb-10 md:pb-0">
          <WidgetGraph
            newUsersData={newUserList}
            startdate={startdate}
            enddate={enddate}
            handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
          />
        </div>

        <div className="flex flex-col widget-graph-container w-full">
          <WidgetGraphTwo WidgetGraphTwoApi={widgetTwoData} />
        </div>
      </div>
    </>
  );
};

export default WidgetAnalytics;
