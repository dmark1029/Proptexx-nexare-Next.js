"use client";
import React, { useEffect, useRef, useState } from "react";
import { formatDate } from "@/utils/timeFormate";
import Translate from "@/components/Translate";
import { debounce } from "@/utils/debounce";
import TableNoDataAvailable from "@/components/NodataWithLoading";
import { getPagesToShow } from "@/utils/getPagesToShow";
import { handleSort } from "@/utils/sortColums";
import axios from "axios";
import { LIMIT } from "@/constant";
import { useSelector } from "react-redux";
import Link from "next/link";
import UserGraph from "./NewUserGraph";

const WidgetUsersAnalytics = () => {
  const [usersList, setUsersList] = useState([]);
  const [newUserList, setNewUserList] = useState([]);
  const [newUsersAnalytics, setNewUsersAnalytics] = useState({});
  const [startdate, setStartdate] = useState(null);
  const [enddate, setEnddate] = useState(null);
  const defaultEndDate = new Date().toISOString().split("T")[0];
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 30);
  const defaultStartDateString = defaultStartDate.toISOString().split("T")[0];

  useEffect(() => {
    setEnddate(defaultEndDate);
    setStartdate(defaultStartDateString);
    getNewUsersData(defaultStartDateString, defaultEndDate);
  }, []);

  const { token } = useSelector((state) => state.auth.user);
  const [sortColumns, setSortColumns] = useState([
    { column: "createdAt", order: "asc" },
  ]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGrid, setSelectedGrid] = useState("allusers");
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    weeklyActiveUsers: 0,
    monthlyActiveUsers: 0,
  });
  const [prevSearchValue, setPrevSearchValue] = useState("");
  let searchRef = useRef();

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
        grid: selectedGrid,
        userSource: "widget",
      }).toString();

      let response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/api/widget/allWidgetUsers/?${queryParams}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      results = response?.data?.data ?? [];
      setUsersList(results);
      setNewUsersAnalytics(response?.data?.analytics);
      setAnalytics({
        totalUsers: response?.data?.totalWidgetUsers,
        weeklyActiveUsers: response?.data?.weeklyActiveUsers ?? 0,
        monthlyActiveUsers: response?.data?.monthlyActiveUsers ?? 0,
      });
    } catch (error) {
      results = [];
      setUsersList(results);
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllusersList();
  }, [currentPage, selectedGrid]);

  const handleGridClick = (gridType) => {
    setCurrentPage(1);
    searchRef = null;
    setSelectedGrid(gridType);
  };
  const currentDate = new Date().toISOString().split("T")[0];
  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;

    if (selectedStartDate > currentDate) {
      setStartdate(currentDate);
    } else {
      setStartdate(selectedStartDate);
    }

    if (selectedStartDate > enddate) {
      setEnddate(currentDate);
    }
  };

  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    setEnddate(selectedEndDate);

    if (selectedEndDate > currentDate) {
      setEnddate(currentDate);
    }

    if (startdate > selectedEndDate) {
      setStartdate(selectedEndDate);
    }
  };

  const getNewUsersData = async (startdate, enddate) => {
    const newUsersData = await axios.get(
      `${
        process.env.NEXT_PUBLIC_API_URI
      }/api/widget/findnewextusers?start=${startdate}&end=${enddate}&userSource=${"widget"}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setNewUserList(newUsersData?.data?.data);
  };

  return (
    <div className="mt-20 mx-[5%]">
      <div className="container mx-auto p-6 bg-white text-black">
        {/* 1. Header Section */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h1 className="text-3xl font-extrabold">
            <Translate text="Widget Users Analytics" />
          </h1>
          <div className="flex items-center space-x-4"></div>
        </div>

        {/* 2. Overview Section */}
        <div className="grid grid-cols-2 md:!grid-cols-3 gap-6 mb-8 p-6 border rounded shadow-lg">
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              <Translate text="Total Users" />
            </h2>
            <span className="text-2xl font-bold">{analytics.totalUsers}</span>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              <Translate text="Weekly Active Users" />
            </h2>
            <span className="text-2xl font-bold">
              {analytics.weeklyActiveUsers}
            </span>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              <Translate text="Monthly Active Users" />
            </h2>
            <span className="text-2xl font-bold">
              {analytics.monthlyActiveUsers}
            </span>
          </div>
        </div>
        {/* Date Range Selector */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {" "}
            <Translate text="User Growth Graph" />
          </h2>
          <div className="flex mb-4">
            <div className="mr-4">
              <label className="block text-sm font-medium text-gray-700">
                <Translate text="Start Date" />
              </label>
              <input
                type="date"
                className="mt-1 p-2 border rounded"
                value={startdate}
                onChange={handleStartDateChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <Translate text="End Date" />
              </label>
              <input
                type="date"
                className="mt-1 p-2 border rounded"
                value={enddate}
                onChange={handleEndDateChange}
              />
            </div>
          </div>

          {/* Graph Section */}
          <div className="mb-4">
            <button
              className="!bg-[#2c2b2b] text-white py-2 px-4 rounded hover:!bg-black"
              onClick={() => getNewUsersData(startdate, enddate)}
            >
              <Translate text="Generate Graph" />
            </button>
          </div>
          <div className="mb-4">
            <UserGraph newUsersData={newUserList} />
          </div>
        </div>

        {/* Overview Section */}
      </div>

      <div className="mt-10 mx-[5%] container mx-auto p-6 bg-white text-black">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h1 className="text-3xl font-extrabold">
            {" "}
            <Translate text="New User Analytics" />
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4 gap-4 mt-8 p-4 border rounded shadow-lg w-full ">
          <div
            className={`text-center p-2 border rounded shadow-sm transition  ${
              selectedGrid === "allusers"
                ? "bg-black text-white"
                : "hover:!bg-gray-200 bg-gray-50 text-black cursor-pointer "
            }`}
            onClick={() => handleGridClick("allusers")}
          >
            <h2 className="text-xl font-semibold">
              {" "}
              <Translate text="All Users" />
            </h2>
            <span className="text-2xl font-bold">{analytics.totalUsers}</span>
          </div>
          <div
            className={`text-center p-2 border rounded shadow-sm transition ${
              selectedGrid === "newUsersLast1Day"
                ? "bg-black text-white"
                : "hover:!bg-gray-200 bg-gray-50 text-black cursor-pointer "
            }`}
            onClick={() => handleGridClick("newUsersLast1Day")}
          >
            <h2 className="text-xl font-semibold">
              {" "}
              <Translate text="Last 24 Hours" />
            </h2>
            <span className="text-2xl font-bold">
              {newUsersAnalytics.newUsersLast1Day}
            </span>
          </div>
          <div
            className={`text-center p-2 border rounded shadow-sm transition ${
              selectedGrid === "newUsersLast7Days"
                ? "bg-black text-white"
                : "hover:!bg-gray-200 bg-gray-50 text-black cursor-pointer"
            }`}
            onClick={() => handleGridClick("newUsersLast7Days")}
          >
            <h2 className="text-xl font-semibold">
              {" "}
              <Translate text="Last Week" />
            </h2>
            <span className="text-2xl font-bold">
              {newUsersAnalytics.newUsersLast7Days}
            </span>
          </div>
          <div
            className={`text-center p-2 border rounded shadow-sm transition  ${
              selectedGrid === "newUsersLast30Days"
                ? "bg-black text-white"
                : "hover:!bg-gray-200 bg-gray-50 text-black cursor-pointer"
            }`}
            onClick={() => handleGridClick("newUsersLast30Days")}
          >
            <h2 className="text-xl font-semibold">
              {" "}
              <Translate text="Last Month" />
            </h2>
            <span className="text-2xl font-bold">
              {newUsersAnalytics.newUsersLast30Days}
            </span>
          </div>
        </div>
      </div>

      <input
        type="text"
        ref={searchRef}
        placeholder="Search By Email or Name"
        className="border-[1px] !border-mainColor h-10 rounded pl-2 mb-5 mt-4 w-full"
        onChange={debounce((event) => {
          const { value } = event.target;
          searchRef.current = value;
          getAllusersList(value);
          event.stopPropagation();
        }, 600)}
      />

      <div className="relative overflow-x-auto shadow-md sm:!rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-6 py-3">
                <Translate text="Status" />
              </th>
              <th className="px-6 py-3">
                <Translate text="Email" />
              </th>
              <th className="px-6 py-3">
                <Translate text="First Name" />
              </th>
              <th className="px-6 py-3">
                <Translate text="Last Name" />
              </th>
              <th className="px-6 py-3">
                <Translate text="Phone" />
              </th>
              <th className="px-6 py-3">
                <Translate text="OTP" />
              </th>
              <th className="px-6 py-3">
                <Translate text="Last-Login" />
              </th>
              <th className="px-6 py-3">
                <Translate text="Last-Ativity" />
              </th>
              <th className="px-6 py-3">
                <Translate text="Last-Logout" />
              </th>

              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() =>
                  handleSort({
                    column: "createdAt",
                    state: sortColumns,
                    setState: setSortColumns,
                  })
                }
              >
                <Translate className="px-6 py-3" text="Created At" />
              </th>
              <th>
                <Translate className="px-6 py-3" text="Actions" />
              </th>
            </tr>
          </thead>
          <tbody>
            {usersList?.results?.length > 0 ? (
              usersList.results.map((user, index) => (
                <tr
                  key={index}
                  className="bg-white border-b text-left hover:!bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="px-6 py-2">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                        user.lastLoggedOut !== undefined
                          ? user.lastLoggedOut
                            ? "text-red-700 bg-red-100"
                            : "text-green-700 bg-green-100 "
                          : "text-gray-700 bg-gray-100"
                      }`}
                    >
                      {user.lastLoggedOut !== undefined
                        ? user.active
                          ? "ACTIVE"
                          : "INACTIVE"
                        : "UNKNOWN"}
                    </span>
                  </td>
                  <td className="px-6 py-2 ">{user.email}</td>
                  <td className="px-6 py-2 ">{user.firstName}</td>
                  <td className="px-6 py-2 ">{user.lastName}</td>
                  <td className="px-6 py-2 ">{user.phone}</td>
                  <td className="px-6 py-2 ">{user.otp}</td>
                  <td className="px-6 py-2  ">
                    {formatDate(user.lastLoggedIn)}
                  </td>
                  <td className="px-6 py-2 text-center ">
                    {formatDate(user.lastActive)}
                  </td>
                  <td className="px-6 py-2 text-center ">
                    {user.lastLoggedIn && !user.lastLoggedOut
                      ? "STILL ACTIVE"
                      : formatDate(user.lastLoggedOut)}
                  </td>
                  <td className="px-6 py-2 text-center">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-2 text-center">
                    <Link
                      href={`/dashboard/widgetUser/${user._id}`}
                      className="font-medium text-blue-500 hover:!text-blue-700 hover:!underline"
                    >
                      <Translate text="View Details" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <TableNoDataAvailable loading={loading} colSpan={11} />
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4  mb-5">
        <button
          className="mr-2 px-4 py-2 bg-gray-300 hover:!bg-gray-400 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <Translate text="Previous" />
        </button>
        {getPagesToShow(currentPage, usersList?.totalPages).map((page) => (
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
        ))}
        <button
          className="ml-2 px-4 py-2 bg-gray-300 hover:!bg-gray-400 disabled:opacity-50"
          disabled={currentPage === usersList?.totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <Translate text="Next" />
        </button>
      </div>
    </div>
  );
};

export default WidgetUsersAnalytics;
