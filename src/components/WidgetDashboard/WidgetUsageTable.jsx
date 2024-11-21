"use client";

import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { LIMIT } from "@/constant";
import { useSelector } from "react-redux";
import axios from "axios";
import TableNoDataAvailable from "@/components/NodataWithLoading";
import { getPagesToShow } from "@/utils/getPagesToShow";

import "./WidgetDashboard.css";
import WidgetCTAModal from "@/components/WidgetCTAModel";
import * as XLSX from "xlsx";

const WidgetUsageTable = () => {
  const [usageFilterTab, setUsageFilterTab] = useState(false);
  const { token, user } = useSelector((state) => state.auth.user);
  const [usageList, setUsageList] = useState([]);
  const [sortColumns, setSortColumns] = useState([
    { column: "createdAt", order: "asc" },
  ]);

  const [loading, setLoading] = useState(false);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const defaultStartDate = oneWeekAgo.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    const currentDate = new Date().toISOString().split("T")[0];

    if (selectedStartDate > currentDate) {
      setStartDate(currentDate);
    } else {
      setStartDate(selectedStartDate);
    }

    if (selectedStartDate > enddate) {
      setEndDate(currentDate);
    }
  };

  //End Date

  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    const currentDate = new Date().toISOString().split("T")[0];

    if (selectedEndDate > currentDate) {
      setEndDate(currentDate);
    } else {
      setEndDate(selectedEndDate);
    }

    if (startDate > selectedEndDate) {
      setEndDate(selectedEndDate);
    }
  };

  const getAllUsageList = async () => {
    setUsageList(null);
    setLoading(true);
    let results;
    const queryParams = new URLSearchParams({
      startDate: startDate,
      endDate: endDate,
    }).toString();

    try {
      console.group(token, "token");
      let response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/api/widget/modelsRunningByDate?${queryParams}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      results = response?.data?.data ?? [];
      setUsageList(results);
    } catch (error) {
      results = [];
      setUsageList(results);
      console.log(error);
    }
    setLoading(false);
  };

  const downloadUsageData = () => {
    const workbook = XLSX.utils.book_new();

    // Create a new worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["Date", "Website", "Type", "ID", "Count"],
    ]);

    // Add header row to worksheet
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["Date", "Website", "Type", "ID", "Count"]],
      { origin: "A1" }
    );

    // Initialize row counter
    let rowCounter = 2;

    // Iterate through each record
    usageList.forEach((record) => {
      // Iterate through Decluttering_Count items
      record.Decluttering_Count.forEach((item) => {
        // Add Decluttering_Count item to worksheet
        XLSX.utils.sheet_add_aoa(
          worksheet,
          [[record.date, record.website, "Refurnishing", item._id, item.count]],
          { origin: `A${rowCounter}` }
        );

        // Increment row counter
        rowCounter++;
      });

      // Iterate through VirtualStaging_Count items (if any)
      record.VirtualStaging_Count.forEach((item) => {
        // Add VirtualStaging_Count item to worksheet
        XLSX.utils.sheet_add_aoa(
          worksheet,
          [
            [
              record.date,
              record.website,
              "Virtual Staging",
              item._id,
              item.count,
            ],
          ],
          { origin: `A${rowCounter}` }
        );

        // Increment row counter
        rowCounter++;
      });
    });

    // Append the worksheet to the workbook with the name "UsageData"
    XLSX.utils.book_append_sheet(workbook, worksheet, "UsageData");

    // Write the workbook to a file named "UsageByDate.xlsx"
    XLSX.writeFile(workbook, "UsageByDate.xlsx");
  };

  useEffect(() => {
    getAllUsageList();
  }, [startDate, endDate]);

  return (
    <>
      <div className="p-2 md:p-8 overflow-x-auto">
        <div className=" bg-white rounded-[10px] min-w-[800px]">
          <div className="  p-[30px]  ">
            <div
              className="flex flex-wrap items-center text-center gap-2"
              style={{ width: "100%" }}
            >
              <p className="font-bold text-[20px] leading-[24px] text-[#4F4E69] flex-shrink-0">
                Usage By Listing
              </p>

              <div className="flex flex-wrap gap-[59px]  font-semibold   items-center mt-2 md:mt-1 ml-auto relative">
                <button
                  onClick={() => setUsageFilterTab(!usageFilterTab)}
                  className={`w-[98px] h-10 px-[17px] py-2.5 rounded-[5px] justify-end items-center gap-2.5 inline-flex`}
                >
                  <div
                    className={`w-[98px] h-10 px-[17px] py-2.5 rounded-[5px] border justify-end items-center gap-2.5 inline-flex `}
                  >
                    <svg
                      width="20"
                      height="14"
                      viewBox="0 0 20 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 8H4C3.4 8 3 7.6 3 7C3 6.4 3.4 6 4 6H16C16.6 6 17 6.4 17 7C17 7.6 16.6 8 16 8ZM13 14H7C6.4 14 6 13.6 6 13C6 12.4 6.4 12 7 12H13C13.6 12 14 12.4 14 13C14 13.6 13.6 14 13 14ZM19 2H1C0.4 2 0 1.6 0 1C0 0.4 0.4 0 1 0H19C19.6 0 20 0.4 20 1C20 1.6 19.6 2 19 2Z"
                        fill="#4F4E69"
                      />
                    </svg>

                    <div
                      className={`text-gray-600 text-sm font-semibold  `}
                      onClick={() => setUsageFilterTab(!usageFilterTab)}
                    >
                      Filter
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  className="text-gray-900 mt-[10px] hover:text-white border border-gray-300 hover:bg-gray-900   font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2  "
                  onClick={downloadUsageData}
                >
                  Download
                </button>

                {usageFilterTab && (
                  <div className="absolute top-full left-0 mt-2 w-[252px]  rounded-xl bg-white z-50 p-4 flex flex-col items-start filter drop-shadow border-gray-300">
                    <p className="text-gray-600 text-sm font-semibold mb-4">
                      Filter
                    </p>

                    <div className="flex w-full">
                      <input
                        type="date"
                        className="date-input graph-date"
                        value={startDate}
                        onChange={handleStartDateChange}
                      />
                      <input
                        type="date"
                        className="date-input graph-date"
                        value={endDate}
                        onChange={handleEndDateChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <table
              className="table-auto mt-[30px] "
              style={{
                width: "100%",
                tableLayout: "auto",
                borderCollapse: "collaps",
              }}
            >
              <thead>
                <tr className="text-[#000000] text-[12px] leading-[14.4px] font-bold">
                  <th className="text-start">Date</th>
                  <th className="text-start">Website</th>
                  <th className="text-start">Refurnishing Runing URLs</th>
                  <th className="text-start">Refurnishing Count</th>
                  <th className="text-start">Virtual Staging URLs</th>
                  <th className="text-start">Virtual Staging Count</th>
                </tr>
              </thead>
              <tbody>
                {usageList?.length > 0 ? (
                  usageList?.map((usage, index) => (
                    <tr key={index} className="border-b border-gray-200 ">
                      <td className="text-[#030229] text-[12px] font-normal leading-[16.37px] py-[10px] text-start">
                        {usage?.date}
                      </td>
                      <td className="text-[#030229] text-[12px] font-normal leading-[16.37px] py-[10px] text-start">
                        {usage?.website}
                      </td>
                      <td
                        key={index}
                        className="text-[#030229] text-[12px] font-normal leading-[16.37px] py-[10px] text-start"
                      >
                        <ul className="space-y-2">
                          {usage?.Decluttering_Count?.map((url, index) => (
                            <li key={index} className="border-b border-gray-300">
                              {url?._id}
                            </li>
                          ))}
                        </ul>
                        {usage?.Decluttering_Count?.length === 0 && (
                          <p>No Data</p>
                        )}
                      </td>
                      <td
                        key={index}
                        className="text-[#030229] text-[12px] font-normal leading-[16.37px] py-[10px] text-start"
                      >
                        <ul className="space-y-2">
                          {usage?.Decluttering_Count?.map((url, index) => (
                            <li key={index} className="border-b border-gray-300">
                              {url?.count}
                            </li>
                          ))}
                        </ul>
                        {usage?.Decluttering_Count?.length === 0 && (
                          <p>No Data</p>
                        )}
                      </td>
                      <td
                        key={index}
                        className="text-[#030229] text-[12px] font-normal leading-[16.37px] py-[10px] text-start"
                      >
                        <ul className="space-y-2">
                          {usage?.VirtualStaging_Count?.map((url, index) => (
                            <li key={index} className="border-b border-gray-300">
                              {url?._id}
                            </li>
                          ))}
                        </ul>
                        {usage?.VirtualStaging_Count?.length === 0 && (
                          <p>No Data</p>
                        )}
                      </td>
                      <td
                        key={index}
                        className="text-[#030229] text-[12px] font-normal leading-[16.37px] py-[10px] text-start"
                      >
                        <ul className="space-y-2">
                          {usage?.VirtualStaging_Count?.map((url, index) => (
                            <li key={index} className="border-b border-gray-300">
                              {url?.count}
                            </li>
                          ))}
                        </ul>
                        {usage?.VirtualStaging_Count?.length === 0 && (
                          <p>No Data</p>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <TableNoDataAvailable loading={loading} colSpan={11} />
                )}
              </tbody>
            </table>
            {/* <div className="flex justify-center mt-4  mb-5">
              <button
                className="mr-2 px-4 py-2 bg-gray-300 hover:!bg-gray-400 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              {getPagesToShow(currentPage, usersList?.totalPages).map(
                (page) => (
                  <button
                    key={page}
                    className={`px-2 py-2 ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 hover:!bg-gray-400"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className="ml-2 px-4 py-2 bg-gray-300 hover:!bg-gray-400 disabled:opacity-50"
                disabled={currentPage === usersList?.totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default WidgetUsageTable;
