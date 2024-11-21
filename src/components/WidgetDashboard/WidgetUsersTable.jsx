"use client";

import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { LIMIT } from "@/constant";
import { useSelector } from "react-redux";
import axios from "axios";
import TableNoDataAvailable from "@/components/NodataWithLoading";
import { getPagesToShow } from "@/utils/getPagesToShow";

import { debounce } from "@/utils/debounce";
import "./WidgetDashboard.css";
import WidgetCTAModal from "@/components/WidgetCTAModel";
import * as XLSX from "xlsx";

const WidgetUsersTable = ({
  widgetAxis,
  setWidgetAxis,
  widgetLogo,
  setWidgetLogo,
}) => {
  const [openFilterTab, setOpenFilterTab] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userActionList, setUserActionList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("allUsers");

  const [usersList, setUsersList] = useState([]);
  const [userId, setUserId] = useState(null);
  const { token, user } = useSelector((state) => state.auth.user);
  const [sortColumns, setSortColumns] = useState([
    { column: "createdAt", order: "asc" },
  ]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [interested, setInterested] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  let searchRef = useRef();

  // Format Date
  const formatDate = (date) => {
    if (!date) return "-";
    const formattedDate = moment(date).format("DD/MM/YY");
    return formattedDate;
  };

  // Get user

  const getAllusersList = async () => {
    setUsersList(null);
    setLoading(true);
    let results;
    try {
      const sortParam = sortColumns
        .map((item) => `${item.column}:${item.order}`)
        .join(",");

      const currentSearchValue = searchRef.current
        ? searchRef.current
        : searchRef.current?.value ?? "";
      if (currentSearchValue !== prevSearchValue) {
        setCurrentPage(1);
        setPrevSearchValue(currentSearchValue);
      }
      const queryParams = new URLSearchParams({
        sortBy: sortParam,
        search: currentSearchValue,
        page: currentPage,
        limit: LIMIT,
        grid: selectedOption,
        ...(interested && { interested: true }),
      }).toString();
      let response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/api/widget/widgetUsers/?${queryParams}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      results = response?.data?.data ?? [];
      setUsersList(results);
      setWidgetAxis({
        ...widgetAxis,
        yAxis: response?.data?.yAxis || 95,
        xAxis: response?.data?.xAxis || 95,
        isNotfloatingIcon: response?.data?.isNotfloatingIcon,
      });
      setWidgetLogo({
        ...widgetLogo,
        logoText:
          response?.data?.logoWithText ||
          "https://app.proptexx.com/images/nexa-logo.png",
        logoIcon:
          response?.data?.logoIcon || "https://app.proptexx.com/favicon.svg",
      });
    } catch (error) {
      results = [];
      setUsersList(results);
      console.log(error);
    }
    setLoading(false);
  };

  // Modal
  const toggleModal = (user_id) => {
    setUserId(user_id);
    setIsModalOpen(true);
  };

  const handleOptionChange = (value) => {
    if (selectedOption === value) return;
    setSelectedOption(value);
    setCurrentPage(1);
  };

  // Export Data
  const exportToCSV = async () => {
    try {
      setLoading(true);

      let queryParams = new URLSearchParams({
        ...(selectedOption === "Interested" && { interested: true }),
      });
      switch (selectedOption) {
        case "newUsersLast1Day":
          queryParams.append("grid", "newUsersLast1Day");
          break;
        case "newUsersLast7Days":
          queryParams.append("grid", "newUsersLast7Days");
          break;
        case "newUsersLast30Days":
          queryParams.append("grid", "newUsersLast30Days");
          break;
        case "newUsersLastYears":
          queryParams.append("grid", "newUsersLastYears");
          break;
        default:
          break;
      }
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_URI
        }/api/widget/getAllWidgetUsersWithoutPagination?${queryParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const usersData = response?.data?.data;

      const worksheet = XLSX.utils.json_to_sheet(usersData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

      const fileName = "users.xlsx";
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Error during export:", error);
    } finally {
      setLoading(false);
    }
  };
  const downloadUsageData = async (userId) => {
    let queryParams = new URLSearchParams({
      userId,
    });
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_URI
        }/api/widget/usageByUser?${queryParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data) {
        // Assuming you have the response object

        const user = response?.data?.result?.user;
        const usage = response?.data?.result?.usage; // Extracting the usage data array from the response
        const worksheetData = []; // Array to hold the data for the worksheet

        // Adding user details as the first row for each user
        const userDataRow = [
          "First Name",
          "Last Name",
          "Email",
          "Phone",
          "Date",
          "Model",
          "App URL",
        ];

        worksheetData.push(userDataRow);

        // Iterating through the usage data for the current user
        usage.forEach((item, index) => {
          const rowData = [
            index === 0 ? user?.firstName : "", // First name column
            index === 0 ? user?.lastName : "", // Last name column
            index === 0 ? user?.email : "", // Email column
            index === 0 ? user?.phone : "", // Phone column
            item.date, // Date column
            item.model, // Model column
            item.appUrl, // App URL column
          ];
          worksheetData.push(rowData); // Adding usage data to worksheet data array
        });

        // Iterating through the usage data for the current user

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); // Converting the data to worksheet
        const workbook = XLSX.utils.book_new(); // Creating a new workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users and Usage"); // Adding worksheet to the workbook

        const fileName = "users_and_usage.xlsx"; // Setting the file name
        XLSX.writeFile(workbook, fileName); // Writing the workbook to a file
      }
    } catch (error) {
      console.error("Error during export:", error);
    }
  };
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

  useEffect(() => {
    getAllusersList();
  }, [currentPage, selectedOption, interested, startDate, endDate]);

  //   useEffect(() => {
  //     if (!isModalOpen) setUserActionList([]);
  //   }, [isModalOpen]);

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
                Recent Users
              </p>

              <div className="flex flex-wrap gap-[59px]  font-semibold   items-center mt-2 md:mt-1 ml-auto relative">
                <button
                  onClick={() => setOpenFilterTab(!openFilterTab)}
                  className={`w-[98px] h-10 px-[17px] py-2.5 rounded-[5px]   justify-end items-center gap-2.5 inline-flex`}
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
                      onClick={() => setOpenFilterTab(!openFilterTab)}
                    >
                      Filter
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  className="text-gray-900 mt-[10px] hover:text-white border border-gray-300 hover:bg-gray-900   font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2  "
                  onClick={exportToCSV}
                >
                  Download
                </button>

                {openFilterTab && (
                  <div className="absolute top-full left-0 mt-2 w-[252px]  rounded-xl bg-white z-50 p-4 flex flex-col items-start filter drop-shadow border-gray-300">
                    <p className="text-gray-600 text-sm font-semibold mb-4">
                      Filter
                    </p>

                    <p className="text-black text-xs font-medium mb-2">Users</p>
                    <label className=" mb-2 cursor-pointer flex items-center">
                      <div class="w-1.5 h-1.5 left-[38px] top-[81px] absolute bg-green-600 rounded-full "></div>
                      <input
                        type="checkbox"
                        checked={interested}
                        onClick={() => setInterested(!interested)}
                        className="form-checkbox h-4 w-4 text-green-600 border-gray-300 mr-4"
                      />
                      <span className="text-neutral-400 text-xs font-normal ">
                        Interested Users
                      </span>
                    </label>

                    <p className="text-gray-600 text-xs font-semibold mt-2 mb-2">
                      Activity
                    </p>
                    <label className=" mb-2 cursor-pointer flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOption === "allUsers"}
                        onClick={() => handleOptionChange("allUsers")}
                        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 mr-2"
                      />
                      <span className="text-neutral-400 text-xs font-normal">
                        {" "}
                        All signed up users
                      </span>
                    </label>

                    <label className=" mb-2 cursor-pointer flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOption === "newUsersLast1Day"}
                        onClick={() => handleOptionChange("newUsersLast1Day")}
                        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 mr-2"
                      />
                      <span className="text-neutral-400 text-xs font-normal">
                        Last 24 hours signed up
                      </span>
                    </label>

                    <label className=" mb-2 cursor-pointer flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOption === "newUsersLast7Days"}
                        onClick={() => handleOptionChange("newUsersLast7Days")}
                        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 mr-2"
                      />
                      <span className="text-neutral-400 text-xs font-normal">
                        {" "}
                        Last week signed up
                      </span>
                    </label>

                    <label className=" mb-2 cursor-pointer flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOption === "newUsersLast30Days"}
                        onClick={() => handleOptionChange("newUsersLast30Days")}
                        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 mr-2"
                      />
                      <span className="text-neutral-400 text-xs font-normal">
                        {" "}
                        Last month signed up
                      </span>
                    </label>

                    <label className=" mb-2 cursor-pointer flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOption === "newUsersLastYears"}
                        onClick={() => handleOptionChange("newUsersLastYears")}
                        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 mr-2"
                      />
                      <span className="text-neutral-400 text-xs font-normal">
                        {" "}
                        Last year signed up
                      </span>
                    </label>
                    <label className=" mb-2 cursor-pointer flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOption === "customDateRange"}
                        onClick={() => handleOptionChange("customDateRange")}
                        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 mr-2"
                      />
                      <span className="text-neutral-400 text-xs font-normal">
                        Select Custom Date Range
                      </span>
                    </label>

                    {selectedOption === "customDateRange" && (
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
                    )}
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Search..."
                  className="max-w-[239px] h-[40px] rounded-[5px] bg-auto bg-origin-padding bg-no-repeat bg-[center_left_10px] pl-10 border border-transparent bg-gray-100 flex-shrink-0 outline-none focus:border-none hover:border-none"
                  style={{
                    backgroundImage: "url('/widgetdashboard/Vector.svg') ",
                  }}
                  ref={searchRef}
                  onChange={debounce((event) => {
                    const { value } = event.target;
                    searchRef.current = value;
                    getAllusersList();
                    event.stopPropagation();
                  }, 600)}
                />
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
                  <th className="text-start">Status</th>
                  <th className="text-start">Email</th>
                  <th className="text-start">Phone Number</th>
                  <th className="text-start">First Name</th>
                  <th className="text-start">Last Name</th>
                  <th className="text-start">Last Activity</th>
                  <th className="text-start">Interested</th>
                  {/* <th className="text-start">Contact By</th> */}

                  <th className="text-start">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList?.results?.length > 0 ? (
                  usersList.results.map((user, index) => (
                    <tr key={index} className="border-b border-gray-200 ">
                      <td className=" py-2 text-start">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                            user.lastLoggedOut !== undefined
                              ? user.lastLoggedOut
                                ? "!text-blue-600 !bg-blue-50"
                                : "!text-blue-600 !bg-blue-50"
                              : ""
                          }`}
                        >
                          {user.lastLoggedOut !== undefined
                            ? user.active
                              ? " Live Now"
                              : "INACTIVE"
                            : ""}
                        </span>
                      </td>

                      <td className="text-[#030229] text-[12px] font-normal leading-[16.37px] py-[10px] text-start">
                        {user.email}
                      </td>
                      <td className="text-[#030229] text-[12px] font-normal leading-[16.37px] py-[10px] text-start">
                        {user.phone}
                      </td>
                      <td className="text-[#959299] text-[12px] font-normal leading-[16.37px] py-[10px] text-start">
                        {user.firstName}
                      </td>
                      <td className="text-[#959299] text-[12px] font-normal leading-[16.37px] py-[10px] text-start">
                        {" "}
                        {user.lastName}
                      </td>

                      <td className="text-[#959299] text-[12px] font-normal leading-[16.37px] py-[10px] text-start">
                        {user.lastLoggedIn && !user.lastLoggedOut
                          ? "STILL ACTIVE"
                          : formatDate(user.lastLoggedOut)}
                      </td>

                      <td className="text-[#030229] text-[12px] font-normal leading-[16.37px] py-[10px] text-start">
                        {user.interested ? (
                          <div className="w-[54px] h-[30px] px-3 py-[7px] rounded border border-neutral-100 justify-start items-center gap-[5px] inline-flex">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                            <div className="text-slate-950 text-xs font-normal font-['Nunito']">
                              Yes
                            </div>
                          </div>
                        ) : (
                          <div className="w-[54px] h-[30px] px-3 py-[7px] rounded border border-neutral-100 justify-start items-center gap-[5px] inline-flex">
                            <div class="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                            <div className="text-slate-950 text-xs font-normal font-['Nunito']">
                              No
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="text-[#5B93FF] text-[12px] font-normal leading-[16.37px]  underline underline-offset-1 py-[10px] text-start flex gap-1">
                        <button
                          className="font-medium text-blue-500 hover:!text-blue-700 hover:!underline text-start"
                          onClick={() => downloadUsageData(user._id)}
                        >
                          Usage
                        </button>
                        <button
                          className="font-medium text-blue-500 hover:!text-blue-700 hover:!underline text-start"
                          onClick={() => toggleModal(user._id)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <TableNoDataAvailable loading={loading} colSpan={11} />
                )}
              </tbody>
            </table>
            <div className="flex justify-center mt-4  mb-5">
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
            </div>
          </div>
        </div>
      </div>

      <WidgetCTAModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        userId={userId}
        setUserId={setUserId}
        usersList={usersList}
        setUserActionList={setUserActionList}
        userActionList={userActionList}
      />
    </>
  );
};

export default WidgetUsersTable;
