"use client";
import Translate from "@/components/Translate";
import { LIMIT } from "@/constant";
import { getPagesToShow } from "@/utils/getPagesToShow";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DashboardId = ({ params }) => {
  const { token, user } = useSelector((state) => state.auth.user);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // const fetcher = (url) =>
  //   fetch(url, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({
  //       userId: params.id,
  //     }),
  //   }).then((r) => r.json());

  // const { data, error } = useSWR(
  //   `${process.env.NEXT_PUBLIC_API_URI}/api/users/userusage`,
  //   fetcher,
  // );
  const getUserusage = async () => {
    setLoading(true);
    let results;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/api/users/userusage/${params.id}?page=${currentPage}&limit=${LIMIT}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      results = response?.data ?? [];
      setData(results);
    } catch (error) {
      results = [];
    }
    setLoading(false);
  };

  useEffect(() => {
    getUserusage();
  }, [currentPage]);

  if (token && user?.role === "admin") {
    return (
      <div className=" mt-20 mx-[10%]">
        <div className="container mx-auto p-6 bg-white text-black">
          <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h1 className="text-3xl font-extrabold">User Actions Overview</h1>
          </div>

          <div className="grid grid-cols-2 md:!grid-cols-3 gap-6 mb-8 p-6 border rounded shadow-lg justify-between">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Total Actions</h2>
              <span className="text-2xl font-bold">
                {data?.analytics?.totalActions}
              </span>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Total Unique Models</h2>
              <span className="text-2xl font-bold">
                {data?.analytics?.totalUniqueModels}
              </span>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Actions Per Model</h2>
              <div className="flex flex-col items-center justify-center">
                {data?.analytics?.actionsPerModel &&
                  Object.keys(data?.analytics?.actionsPerModel).map(
                    (model, index) => {
                      return (
                        <p key={index} className="text-gray-600">
                          {model}:{" "}
                          <span className="font-semibold">
                            {data?.analytics?.actionsPerModel[model]}
                          </span>
                        </p>
                      );
                    }
                  )}
              </div>
            </div>
          </div>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:!rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  <Translate text="Model Name" />
                </th>
                <th scope="col" className="px-6 py-3">
                  <Translate text="Date" />
                </th>
                <th scope="col" className="px-6 py-3">
                  <Translate text="Input Image" />
                </th>
                <th scope="col" className="px-6 py-3">
                  <Translate text="Output Image" />
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.usage?.results?.map((item, index) => (
                <tr key={index} className="bg-white border-b ">
                  <td className="px-6 py-4 capitalize">
                    <Translate text={item.optJson.model} />
                  </td>
                  <td className="px-6 py-4 capitalize">
                    <Translate text={item.createdAt} />
                  </td>
                  <td
                    scope="row"
                    className="w-80 px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    <img src={item.optJson?.image} className="w-full" alt="" />
                  </td>
                  <td
                    scope="row"
                    className="w-80 px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    <img src={item?.response} className="w-full" alt="" />
                  </td>
                </tr>
              ))}
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
          {getPagesToShow(currentPage, data?.usage?.totalPages).map((page) => (
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
            disabled={currentPage === data?.usage?.totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <Translate text="Next" />
          </button>
        </div>
      </div>
    );
  } else {
    router.push("/");
  }
};

export default DashboardId;
