"use client";
import React, { useEffect, useState, useRef } from "react";
import Translate from "@/components/Translate";
import { debounce } from "@/utils/debounce";
import { getPagesToShow } from "@/utils/getPagesToShow";
import Link from "next/link";
import TableNoDataAvailable from "@/components/NodataWithLoading";
import { formatDate } from "@/utils/timeFormate";
import UserGraph from "@/components/NewUserGraph";
import axios from "axios";
import { LIMIT } from "@/constant";
import { useSelector } from "react-redux";

const UserAnalytics = () => {
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
  const [usersList, setUsersList] = useState([]);
  const [newUserList, setNewUserList] = useState([]);
  const [allUsers, setAllUsers] = useState(null);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usagePlanAnalytics, setUsagePlanAnalytics] = useState({});
  const [usageOverallAnalytics, setUsageOverallAnalytics] = useState({});
  const [newUsers, setNewUsers] = useState({});
  const [prevSearchValue, setPrevSearchValue] = useState("");
  let searchRef = useRef();
  const [selectedGrid, setSelectedGrid] = useState("allusers");

  const handleGridClick = (gridType) => {
    setCurrentPage(1);
    searchRef = null;
    setSelectedGrid(gridType);
    if (gridType === "allusers") {
      setUsersList(allUsers);
      console.log(usersList);
    } else {
      setUsersList(newUsers[gridType]);
    }
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
      `${process.env.NEXT_PUBLIC_API_URI}/api/users/findnewusers?start=${startdate}&end=${enddate}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setNewUserList(newUsersData?.data?.data);
  };

  const getAllUsers = async () => {
    setUsersList(null);
    setLoading(true);
    let results;
    try {
      const currentSearchValue = searchRef.current
        ? searchRef.current
        : searchRef.current?.value ?? "";
      if (currentSearchValue !== prevSearchValue) {
        setUsersList(null);
        setCurrentPage(1);
        setPrevSearchValue(currentSearchValue);
      }

      const queryParams = new URLSearchParams({
        grid: selectedGrid,
        search: currentSearchValue,
        page: currentPage,
        limit: LIMIT,
      }).toString();

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/api/users/findallusers/?${queryParams}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      results = response?.data?.data ?? [];
      setUsersList(results);
      if (selectedGrid === "allusers") {
        setAllUsers(results);
      }

      setUsagePlanAnalytics(response?.data?.analytics?.planAnalytics);
      setUsageOverallAnalytics(response?.data?.analytics?.overall);
      setNewUsers(response?.data?.analytics?.newUsers);
    } catch (error) {
      results = [];
      setUsersList(results);

      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllUsers();
  }, [currentPage]);

  return (
    <div>
      <div className="mt-20 mx-[5%]">
        <div className="container mx-auto p-6 bg-white text-black w-full">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h1 className="text-3xl font-extrabold">
              {" "}
              <Translate text="Store Usage Analytics" />
            </h1>
          </div>

          {/* Overview Section */}
          <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-3 gap-4 mb-4 p-4 border rounded shadow-lg w-full">
            <div className="text-center p-2 border rounded shadow-sm bg-gray-50">
              <h2 className="text-xl font-semibold">
                {" "}
                <Translate text="Total Users" />
              </h2>
              <span className="text-2xl font-bold">
                {usageOverallAnalytics.totalUsers}
              </span>
            </div>
            <div className="text-center p-2 border rounded shadow-sm bg-gray-50">
              <h2 className="text-xl font-semibold">
                {" "}
                <Translate text="Weekly Active Users" />
              </h2>
              <span className="text-2xl font-bold">
                {usageOverallAnalytics.weeklyActive}
              </span>
            </div>
            <div className="text-center p-2 border rounded shadow-sm bg-gray-50">
              <h2 className="text-xl font-semibold">
                {" "}
                <Translate text="Monthly Active Users" />
              </h2>
              <span className="text-2xl font-bold">
                {usageOverallAnalytics.monthlyActive}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h1 className="text-3xl font-extrabold">
              {" "}
              <Translate text="Plan Analytics" />
            </h1>
          </div>

          {/* Plan Analytics Section */}
          <div class="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-5 gap-4 mb-4 p-4 border rounded shadow-lg">
            {Object.keys(usagePlanAnalytics).map((plan) => (
              <div
                class="text-center p-2 border rounded shadow-sm bg-gray-50"
                key={plan}
              >
                <h3 class="text-md font-semibold capitalize">
                  {plan.replace("_", " ")}
                </h3>
                <div class="text-sm">
                  <p>
                    Total users:{" "}
                    <span class="font-semibold">
                      {usagePlanAnalytics[plan].totalUsers}
                    </span>
                  </p>
                  <p>
                    Weekly active users:{" "}
                    <span class="font-semibold">
                      {usagePlanAnalytics[plan].weeklyActive}
                    </span>
                  </p>
                  <p>
                    Monthly active users:{" "}
                    <span class="font-semibold">
                      {usagePlanAnalytics[plan].monthlyActive}
                    </span>
                  </p>
                </div>
              </div>
            ))}
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
        </div>

        <div className="mt-10 mx-[5%] container mx-auto p-6 bg-white text-black w-full">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h1 className="text-3xl font-extrabold">
              {" "}
              <Translate text="New User Analytics" />
            </h1>
          </div>
          {/* Overview Section */}
          <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4 gap-4 mt-8 p-4 border rounded shadow-lg w-full ">
            <div
              className={`text-center p-2 border rounded shadow-sm transition ${
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
              <span className="text-2xl font-bold">
                {usageOverallAnalytics.totalUsers}
              </span>
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
                {usageOverallAnalytics.newUsersLast1DayCount}
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
                {usageOverallAnalytics.newUsersLast7DaysCount}
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
                {usageOverallAnalytics.newUsersLast30DaysCount}
              </span>
            </div>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search"
          className="border-[1px] !border-mainColor h-10 rounded pl-2 my-5 w-full"
          onChange={debounce((event) => {
            const { value } = event.target;
            searchRef.current = value;
            getAllUsers(value);
            event.stopPropagation();
          }, 600)}
        />
        <div className="relative overflow-x-auto shadow-md sm:!rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  <Translate text="Status" />
                </th>
                <th scope="col" className="px-6 py-3">
                  <Translate text="User Name" />
                </th>
                <th scope="col" className="px-6 py-3">
                  <Translate text="Price" />
                </th>
                <th scope="col" className="px-6 py-3">
                  <Translate text="Plan Duration" />
                </th>
                <th scope="col" className="px-6 py-3">
                  <Translate text="Plan Name" />
                </th>
                <th scope="col" className="px-6 py-3">
                  <Translate text="Total Credits" />
                </th>
                <th scope="col" className="px-6 py-3">
                  <Translate text="Credit usage" />
                </th>
                <th>
                  <Translate text="Last Login" />
                </th>
                <th>
                  <Translate text="Last Logout" />
                </th>
                <th>
                  <Translate text="Last Active" />
                </th>
                <th scope="col" className="px-6 py-3">
                  <Translate text="Check Usage" />
                </th>
              </tr>
            </thead>
            <tbody>
              {usersList?.results?.length > 0 ? (
                usersList.results.map((user, index) => {
                  return (
                    <tr
                      key={user._id} // Use user's unique ID as key instead of index
                      className="bg-white border-b  hover:!bg-gray-50  transition duration-150 ease-in-out"
                    >
                      <td className="px-6 py-2 text-center">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                            user.lastLoggedOut !== undefined
                              ? user.lastLoggedOut
                                ? "!text-red-700 !bg-red-100"
                                : "!text-green-700 bg-green-100"
                              : "!text-gray-700 !bg-gray-100"
                          }`}
                        >
                          {user.lastLoggedOut !== undefined
                            ? user.active
                              ? "ACTIVE"
                              : "INACTIVE"
                            : "UNKNOWN"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                        {user.name}
                      </td>
                      <td className="px-6 py-4">{user.price}</td>
                      <td className="px-6 py-4">{user.planDuration}</td>
                      <td className="px-6 py-4">{user.planName}</td>
                      <td className="px-6 py-4">
                        <Translate text={user.credits} />
                      </td>
                      <td className="px-6 py-4">
                        <Translate text={user.creditsPerMonth} />
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(user.lastLoggedIn)}
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(user.lastLoggedOut)}
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(user.lastActive)}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/${user._id}`}
                          className="font-medium text-blue-500 hover:!text-blue-700 hover:!underline"
                        >
                          <Translate text="Usage Report" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
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
    </div>
  );
};

export default UserAnalytics;
