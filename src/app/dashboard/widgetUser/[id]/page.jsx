"use client";
import TableNoDataAvailable from "@/components/NodataWithLoading";
import Translate from "@/components/Translate";
import { LIMIT } from "@/constant";
import { formatApiFields } from "@/utils/fieldGenerator";
import { getPagesToShow } from "@/utils/getPagesToShow";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DashboardId = ({ params }) => {
  const { token, user } = useSelector((state) => state.auth.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [userActionList, setUserActionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const getAllWidgetUserActions = async () => {
    setLoading(true);
    let results;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/api/widget/widgetUserActions/${params.id}?page=${currentPage}&limit=${LIMIT}`
      );
      results = response?.data?.data ?? [];
      setUserActionList(results);
    } catch (error) {
      results = [];
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllWidgetUserActions();
  }, [currentPage]);

  if (token && user?.role === "admin") {
    return (
      <div className="mt-20 mx-[10%]">
        <div className="container mx-auto p-6 bg-white text-black">
          <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h1 className="text-3xl font-extrabold">User Actions Overview</h1>
          </div>

          <div className="grid grid-cols-2 md:!grid-cols-3 gap-6 mb-8 p-6 border rounded shadow-lg justify-between">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Total Actions</h2>
              <span className="text-2xl font-bold">
                {userActionList.totalActions}
              </span>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Total Unique Models</h2>
              <span className="text-2xl font-bold">
                {userActionList.totalUniqueModels}
              </span>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Actions Per Model</h2>
              <div className="flex flex-col items-center justify-center">
                {userActionList.actionsPerModel &&
                  Object.keys(userActionList.actionsPerModel).map(
                    (model, index) => (
                      <p key={index} className="text-gray-600">
                        {model}:{" "}
                        <span className="font-semibold">
                          {userActionList.actionsPerModel[model]}
                        </span>
                      </p>
                    )
                  )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:!rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  User ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Ref
                </th>
                <th scope="col" className="px-6 py-3">
                  Opt JSON
                </th>
                <th scope="col" className="px-6 py-3">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3">
                  Updated At
                </th>
                <th scope="col" className="px-6 py-3">
                  Deleted At
                </th>
              </tr>
            </thead>
            <tbody>
              {userActionList?.results?.length > 0 ? (
                userActionList?.results?.map((item, index) => {
                  return (
                    <tr key={index} className="bg-white border-b ">
                      <td className="px-6 py-4">{item.userId}</td>
                      <td className="px-6 py-4">{item.ref}</td>
                      <td className="px-6 py-4">
                        <table className="w-full text-sm text-left text-gray-500 shadow-lg rounded-lg overflow-hidden">
                          <tbody>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-200  ">
                              <td className="px-6 py-3 font-semibold">Image</td>
                              <td className="flex justify-around py-2">
                                <img
                                  src={item.optJson.image}
                                  alt="User Action"
                                  className="h-auto w-32 md:!w-60 rounded-lg object-cover shadow"
                                />
                                <img
                                  src={item.response}
                                  alt="User Action"
                                  className="h-auto w-32 md:!w-60 rounded-lg object-cover shadow"
                                />
                              </td>
                            </tr>
                            <tr className="bg-gray-50 ">
                              <td className="px-6 py-3 font-semibold">Usage</td>
                              <td className="px-6 py-3 text-black">
                                {formatApiFields(item.optJson.apiFields)}
                              </td>
                            </tr>
                            <tr className="bg-gray-100 ">
                              <td className="px-6 py-3 font-semibold">Model</td>
                              <td className="px-6 py-3">
                                {item.optJson.model === "decluttering"
                                  ? "Refurnishing"
                                  : item.optJson.model}
                              </td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="px-6 py-3 font-semibold">
                                Perview
                              </td>
                              <td className="px-6 py-3">
                                {item.optJson.perview}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {item.updatedAt
                          ? new Date(item.updatedAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        {item.deletedAt
                          ? new Date(item.deletedAt).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <TableNoDataAvailable loading={loading} />
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
          {getPagesToShow(currentPage, userActionList.totalPages).map(
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
            disabled={currentPage === userActionList.totalPages}
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
