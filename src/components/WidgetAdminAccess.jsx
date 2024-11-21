"use client";
import React from "react";
import Translate from "./Translate";
import TableNoDataAvailable from "./NodataWithLoading";
import { formatDate } from "@/utils/timeFormate";
import { handleSort } from "@/utils/sortColums";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal } from "@mui/material";

const WidgetAdminAccess = () => {
  const { token } = useSelector((state) => state.auth.user);
  const [api, setApi] = useState(null);
  const [copy, setCopy] = useState(null);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [widgetAdmins, setWidgetAdmins] = useState(null);

  const [adminWidgetDetail, setAdminWidgetDetail] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    joinedOrigin: "",
  });
  const copyToClipboard = () => {
    setCopy(true);
    navigator.clipboard.writeText(api);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };

  const getWidgetAdmins = async () => {
    setLoading(true);
    try {
      let response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/api/widget/allWidgetUsers/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWidgetAdmins(response?.data?.widgetAdmins);
    } catch (error) {
      setWidgetAdmins([]);
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getWidgetAdmins();
  }, []);

  const submitAdminWidgetDetails = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/api/widget/adminregister`,
        adminWidgetDetail
      );

      if (res?.data?.success) {
        setAdminWidgetDetail({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          joinedOrigin: "",
        });
        getWidgetAdmins();
        setOpen(false);
        // Handle success, if needed
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error.response) toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <div className="mt-20 mx-[5%]">
        <div className="container mx-auto p-6 bg-white text-black">
          {/* <button
            onClick={() => {
              setOpen(true);
            }}
            type="button"
            className="flex items-center justify-center !bg-black font-medium rounded-lg text-sm px-4 py-2 text-white"
          >
            <Translate text="Add Admin for Widget" />
          </button> */}
          {/* <form
            className="flex flex-col gap-1"
            onSubmit={submitAdminWidgetDetails}
          >
            <input
              type="email"
              name="email"
              id=""
              value={adminWidgetDetail.email}
              placeholder="Admin Email"
              className="border-2 p-1 !border-mainColor"
              onChange={(e) =>
                setAdminWidgetDetail((prevDetails) => ({
                  ...prevDetails,
                  email: e.target.value,
                }))
              }
            />
            <input
              type="text"
              name="firstName"
              id=""
              value={adminWidgetDetail.firstName}
              placeholder="Admin Firstname"
              className="border-2 p-1 !border-mainColor"
              onChange={(e) =>
                setAdminWidgetDetail((prevDetails) => ({
                  ...prevDetails,
                  firstName: e.target.value,
                }))
              }
            />

            <input
              type="text"
              name="lastName"
              id=""
              value={adminWidgetDetail.lastName}
              placeholder="Admin Lastname"
              className="border-2 p-1 !border-mainColor"
              onChange={(e) =>
                setAdminWidgetDetail((prevDetails) => ({
                  ...prevDetails,
                  lastName: e.target.value,
                }))
              }
            />

            <input
              type="tel"
              name="phone"
              id=""
              placeholder="Admin Phone"
              value={adminWidgetDetail.phone}
              className="border-2 p-1 !border-mainColor"
              pattern="[0-9+]*"
              onChange={(e) =>
                setAdminWidgetDetail((prevDetails) => ({
                  ...prevDetails,
                  phone: e.target.value,
                }))
              }
            />
            <input
              type="text"
              name="joinurl"
              id=""
              placeholder="Website domain where widget is displayed"
              value={adminWidgetDetail.joinedOrigin}
              className="border-2 p-1 !border-mainColor"
              onChange={(e) =>
                setAdminWidgetDetail((prevDetails) => ({
                  ...prevDetails,
                  joinedOrigin: e.target.value,
                }))
              }
            />

            <button
              type="submit"
              className="!bg-mainColor text-white p-2 rounded"
            >
              <Translate text="Submit" />
            </button>
          </form> */}
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <div className="absolute outline-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-100 rounded w-11/12 md:!w-5/12 xl:!w-3/12 p-3 shadow-lg">
              <h2 className="text-center text-xl font-bold mt-3">Add</h2>
              <form className="pt-6 mb-4" onSubmit={submitAdminWidgetDetails}>
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm mb-3">
                    <Translate text="Email" />
                  </label>
                  <input
                    type="email"
                    name="email"
                    id=""
                    value={adminWidgetDetail.email}
                    placeholder="Admin Email"
                    className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) =>
                      setAdminWidgetDetail((prevDetails) => ({
                        ...prevDetails,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm mb-3">
                    <Translate text="Firstname" />
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    id=""
                    placeholder="Admin Firstname"
                    value={adminWidgetDetail.firstName}
                    className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) =>
                      setAdminWidgetDetail((prevDetails) => ({
                        ...prevDetails,
                        firstName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm mb-3">
                    <Translate text="Lastname" />
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    id=""
                    placeholder="Admin Lastname"
                    value={adminWidgetDetail.lastName}
                    className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) =>
                      setAdminWidgetDetail((prevDetails) => ({
                        ...prevDetails,
                        lastName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm mb-3">
                    <Translate text="Phone" />
                  </label>
                  <input
                    className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="tel"
                    name="phone"
                    id=""
                    placeholder="Admin Phone"
                    value={adminWidgetDetail.phone}
                    onChange={(e) =>
                      setAdminWidgetDetail((prevDetails) => ({
                        ...prevDetails,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm mb-3">
                    <Translate text="Joined URL" />
                  </label>
                  <input
                    type="text"
                    name="joinedurl"
                    id=""
                    placeholder="Website domain where widget is displayed"
                    value={adminWidgetDetail.joinedOrigin}
                    className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) =>
                      setAdminWidgetDetail((prevDetails) => ({
                        ...prevDetails,
                        joinedOrigin: e.target.value,
                      }))
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="!bg-mainColor text-sm hover:!bg-gray-500 text-white w-full py-1.5 rounded focus:outline-none focus:shadow-outline"
                >
                  <Translate text="Submit" />
                </button>
              </form>
            </div>
          </Modal>

          <div className="relative overflow-x-auto shadow-md sm:!rounded-lg mt-5">
            <h1 className="text-xl font-semibold mb-2 p-3">
              <Translate text="Widget Admins" />
            </h1>
            <table className="w-full text-sm text-left text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">
                    <Translate text="Email" />
                  </th>
                  <th className="px-6 py-3">
                    <Translate text="Phone" />
                  </th>
                  <th className="px-6 py-3">
                    <Translate text="First Name" />
                  </th>
                  <th className="px-6 py-3">
                    <Translate text="Last Name" />
                  </th>
                  <th className="px-6 py-3">
                    <Translate text="Joined Origin" />
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
                </tr>
              </thead>
              <tbody>
                {widgetAdmins?.length > 0 ? (
                  widgetAdmins.map((user, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b  hover:!bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-6 py-2 ">{user.email}</td>
                      <td className="px-6 py-2">{user.phone}</td>
                      <td className="px-6 py-2 ">{user.firstName}</td>
                      <td className="px-6 py-2 ">{user.lastName}</td>
                      <td className="px-6 py-2 ">{user.joinedOrigin}</td>
                      <td className="px-6 py-2 ">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <TableNoDataAvailable loading={loading} colSpan={11} />
                )}
              </tbody>
            </table>
          </div>

          {api ? (
            <span className="text-green-600 text-[0.9em] font-[400] flex flex-col items-start mt-[10px]">
              <Translate text="Add Sucessfully, User API is:" />{" "}
              <span
                onClick={copyToClipboard}
                className="cursor-pointer font-[800]"
              >
                {api}

                {copy ? (
                  <span className="text-white !bg-mainColor p-[5px] rounded-[5px] text-[0.8rem] font-[500] ml-[10px] mt-[10px]">
                    <Translate text="Copied" />
                  </span>
                ) : null}
              </span>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default WidgetAdminAccess;
