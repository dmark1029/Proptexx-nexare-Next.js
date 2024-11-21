"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const WidgetUserCount = () => {
  const [analytics, setAnalytics] = useState({
    dailyNewUsers: 0,
    totalUsers: 0,
    weeklyActiveUsers: 0,
    monthlyActiveUsers: 0,
  });
  const { token } = useSelector((state) => state.auth.user);

  const getUserCounts = async () => {
    try {
      let response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/api/widget/widgetUsers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalytics({
        dailyNewUsers: response?.data?.dailyNewUsers ?? 0,
        totalUsers: response?.data?.totalWidgetUsers ?? 0,
        weeklyActiveUsers: response?.data?.weeklyActiveUsers ?? 0,
        monthlyActiveUsers: response?.data?.monthlyActiveUsers ?? 0,
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getUserCounts();
  }, []);
  return (
    <>
      <div
        className="flex gap-4 md:gap-8 stats-container"
        style={{
          padding: "30px 30px 0px 30px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          width: "100%",
        }}
      >
        <div className="bg-[#FFFFFF] border-[1px] rounded-[15px]  h-[116px] flex gap-[23px] pl-[28px] justify-start items-center text-center stat-card">
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect opacity="0.1" width="60" height="60" rx="30" fill="#5B93FF" />
            <path
              d="M32.483 23.4666C33.5927 24.1623 34.3708 25.3397 34.5125 26.7064C34.9778 26.9253 35.4856 27.039 35.9999 27.0395C37.944 27.0395 39.5197 25.4637 39.5197 23.5199C39.5197 21.5757 37.944 20 35.9999 20C34.0743 20.0006 32.5123 21.5482 32.483 23.4666ZM30.177 30.6735C32.1212 30.6735 33.6969 29.0974 33.6969 27.1536C33.6969 25.2097 32.1209 23.634 30.177 23.634C28.2332 23.634 26.6565 25.21 26.6565 27.1539C26.6565 29.0977 28.2332 30.6735 30.177 30.6735ZM31.6701 30.9134H28.6833C26.1983 30.9134 24.1766 32.9354 24.1766 35.4204V39.073L24.1858 39.1302L24.4374 39.209C26.809 39.95 28.8693 40.1971 30.5652 40.1971C33.8775 40.1971 35.7974 39.2527 35.9157 39.1925L36.1508 39.0736H36.176V35.4204C36.1769 32.9354 34.1551 30.9134 31.6701 30.9134ZM37.4935 27.2797H34.5298C34.4997 28.424 34.0185 29.5101 33.191 30.3012C35.3999 30.958 37.0161 33.0064 37.0161 35.4258V36.5514C39.9423 36.4442 41.6286 35.6148 41.7397 35.5591L41.9748 35.4399H42V31.7861C42 29.3014 39.9783 27.2797 37.4935 27.2797ZM24.0007 27.0401C24.6893 27.0401 25.33 26.8391 25.8727 26.4967C26.043 25.3953 26.629 24.401 27.5101 23.7185C27.5137 23.6526 27.52 23.5873 27.52 23.5208C27.52 21.5766 25.944 20.0009 24.0007 20.0009C22.0563 20.0009 20.4809 21.5766 20.4809 23.5208C20.4809 25.464 22.0563 27.0401 24.0007 27.0401ZM27.1618 30.3012C26.3389 29.5139 25.8584 28.4347 25.8239 27.2964C25.714 27.2884 25.6052 27.2797 25.4932 27.2797H22.5068C20.0217 27.2797 18 29.3014 18 31.7861V35.4393L18.0093 35.4956L18.2609 35.575C20.1634 36.1689 21.8613 36.4427 23.3361 36.5289V35.4258C23.3367 33.0064 24.9523 30.9586 27.1618 30.3012Z"
              fill="#5B93FF"
            />
          </svg>
          <div className="flex flex-col">
            <p className="leading-[36px] font-semibold	text-[30px] text-[#000000]">
              {analytics.dailyNewUsers}
            </p>
            <p className="leading-[21.82px] font-normal		text-[16px] text-[#787878]">
              Daily New Users
            </p>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border-[1px] rounded-[15px]  h-[116px] flex gap-[23px] pl-[28px] justify-start items-center text-center stat-card">
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect opacity="0.1" width="60" height="60" rx="30" fill="#5B93FF" />
            <path
              d="M32.483 23.4666C33.5927 24.1623 34.3708 25.3397 34.5125 26.7064C34.9778 26.9253 35.4856 27.039 35.9999 27.0395C37.944 27.0395 39.5197 25.4637 39.5197 23.5199C39.5197 21.5757 37.944 20 35.9999 20C34.0743 20.0006 32.5123 21.5482 32.483 23.4666ZM30.177 30.6735C32.1212 30.6735 33.6969 29.0974 33.6969 27.1536C33.6969 25.2097 32.1209 23.634 30.177 23.634C28.2332 23.634 26.6565 25.21 26.6565 27.1539C26.6565 29.0977 28.2332 30.6735 30.177 30.6735ZM31.6701 30.9134H28.6833C26.1983 30.9134 24.1766 32.9354 24.1766 35.4204V39.073L24.1858 39.1302L24.4374 39.209C26.809 39.95 28.8693 40.1971 30.5652 40.1971C33.8775 40.1971 35.7974 39.2527 35.9157 39.1925L36.1508 39.0736H36.176V35.4204C36.1769 32.9354 34.1551 30.9134 31.6701 30.9134ZM37.4935 27.2797H34.5298C34.4997 28.424 34.0185 29.5101 33.191 30.3012C35.3999 30.958 37.0161 33.0064 37.0161 35.4258V36.5514C39.9423 36.4442 41.6286 35.6148 41.7397 35.5591L41.9748 35.4399H42V31.7861C42 29.3014 39.9783 27.2797 37.4935 27.2797ZM24.0007 27.0401C24.6893 27.0401 25.33 26.8391 25.8727 26.4967C26.043 25.3953 26.629 24.401 27.5101 23.7185C27.5137 23.6526 27.52 23.5873 27.52 23.5208C27.52 21.5766 25.944 20.0009 24.0007 20.0009C22.0563 20.0009 20.4809 21.5766 20.4809 23.5208C20.4809 25.464 22.0563 27.0401 24.0007 27.0401ZM27.1618 30.3012C26.3389 29.5139 25.8584 28.4347 25.8239 27.2964C25.714 27.2884 25.6052 27.2797 25.4932 27.2797H22.5068C20.0217 27.2797 18 29.3014 18 31.7861V35.4393L18.0093 35.4956L18.2609 35.575C20.1634 36.1689 21.8613 36.4427 23.3361 36.5289V35.4258C23.3367 33.0064 24.9523 30.9586 27.1618 30.3012Z"
              fill="#5B93FF"
            />
          </svg>
          <div className="flex flex-col">
            <p className="leading-[36px] font-semibold	text-[30px] text-[#000000]">
              {analytics.totalUsers}
            </p>
            <p className="leading-[21.82px] font-normal		text-[16px] text-[#787878]">
              Total Leads
            </p>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border-[1px] rounded-[15px]  h-[116px] flex gap-[23px] pl-[28px] justify-start items-center text-center stat-card">
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect opacity="0.2" width="60" height="60" rx="30" fill="#FFD66B" />
            <path
              d="M29.4419 30.2756C32.8325 30.2756 35.5812 27.5276 35.5812 24.1378C35.5812 20.748 32.8325 18 29.4419 18C26.0514 18 23.3027 20.748 23.3027 24.1378C23.3027 27.5276 26.0514 30.2756 29.4419 30.2756Z"
              fill="#FFC327"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M31.0319 40.8909C29.8285 39.6022 29.1601 37.9043 29.1622 36.1413C29.1622 34.2632 29.9067 32.5569 31.1167 31.3025C30.5698 31.2601 30.0105 31.2378 29.4413 31.2378C25.7332 31.2378 22.4504 32.1652 20.4122 33.5545C18.8573 34.6147 18 35.9617 18 37.3756V38.9938C17.9996 39.243 18.0483 39.4899 18.1435 39.7203C18.2388 39.9507 18.3785 40.16 18.5548 40.3362C18.7311 40.5125 18.9405 40.6522 19.1709 40.7474C19.4013 40.8426 19.6483 40.8913 19.8976 40.8909H31.0319Z"
              fill="#FFC327"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M36.1385 30.2825C32.9037 30.2825 30.2783 32.9072 30.2783 36.1413C30.2783 39.3754 32.9037 42.0001 36.1385 42.0001C39.3733 42.0001 41.9986 39.3754 41.9986 36.1413C41.9986 32.9072 39.3733 30.2825 36.1385 30.2825ZM33.4417 37.1166L35.116 38.2326C35.277 38.3398 35.4702 38.3879 35.6627 38.3688C35.8552 38.3497 36.0352 38.2645 36.172 38.1277L38.9625 35.3378C39.1194 35.1809 39.2076 34.9682 39.2076 34.7463C39.2076 34.5245 39.1194 34.3117 38.9625 34.1549C38.8056 33.998 38.5928 33.9099 38.3709 33.9099C38.149 33.9099 37.9362 33.998 37.7793 34.1549L35.4732 36.4593L34.3704 35.7239C34.1856 35.6037 33.9609 35.5612 33.745 35.6056C33.5291 35.65 33.3394 35.7777 33.2171 35.9611C33.0949 36.1445 33.0499 36.3687 33.0919 36.585C33.1339 36.8014 33.2596 36.9924 33.4417 37.1166Z"
              fill="#FFC327"
            />
          </svg>

          <div className="flex flex-col">
            <p className="leading-[36px] font-semibold	text-[30px] text-[#000000]">
              {analytics.weeklyActiveUsers}
            </p>
            <p className="leading-[21.82px] font-normal		text-[16px] text-[#787878]">
              Weekly Active Leads{" "}
            </p>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border-[1px] rounded-[15px]  h-[116px] flex gap-[23px] pl-[28px] justify-start items-center text-center stat-card">
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect opacity="0.1" width="60" height="60" rx="30" fill="#FF8F6B" />
            <path
              d="M29.4419 30.2756C32.8325 30.2756 35.5812 27.5276 35.5812 24.1378C35.5812 20.748 32.8325 18 29.4419 18C26.0514 18 23.3027 20.748 23.3027 24.1378C23.3027 27.5276 26.0514 30.2756 29.4419 30.2756Z"
              fill="#FF8F6B"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M31.0319 40.8909C29.8285 39.6022 29.1601 37.9043 29.1622 36.1413C29.1622 34.2632 29.9067 32.5569 31.1167 31.3025C30.5698 31.2601 30.0105 31.2378 29.4413 31.2378C25.7332 31.2378 22.4504 32.1652 20.4122 33.5545C18.8573 34.6147 18 35.9617 18 37.3756V38.9938C17.9996 39.243 18.0483 39.4899 18.1435 39.7203C18.2388 39.9507 18.3785 40.16 18.5548 40.3362C18.7311 40.5125 18.9405 40.6522 19.1709 40.7474C19.4013 40.8426 19.6483 40.8913 19.8976 40.8909H31.0319Z"
              fill="#FF8F6B"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M36.1385 30.2825C32.9037 30.2825 30.2783 32.9072 30.2783 36.1413C30.2783 39.3754 32.9037 42.0001 36.1385 42.0001C39.3733 42.0001 41.9986 39.3754 41.9986 36.1413C41.9986 32.9072 39.3733 30.2825 36.1385 30.2825ZM33.4417 37.1166L35.116 38.2326C35.277 38.3398 35.4702 38.3879 35.6627 38.3688C35.8552 38.3497 36.0352 38.2645 36.172 38.1277L38.9625 35.3378C39.1194 35.1809 39.2076 34.9682 39.2076 34.7463C39.2076 34.5245 39.1194 34.3117 38.9625 34.1549C38.8056 33.998 38.5928 33.9099 38.3709 33.9099C38.149 33.9099 37.9362 33.998 37.7793 34.1549L35.4732 36.4593L34.3704 35.7239C34.1856 35.6037 33.9609 35.5612 33.745 35.6056C33.5291 35.65 33.3394 35.7777 33.2171 35.9611C33.0949 36.1445 33.0499 36.3687 33.0919 36.585C33.1339 36.8014 33.2596 36.9924 33.4417 37.1166Z"
              fill="#FF8F6B"
            />
          </svg>

          <div className="flex flex-col">
            <p className="leading-[36px] font-semibold	text-[30px] text-[#000000]">
              {analytics.monthlyActiveUsers}
            </p>
            <p className="leading-[21.82px] font-normal		text-[16px] text-[#787878]">
              Monthly Active Leads
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default WidgetUserCount;
