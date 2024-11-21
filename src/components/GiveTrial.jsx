"use client";
import React, { useEffect } from "react";
import Translate from "@/components/Translate";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "@mui/material";
import { getApiTrialUsers } from "@/services/apiandtrialusers";
import { formatDate } from "@/utils/timeFormate";

const GiveTrial = ({ trialUsers }) => {
  const router = useRouter();
  const [trialusers, setTrialusers] = useState(trialUsers);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [updateUserId, setUpdateUserId] = useState(null);

  useEffect(() => {
    if (updateUserId) {
      const userToUpdate = trialusers.find(
        (user) => user?.userId?._id === updateUserId
      );
      if (userToUpdate) {
        setName(userToUpdate?.userId?.name || "");
        setEmail(userToUpdate?.userId?.email || "");
      }
    }
  }, [updateUserId, trialusers]);

  const fetchData = async () => {
    try {
      const data = await getApiTrialUsers();
      setTrialusers(data?.trialUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const submitTrial = async (e) => {
    e.preventDefault();
    try {
      if (updateUserId) {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URI}/api/payment/updatetrialuser/${updateUserId}`,
          { name, email, password }
        );
        if (res?.data?.success) {
          setEmail(null);
          setPassword(null);
          setName(null);
          setOpen(false);
          fetchData();
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URI}/api/payment/paymenttrial/${process.env.NEXT_PUBLIC_API_FRONT}`,
          { name, email, password }
        );
        if (res?.data?.success) {
          setEmail(null);
          setPassword(null);
          setName(null);
          router.push(res.data.session?.url);
          setOpen(false);
          fetchData();
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      if (error.response) toast.error(error.response.data.message);
    }
  };
  const changeToExpiryDate = (date, plan) => {
    let paymentCreatedAt;
    if (date) paymentCreatedAt = new Date(date);
    if (plan === "annual" || plan === "yearly") {
      paymentCreatedAt?.setFullYear(paymentCreatedAt?.getFullYear() + 1);
    } else if (plan === "monthly") {
      paymentCreatedAt?.setMonth(paymentCreatedAt?.getMonth() + 1);
    }

    return formatDate(paymentCreatedAt?.toISOString());
  };
  return (
    <div>
      <div className="mt-20 mx-[5%]">
        <div className="container mx-auto p-6 bg-white text-black">
          <button
            onClick={() => {
              setOpen(true);
              setEmail(null);
              setPassword(null);
              setName(null);
            }}
            type="button"
            className="flex items-center justify-center !bg-black font-medium rounded-lg text-sm px-4 py-2 text-white"
          >
            <Translate text="Add User for Trial" />
          </button>
          <div className="overflow-x-auto my-5">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" className="px-4 py-4">
                    <Translate text="Name" />
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <Translate text="Email" />
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <Translate text="Plan" />
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <Translate text="Credits" />
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <Translate text="Monthly Credits left" />
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <Translate text="Plan Expire At" />
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <Translate text="Actions" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {trialusers?.length &&
                  trialusers?.map((item, index) => (
                    <tr key={index} className="border-b">
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {item?.userId?.name}
                      </th>
                      <td className="px-4 py-3">{item?.userId?.email}</td>
                      <td className="px-4 py-3">
                        {item?.userId?.planDuration}
                      </td>
                      <td className="px-4 py-3">{item?.userId?.credits}</td>
                      <td className="px-4 py-3">
                        {item?.userId?.creditsPerMonth}
                      </td>
                      <td className="px-4 py-3">
                        {changeToExpiryDate(
                          item?.userId?.createdAt,
                          item?.userId?.planDuration
                        )}
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          className="bg-green-400 text-white text-lg p-2 rounded-lg"
                          onClick={() => {
                            setUpdateUserId(item?.userId?._id);
                            setOpen(true);
                          }}
                        >
                          <Translate text="update" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <Modal
            open={open}
            onClose={() => {
              setOpen(false);
              setUpdateUserId(null);
            }}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <div className="absolute outline-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-100 rounded w-11/12 md:!w-5/12 xl:!w-3/12 p-3 shadow-lg">
              <h2 className="text-center text-xl font-bold mt-3">
                {updateUserId ? (
                  <Translate text="Update User" />
                ) : (
                  <Translate text="Add User" />
                )}
              </h2>
              <form className="pt-6 mb-4" onSubmit={submitTrial}>
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm mb-3">
                    <Translate text="Name" />
                  </label>
                  <input
                    type="text"
                    name="name"
                    id=""
                    placeholder="Enter User Full Name"
                    className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm mb-3">
                    <Translate text="Email" />
                  </label>
                  <input
                    type="email"
                    name="email"
                    id=""
                    placeholder="Enter User Email"
                    className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm mb-3">
                    <Translate text="Password" />
                  </label>
                  <input
                    className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="password"
                    name="password"
                    id=""
                    placeholder="Enter User Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>

                <button
                  type="submit"
                  className="!bg-mainColor text-sm hover:!bg-gray-500 text-white w-full py-1.5 rounded focus:outline-none focus:shadow-outline"
                >
                  <Translate text="Submit" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setUpdateUserId(null);
                  }}
                  className="mt-2 !bg-white text-sm border-[1px] border-black text-black font-semibold w-full py-1.5 rounded focus:outline-none focus:shadow-outline"
                >
                  <Translate text="Cancel" />
                </button>
              </form>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default GiveTrial;
